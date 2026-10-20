import { Router, Response } from 'express';
import { db } from '../database/mongo';
import { authenticateToken, requireWrite, requireDataEntryOrAdmin, AuthenticatedRequest } from '../middleware/auth';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = Router();
const uploadMem = multer({ storage: multer.memoryStorage() });

// CSV Formula Injection Sanitizer (OWASP CWE-1236)
function sanitizeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();
  // If the cell begins with =, +, -, @, tab, or carriage return, prepend a single quote to neutralize formula execution
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

// Helper to generate next unique Application ID
async function generateApplicationId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `BACMS-${currentYear}-`;

  const lastApp = await db.application.findFirst({
    where: {
      applicationId: { startsWith: prefix }
    },
    orderBy: { id: 'desc' },
    select: { applicationId: true }
  });

  let nextSeq = 1;
  if (lastApp && lastApp.applicationId) {
    const parts = lastApp.applicationId.split('-');
    if (parts.length === 3) {
      const num = parseInt(parts[2]);
      if (!isNaN(num)) {
        nextSeq = num + 1;
      }
    }
  }

  return `${prefix}${String(nextSeq).padStart(4, '0')}`;
}

// Enforce authentication on all application management routes
router.use(authenticateToken);

// POST /api/applications - Create new application (Restricted to Admin and Data Entry)
router.post('/', requireDataEntryOrAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      applicantName,
      mobileNumber,
      alternateMobile,
      address,
      districtId,
      constituencyId,
      constituencyName,
      categoryId,
      categoryName,
      category: categoryInput,
      subject,
      description,
      priority,
      assignedEmployee,
      status,
      internalRemarks,
      documents,
      dateReceived
    } = req.body;

    // 1. Validate basic applicant fields
    if (!applicantName || !mobileNumber || !address || !districtId || !subject || !description) {
      return res.status(400).json({ error: 'Please provide all mandatory applicant and grievance fields.' });
    }

    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number is required.' });
    }

    // 2. Validate Assembly Constituency (MANDATORY)
    if (!constituencyId && !constituencyName) {
      return res.status(400).json({ error: 'Please enter or select Assembly Constituency.' });
    }

    let finalConstituencyId: number | null = null;
    let finalVerifiedAcCode = 'UNVERIFIED';
    let finalCustomConstituency: string | null = null;
    let isUnverifiedAc = false;

    if (constituencyId) {
      const constituency = await db.assemblyConstituency.findUnique({
        where: { id: parseInt(constituencyId) },
        include: { district: true }
      });

      if (!constituency) {
        return res.status(400).json({ error: 'Selected Assembly Constituency not found in official roster.' });
      }

      if (constituency.districtId !== parseInt(districtId)) {
        return res.status(400).json({
          error: `Invalid mapping: Constituency "${constituency.name}" belongs to district "${constituency.district.name}", not selected district ID ${districtId}.`
        });
      }

      finalConstituencyId = constituency.id;
      finalVerifiedAcCode = constituency.acCode;
      isUnverifiedAc = false;
    } else if (constituencyName && typeof constituencyName === 'string') {
      const trimmedAcName = constituencyName.trim();
      // Search for match in official Assembly roster
      const matchedAc = await db.assemblyConstituency.findFirst({
        where: {
          districtId: parseInt(districtId),
          name: { equals: trimmedAcName }
        }
      });

      if (matchedAc) {
        finalConstituencyId = matchedAc.id;
        finalVerifiedAcCode = matchedAc.acCode;
        isUnverifiedAc = false;
      } else {
        // Flag unmatched manual entry for administrative review rather than silently treating as verified
        finalConstituencyId = null;
        finalCustomConstituency = trimmedAcName;
        finalVerifiedAcCode = 'UNVERIFIED';
        isUnverifiedAc = true;
      }
    }

    // 3. Validate Complaint Category (MANDATORY & MANUAL TEXT ENTRY)
    const rawCategory = (categoryName || categoryInput || '').trim();
    let finalCategoryId: number | null = categoryId ? parseInt(categoryId) : null;
    let finalCategoryName = rawCategory;

    if (!rawCategory && !finalCategoryId) {
      return res.status(400).json({ error: 'Please enter a complaint category.' });
    }

    if (rawCategory) {
      finalCategoryName = rawCategory;
      // Find or create in ComplaintCategory table so autocomplete, master filters, and reporting function dynamically
      let cat = await db.complaintCategory.findFirst({
        where: { name: { equals: rawCategory } }
      });

      if (!cat) {
        const codeSlug = 'CAT-' + rawCategory.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 12) + '-' + Math.floor(100 + Math.random() * 900);
        cat = await db.complaintCategory.create({
          data: {
            name: rawCategory,
            code: codeSlug,
            description: 'Citizen/User-defined complaint category'
          }
        });
      }
      finalCategoryId = cat.id;
    } else if (finalCategoryId) {
      const cat = await db.complaintCategory.findUnique({ where: { id: finalCategoryId } });
      if (cat) {
        finalCategoryName = cat.name;
      }
    }

    // 4. Generate Unique Application ID
    const applicationId = await generateApplicationId();

    const applicationPriority = (priority === 'IMPORTANT' || priority === 'Important') ? 'IMPORTANT' : 'NORMAL';
    const applicationStatus = status ? status.toUpperCase() : 'PENDING';
    const receivedDateObj = dateReceived ? new Date(dateReceived) : new Date();

    // Default follow up date: 7 days from now
    const defaultFollowUp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const created = await db.application.create({
      data: {
        applicationId,
        applicantName: applicantName.trim(),
        mobileNumber: mobileNumber.trim(),
        alternateMobile: alternateMobile ? alternateMobile.trim() : null,
        address: address.trim(),
        districtId: parseInt(districtId),
        constituencyId: finalConstituencyId,
        customConstituency: finalCustomConstituency,
        verifiedAcCode: finalVerifiedAcCode,
        isUnverifiedAc,
        categoryId: finalCategoryId,
        categoryName: finalCategoryName,
        subject: subject.trim(),
        description: description.trim(),
        priority: applicationPriority,
        status: applicationStatus,
        assignedEmployee: assignedEmployee ? assignedEmployee.trim() : 'Unassigned',
        internalRemarks: internalRemarks ? internalRemarks.trim() : null,
        documents: documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : null,
        dateReceived: receivedDateObj,
        nextFollowUpDate: defaultFollowUp,
        lastActionTaken: 'Record registered in Sammohan Bihar portal'
      },
      include: {
        district: true,
        constituency: true,
        category: true
      }
    });

    // Record initial follow-up
    await db.followUp.create({
      data: {
        applicationId: created.id,
        actionTaken: 'Initial Application Registration',
        reminderNotes: isUnverifiedAc
          ? `Application registered. Constituency '${finalCustomConstituency}' flagged for official delimitation review.`
          : 'Application submitted and verified against Bihar Assembly Constituency database.',
        previousStatus: 'NEW',
        newStatus: applicationStatus,
        assignedTo: created.assignedEmployee,
        nextFollowUpDate: defaultFollowUp,
        actionBy: (req as any).user ? (req as any).user.name : 'Web Intake Desk'
      }
    });

    // Audit log
    await db.auditLog.create({
      data: {
        applicationId: created.id,
        entityType: 'APPLICATION',
        action: 'CREATE',
        details: `Application ${created.applicationId} registered for ${created.applicantName} (${created.verifiedAcCode} - ${created.constituency?.name || created.customConstituency}). Category: "${created.categoryName}". Priority: ${created.priority}`,
        performedBy: (req as any).user ? (req as any).user.email : 'Citizen / Intake Desk',
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      applicationId: created.applicationId,
      application: created
    });
  } catch (error: any) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to record application. Please try again.' });
  }
});

// GET /api/applications - List with filters, search, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search,
      districtId,
      constituencyId,
      categoryId,
      category,
      priority,
      status,
      assignedEmployee,
      viewType,
      dateFrom,
      dateTo,
      page = '1',
      limit = '15',
      sortBy = 'dateReceived',
      sortOrder = 'desc'
    } = req.query;

    const where: any = {};

    // Free text search
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.trim();
      where.OR = [
        { applicationId: { contains: q } },
        { applicantName: { contains: q } },
        { mobileNumber: { contains: q } },
        { subject: { contains: q } },
        { verifiedAcCode: { contains: q } },
        { categoryName: { contains: q } },
        { customConstituency: { contains: q } }
      ];
    }

    // Specific filters
    if (districtId) where.districtId = parseInt(districtId as string);
    if (constituencyId) where.constituencyId = parseInt(constituencyId as string);
    if (categoryId) where.categoryId = parseInt(categoryId as string);
    if (category && typeof category === 'string') {
      where.categoryName = { contains: category.trim() };
    }
    if (priority) where.priority = (priority as string).toUpperCase();
    if (status) {
      const s = (status as string).toUpperCase();
      if (s === 'ACTIVE_FOLLOWUPS' || s === 'FOLLOWUPS') {
        where.status = { in: ['PENDING', 'IN_PROGRESS'] };
      } else if (s === 'DISPOSED' || s === 'COMPLETED') {
        where.status = { in: ['COMPLETED', 'DISPOSED'] };
      } else {
        where.status = s;
      }
    }
    if (assignedEmployee && typeof assignedEmployee === 'string') {
      where.assignedEmployee = { contains: assignedEmployee.trim() };
    }

    // Date range
    if (dateFrom || dateTo) {
      where.dateReceived = {};
      if (dateFrom) where.dateReceived.gte = new Date(dateFrom as string);
      if (dateTo) {
        const dTo = new Date(dateTo as string);
        dTo.setHours(23, 59, 59, 999);
        where.dateReceived.lte = dTo;
      }
    }

    // Separate View Types
    const now = new Date();
    if (viewType === 'important') {
      where.priority = 'IMPORTANT';
    } else if (viewType === 'normal') {
      where.priority = 'NORMAL';
    } else if (viewType === 'pending') {
      where.status = 'PENDING';
    } else if (viewType === 'in_progress') {
      where.status = 'IN_PROGRESS';
    } else if (viewType === 'completed' || viewType === 'disposed') {
      where.status = { in: ['COMPLETED', 'DISPOSED'] };
    } else if (viewType === 'active_followups' || viewType === 'followups') {
      where.status = { in: ['PENDING', 'IN_PROGRESS'] };
    } else if (viewType === 'overdue') {
      where.status = { not: 'COMPLETED' };
      where.nextFollowUpDate = { lte: now };
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const pageSize = Math.max(1, parseInt(limit as string));
    const skip = (pageNum - 1) * pageSize;

    const orderByField = (sortBy as string) || 'dateReceived';
    const orderDirection = (sortOrder as string).toLowerCase() === 'asc' ? 'asc' : 'desc';

    const [total, applications] = await Promise.all([
      db.application.count({ where }),
      db.application.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [orderByField]: orderDirection },
        include: {
          district: { select: { id: true, name: true, code: true } },
          constituency: { select: { id: true, name: true, acCode: true, acNumber: true } },
          category: { select: { id: true, name: true, code: true } },
          _count: { select: { followUps: true } }
        }
      })
    ]);

    // Enhance application objects with calculated helper metrics
    const enhancedApps = applications.map((app) => {
      const daysSinceReceipt = Math.floor(
        (now.getTime() - new Date(app.dateReceived).getTime()) / (1000 * 60 * 60 * 24)
      );
      const daysSinceLastUpdate = Math.floor(
        (now.getTime() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const isOverdue =
        app.status !== 'COMPLETED' &&
        app.nextFollowUpDate !== null &&
        new Date(app.nextFollowUpDate).getTime() < now.getTime();

      return {
        ...app,
        daysSinceReceipt,
        daysSinceLastUpdate,
        isOverdue
      };
    });

    res.json({
      total,
      page: pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      applications: enhancedApps
    });
  } catch (error: any) {
    console.error('Error listing applications:', error);
    res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
});

// GET /api/applications/:id - Detailed view with audit logs and follow-up trail
router.get('/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    let where: any = {};
    if (/^\d+$/.test(idParam)) {
      where = { id: parseInt(idParam) };
    } else {
      where = { applicationId: idParam };
    }

    const application = await db.application.findFirst({
      where,
      include: {
        district: true,
        constituency: true,
        category: true,
        followUps: {
          orderBy: { createdAt: 'desc' }
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const now = new Date();
    const daysSinceReceipt = Math.floor(
      (now.getTime() - new Date(application.dateReceived).getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysSinceLastUpdate = Math.floor(
      (now.getTime() - new Date(application.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const isOverdue =
      application.status !== 'COMPLETED' &&
      application.nextFollowUpDate !== null &&
      new Date(application.nextFollowUpDate).getTime() < now.getTime();

    res.json({
      application: {
        ...application,
        daysSinceReceipt,
        daysSinceLastUpdate,
        isOverdue
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching application details' });
  }
});

// PUT /api/applications/:id - Edit application record
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userRole = req.user?.role;

    if (userRole === 'READONLY') {
      return res.status(403).json({
        error: 'Permission denied: Read-Only users cannot modify application records.'
      });
    }

    const existing = await db.application.findUnique({
      where: { id },
      include: { category: true, constituency: true }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Application record not found' });
    }

    const {
      applicantName,
      mobileNumber,
      alternateMobile,
      address,
      subject,
      description,
      priority,
      status,
      assignedEmployee,
      internalRemarks,
      categoryId,
      categoryName,
      constituencyId,
      constituencyName,
      completionNotes
    } = req.body;

    // RBAC: REVIEWER cannot modify applicant registration profile
    if (userRole === 'REVIEWER') {
      const isAttemptingApplicantDataChange =
        (applicantName !== undefined && applicantName.trim() !== existing.applicantName) ||
        (mobileNumber !== undefined && mobileNumber.trim() !== existing.mobileNumber) ||
        (alternateMobile !== undefined && alternateMobile !== existing.alternateMobile) ||
        (address !== undefined && address.trim() !== existing.address) ||
        (subject !== undefined && subject.trim() !== existing.subject) ||
        (description !== undefined && description.trim() !== existing.description) ||
        (constituencyId !== undefined && parseInt(constituencyId) !== existing.constituencyId) ||
        (categoryName !== undefined && categoryName.trim() !== existing.categoryName);

      if (isAttemptingApplicantDataChange) {
        return res.status(403).json({
          error: 'Permission denied: Reviewers can update status, remarks, and employee assignments, but cannot modify applicant profile details.'
        });
      }
    }

    const updateData: any = {};
    const auditChanges: string[] = [];

    if (applicantName && applicantName.trim() !== existing.applicantName) {
      updateData.applicantName = applicantName.trim();
      auditChanges.push(`Applicant Name changed to "${applicantName.trim()}"`);
    }
    if (mobileNumber && mobileNumber.trim() !== existing.mobileNumber) {
      updateData.mobileNumber = mobileNumber.trim();
      auditChanges.push(`Mobile Number updated`);
    }
    if (alternateMobile !== undefined) updateData.alternateMobile = alternateMobile;
    if (address && address.trim() !== existing.address) updateData.address = address.trim();
    if (subject && subject.trim() !== existing.subject) updateData.subject = subject.trim();
    if (description && description.trim() !== existing.description) updateData.description = description.trim();
    if (assignedEmployee && assignedEmployee.trim() !== existing.assignedEmployee) {
      updateData.assignedEmployee = assignedEmployee.trim();
      auditChanges.push(`Assigned employee changed from "${existing.assignedEmployee}" to "${assignedEmployee.trim()}"`);
    }
    if (internalRemarks !== undefined) updateData.internalRemarks = internalRemarks;

    // Complaint Category update / preservation:
    // If categoryName is provided, update it and link to ComplaintCategory
    // If not provided in edit payload, preserve original categoryName intact!
    if (categoryName !== undefined && categoryName.trim() !== '') {
      const trimmedCat = categoryName.trim();
      if (trimmedCat !== existing.categoryName) {
        updateData.categoryName = trimmedCat;
        auditChanges.push(`Complaint Category changed from "${existing.categoryName || existing.category?.name}" to "${trimmedCat}"`);

        // Find or create category in ComplaintCategory table
        let cat = await db.complaintCategory.findFirst({
          where: { name: { equals: trimmedCat } }
        });
        if (!cat) {
          const codeSlug = 'CAT-' + trimmedCat.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 12) + '-' + Math.floor(100 + Math.random() * 900);
          cat = await db.complaintCategory.create({
            data: {
              name: trimmedCat,
              code: codeSlug,
              description: 'Citizen/User-defined category'
            }
          });
        }
        updateData.categoryId = cat.id;
      }
    } else if (categoryId && parseInt(categoryId) !== existing.categoryId) {
      updateData.categoryId = parseInt(categoryId);
      const cat = await db.complaintCategory.findUnique({ where: { id: parseInt(categoryId) } });
      if (cat) {
        updateData.categoryName = cat.name;
        auditChanges.push(`Complaint Category updated to "${cat.name}"`);
      }
    }

    // Assembly Constituency update
    if (constituencyId && parseInt(constituencyId) !== existing.constituencyId) {
      const ac = await db.assemblyConstituency.findUnique({ where: { id: parseInt(constituencyId) } });
      if (ac) {
        updateData.constituencyId = ac.id;
        updateData.verifiedAcCode = ac.acCode;
        updateData.isUnverifiedAc = false;
        auditChanges.push(`Assembly Constituency changed to ${ac.name} (${ac.acCode})`);
      }
    }

    // Check Priority Change
    if (priority && priority.toUpperCase() !== existing.priority) {
      updateData.priority = priority.toUpperCase();
      auditChanges.push(`Priority changed from ${existing.priority} to ${priority.toUpperCase()}`);
    }

    // Check Status Change
    if (status && status.toUpperCase() !== existing.status) {
      const newStatus = status.toUpperCase();
      updateData.status = newStatus;
      if (newStatus === 'COMPLETED') {
        updateData.completedAt = new Date();
        updateData.completionNotes = completionNotes || req.body.completionNotes || 'Marked as completed by staff';
      }
      auditChanges.push(`Status changed from ${existing.status} to ${newStatus}`);
    }

    // Support updating or appending attached documents
    if (req.body.documents !== undefined) {
      updateData.documents = typeof req.body.documents === 'string'
        ? req.body.documents
        : JSON.stringify(req.body.documents);
      auditChanges.push('Attached documents & evidence updated');
    }

    const updated = await db.application.update({
      where: { id },
      data: updateData,
      include: { district: true, constituency: true, category: true }
    });

    if (auditChanges.length > 0) {
      await db.auditLog.create({
        data: {
          applicationId: id,
          entityType: 'APPLICATION',
          action: 'UPDATE',
          details: auditChanges.join('; '),
          performedBy: req.user?.email || 'staff',
          ipAddress: req.ip
        }
      });
    }

    res.json({ success: true, application: updated });
  } catch (error: any) {
    res.status(500).json({ error: 'Error updating application record' });
  }
});

// GET /api/applications/export/csv
router.get('/export/csv', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { districtId, categoryId, category, priority, status, viewType, search } = req.query;
    const where: any = {};
    if (districtId) where.districtId = parseInt(districtId as string);
    if (categoryId) where.categoryId = parseInt(categoryId as string);
    if (category && typeof category === 'string') {
      where.categoryName = { contains: category.trim() };
    }
    if (priority) where.priority = (priority as string).toUpperCase();
    if (status) where.status = (status as string).toUpperCase();

    if (viewType) {
      const vt = (viewType as string).toLowerCase();
      if (vt === 'important') {
        where.priority = 'IMPORTANT';
      } else if (vt === 'normal') {
        where.priority = 'NORMAL';
      } else if (vt === 'active_followups' || vt === 'active' || vt === 'reminders') {
        where.status = { in: ['PENDING', 'IN_PROGRESS'] };
      } else if (vt === 'disposed' || vt === 'completed') {
        where.status = { in: ['COMPLETED', 'DISPOSED'] };
      }
    }

    if (search && typeof search === 'string') {
      const s = search.trim();
      where.OR = [
        { applicationId: { contains: s } },
        { applicantName: { contains: s } },
        { mobileNumber: { contains: s } },
        { subject: { contains: s } },
        { description: { contains: s } }
      ];
    }

    const apps = await db.application.findMany({
      where,
      orderBy: { dateReceived: 'desc' },
      include: { district: true, constituency: true, category: true }
    });

    // Audit log CSV export
    await db.auditLog.create({
      data: {
        entityType: 'APPLICATION',
        action: 'EXPORT_CSV',
        details: `Exported ${apps.length} applications to CSV file.`,
        performedBy: req.user?.email || 'authenticated_user',
        ipAddress: req.ip
      }
    }).catch(() => {});

    const headers = [
      'Application_ID',
      'Date_Received',
      'Applicant_Name',
      'Mobile_Number',
      'District',
      'Assembly_Constituency',
      'Assembly_Code',
      'Category',
      'Priority',
      'Status',
      'Assigned_Employee',
      'Subject',
      'Last_Updated'
    ];

    const rows = apps.map(a => [
      sanitizeCsvValue(a.applicationId),
      sanitizeCsvValue(a.dateReceived.toISOString().split('T')[0]),
      sanitizeCsvValue(a.applicantName),
      sanitizeCsvValue(a.mobileNumber),
      sanitizeCsvValue(a.district.name),
      sanitizeCsvValue(a.constituency?.name || a.customConstituency || 'Unassigned'),
      sanitizeCsvValue(a.verifiedAcCode),
      sanitizeCsvValue(a.categoryName || a.category?.name || 'General'),
      sanitizeCsvValue(a.priority),
      sanitizeCsvValue(a.status),
      sanitizeCsvValue(a.assignedEmployee),
      sanitizeCsvValue(a.subject),
      sanitizeCsvValue(a.updatedAt.toISOString().split('T')[0])
    ]);

    const csvData = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Sammohan_Applications_Export.csv"');
    res.send(csvData);
  } catch (error: any) {
    res.status(500).json({ error: 'Error exporting CSV' });
  }
});

// DELETE /api/applications/:id - Delete single application record
router.delete('/:id', authenticateToken, requireWrite, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const existing = await db.application.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Application record not found' });
    }

    // Delete associated follow-ups
    await db.followUp.deleteMany({
      where: { applicationId: id }
    });

    // Delete associated audit logs
    await db.auditLog.deleteMany({
      where: { applicationId: id }
    });

    // Clean up physical document files if present in uploads
    if (existing.documents) {
      try {
        const docs = typeof existing.documents === 'string' ? JSON.parse(existing.documents) : existing.documents;
        if (Array.isArray(docs)) {
          for (const doc of docs) {
            const docPath = doc.path || doc.filePath;
            if (docPath && fs.existsSync(docPath)) {
              fs.unlinkSync(docPath);
            }
          }
        }
      } catch (e) {
        console.warn('Could not remove document file:', e);
      }
    }

    // Delete the application itself
    await db.application.delete({
      where: { id }
    });

    // Record deletion event in system audit trail
    await db.auditLog.create({
      data: {
        entityType: 'APPLICATION',
        action: 'DELETE',
        details: `Deleted application record ${existing.applicationId} (${existing.applicantName})`,
        performedBy: req.user?.email || 'staff',
        ipAddress: req.ip
      }
    }).catch(() => {});

    res.json({
      success: true,
      message: `Application ${existing.applicationId} permanently deleted.`
    });
  } catch (error: any) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application record' });
  }
});

// POST /api/applications/bulk-delete - Delete multiple application records
router.post('/bulk-delete', authenticateToken, requireWrite, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of application IDs to delete.' });
    }

    const numericIds = ids.map((i: any) => parseInt(i)).filter((i: number) => !isNaN(i));
    if (numericIds.length === 0) {
      return res.status(400).json({ error: 'No valid application IDs found.' });
    }

    const apps = await db.application.findMany({
      where: { id: { in: numericIds } }
    });

    // Delete follow-ups
    await db.followUp.deleteMany({
      where: { applicationId: { in: numericIds } }
    });

    // Delete audit logs
    await db.auditLog.deleteMany({
      where: { applicationId: { in: numericIds } }
    });

    // Delete physical files
    for (const a of apps) {
      if (a.documents) {
        try {
          const docs = typeof a.documents === 'string' ? JSON.parse(a.documents) : a.documents;
          if (Array.isArray(docs)) {
            for (const doc of docs) {
              const docPath = doc.path || doc.filePath;
              if (docPath && fs.existsSync(docPath)) {
                fs.unlinkSync(docPath);
              }
            }
          }
        } catch (e) {}
      }
    }

    // Delete applications
    const deletedCount = await db.application.deleteMany({
      where: { id: { in: numericIds } }
    });

    // Audit log
    await db.auditLog.create({
      data: {
        entityType: 'APPLICATION',
        action: 'BULK_DELETE',
        details: `Bulk deleted ${deletedCount.count} application records.`,
        performedBy: req.user?.email || 'staff',
        ipAddress: req.ip
      }
    }).catch(() => {});

    res.json({
      success: true,
      count: deletedCount.count,
      message: `Successfully deleted ${deletedCount.count} application records.`
    });
  } catch (error: any) {
    console.error('Error in bulk-delete:', error);
    res.status(500).json({ error: 'Failed to bulk delete applications' });
  }
});

// POST /api/applications/clear-all & /clear-demo - Delete all application records from the database
router.post(['/clear-all', '/clear-demo'], authenticateToken, requireWrite, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Delete all follow-ups first
    await db.followUp.deleteMany({});

    // Delete all applications
    const deletedCount = await db.application.deleteMany({});

    // Audit log
    await db.auditLog.create({
      data: {
        entityType: 'APPLICATION',
        action: 'CLEAR_ALL',
        details: `Cleared all application data (${deletedCount.count} records purged).`,
        performedBy: req.user?.email || 'staff',
        ipAddress: req.ip
      }
    }).catch(() => {});

    res.json({
      success: true,
      count: deletedCount.count,
      message: `Successfully cleared all ${deletedCount.count} application records.`
    });
  } catch (error: any) {
    console.error('Error in clear-all:', error);
    res.status(500).json({ error: 'Failed to clear all applications' });
  }
});

// POST /api/applications/restore-reference - Load reference applications with viewable documents
router.post('/restore-reference', authenticateToken, requireWrite, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uploadDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Ensure sample documents exist in uploadDir
    const samplePdfName = 'reference_grievance_representation.pdf';
    const samplePdfPath = path.join(uploadDir, samplePdfName);
    if (!fs.existsSync(samplePdfPath)) {
      const minimalPdf = Buffer.from(
        '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF'
      );
      fs.writeFileSync(samplePdfPath, minimalPdf);
    }

    const samplePngName = 'reference_inspection_evidence.png';
    const samplePngPath = path.join(uploadDir, samplePngName);
    if (!fs.existsSync(samplePngPath)) {
      // 1x1 valid transparent PNG
      const minimalPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync(samplePngPath, minimalPng);
    }

    // Delete existing applications & follow-ups
    await db.followUp.deleteMany({});
    await db.application.deleteMany({});

    // Fetch master districts
    const districts = await db.district.findMany({ include: { constituencies: true } });
    const categories = await db.complaintCategory.findMany();
    const defaultCat = categories[0] || { id: 1, name: 'Roads and infrastructure' };

    const officers = [
      { name: 'Er. Ramesh Pandey (AE - RWD)', dept: 'Rural Works Department (RWD)' },
      { name: 'Dr. K. K. Verma (Civil Surgeon)', dept: 'Health Department' },
      { name: 'Vikramaditya Singh (SDO Social Welfare)', dept: 'Social Welfare Department' },
      { name: 'Shyam Kishor (PHED SDO)', dept: 'Public Health Engineering Dept (PHED)' },
      { name: 'Amitabh Sen (AEE - NBPDCL)', dept: 'Energy Department (NBPDCL)' },
      { name: 'Praveen Kumar (Circle Officer)', dept: 'Revenue & Land Reforms' },
      { name: 'Smt. Renu Kumari (District Education Officer)', dept: 'Education Department' },
      { name: 'Alok Ranjan (Block Development Officer)', dept: 'Panchayati Raj Department' }
    ];

    const sampleSubjects = [
      'Repair and widening of rural link road connecting panchayat to main highway',
      'Burnt electrical distribution transformer replacement in farmer tubewell area',
      'Drinking water pipeline leakage under Har Ghar Nal Ka Jal scheme',
      'Non-disbursement of senior citizen pension arrears after Aadhaar linkage',
      'Primary Health Centre doctor absence and medicine shortage in OPD',
      'Urgent land mutation and demarcation appeal pending statutory timeline',
      'PDS ration card renewal and biometric authentication verification issue',
      'Community culvert damage and drainage waterlogging during monsoon',
      'School building boundary wall repair and safe drinking water provision',
      'Canal irrigation branch repair for rabi crop pre-sowing requirements'
    ];

    const applicantFirstNames = [
      'Rajesh', 'Sita', 'Manoj', 'Sunita', 'Amit', 'Pooja', 'Dharmendra', 'Rameshwar',
      'Mohammad', 'Kavita', 'Sanjay', 'Geeta', 'Anil', 'Anita', 'Vinod', 'Meena',
      'Santosh', 'Rekha', 'Pankaj', 'Manju', 'Deepak', 'Suman', 'Arun', 'Savita',
      'Mukesh', 'Mamta', 'Ajay', 'Shobha', 'Vikas', 'Pramila', 'Rakesh', 'Sarita',
      'Birendra', 'Urmila', 'Narendra', 'Shakuntala', 'Ashok', 'Kaushalya', 'Subhash', 'Indu'
    ];

    const applicantLastNames = [
      'Kumar', 'Devi', 'Singh', 'Yadav', 'Prasad', 'Thakur', 'Alam', 'Mishra',
      'Sharma', 'Paswan', 'Rai', 'Manjhi', 'Chaudhary', 'Gupta', 'Verma', 'Khatoon'
    ];

    const currentYear = new Date().getFullYear();
    const now = Date.now();

    for (let i = 1; i <= 110; i++) {
      const appId = `BACMS-${currentYear}-${String(i).padStart(4, '0')}`;
      const fName = applicantFirstNames[(i - 1) % applicantFirstNames.length];
      const lName = applicantLastNames[(i - 1) % applicantLastNames.length];
      const fullName = `${fName} ${lName}`;
      const mobile = `98${String(10000000 + (i * 7393) % 89999999).slice(0, 8)}`;
      const priority = i <= 9 ? 'IMPORTANT' : 'NORMAL';

      let status = 'PENDING';
      let completedAt: Date | null = null;
      let completionNotes: string | null = null;

      if (i === 1) {
        status = 'COMPLETED';
        completedAt = new Date(now - 2 * 24 * 3600 * 1000);
        completionNotes = 'Concrete culvert repaired and load-tested by RWD Bettiah division with quality inspection sign-off.';
      } else if (i === 2) {
        status = 'AWAITING_INFO';
      } else if (i >= 61) {
        status = 'IN_PROGRESS';
      }

      const dist = districts[(i - 1) % districts.length];
      const acList = dist.constituencies;
      const ac = acList.length > 0 ? acList[(i - 1) % acList.length] : null;
      const cat = categories[(i - 1) % categories.length] || defaultCat;
      const officer = officers[(i - 1) % officers.length];
      const subject = sampleSubjects[(i - 1) % sampleSubjects.length];

      const daysAgo = (i % 25) + 1;
      const dateReceived = new Date(now - daysAgo * 24 * 3600 * 1000);
      const nextFollowUp = status !== 'COMPLETED' ? new Date(now + ((i % 7) + 1) * 24 * 3600 * 1000) : null;

      // Attach sample documents to the first 25 applications and every odd numbered one
      let docsJson: string | null = null;
      if (i <= 25 || i % 2 === 1) {
        const sampleDocs = [
          {
            originalName: `Citizen_Representation_${appId}.pdf`,
            filename: samplePdfName,
            size: 42150,
            mimetype: 'application/pdf',
            url: `/api/documents/${samplePdfName}`
          },
          {
            originalName: `Field_Inspection_Photo_${appId}.png`,
            filename: samplePngName,
            size: 108100,
            mimetype: 'image/png',
            url: `/api/documents/${samplePngName}`
          }
        ];
        docsJson = JSON.stringify(sampleDocs);
      }

      const created = await db.application.create({
        data: {
          applicationId: appId,
          applicantName: fullName,
          mobileNumber: mobile,
          address: `Ward No. ${(i % 18) + 1}, Panchayat Sector ${(i % 12) + 1}, ${dist.name}`,
          districtId: dist.id,
          constituencyId: ac ? ac.id : null,
          verifiedAcCode: ac ? ac.acCode : 'AC-001',
          isUnverifiedAc: false,
          categoryId: cat.id,
          categoryName: cat.name,
          subject: `${priority === 'IMPORTANT' ? '[High Priority] ' : ''}${subject} - Sector ${(i % 15) + 1}`,
          description: `Representation submitted regarding ${subject.toLowerCase()} in ${dist.name}. Official departmental intake and action timeline recorded.`,
          priority: priority,
          status: status,
          assignedEmployee: officer.name,
          internalRemarks: status === 'COMPLETED' ? completionNotes : `Assigned to ${officer.dept} for on-ground inspection.`,
          documents: docsJson,
          dateReceived: dateReceived,
          nextFollowUpDate: nextFollowUp,
          completedAt: completedAt,
          completionNotes: completionNotes,
          lastActionTaken: status === 'COMPLETED' ? 'Case resolved and disposed.' : `Referred to ${officer.name} for departmental follow-up.`
        }
      });

      // Add follow up
      await db.followUp.create({
        data: {
          applicationId: created.id,
          actionTaken: 'Application Intake & Departmental Routing',
          reminderNotes: `Application received and assigned to ${officer.name}. Supporting documents catalogued.`,
          previousStatus: 'NEW',
          newStatus: status,
          actionBy: officer.name,
          createdAt: dateReceived
        }
      });
    }

    await db.auditLog.create({
      data: {
        entityType: 'APPLICATION',
        action: 'RESTORE_REFERENCE',
        details: 'Restored 110 reference applications with supporting document attachments.',
        performedBy: req.user?.email || 'admin',
        ipAddress: req.ip
      }
    }).catch(() => {});

    res.json({
      success: true,
      count: 110,
      message: 'Successfully loaded 110 reference applications with supporting documents and active timelines.'
    });
  } catch (error: any) {
    console.error('Error restoring reference data:', error);
    res.status(500).json({ error: 'Failed to restore reference data: ' + error.message });
  }
});

export default router;
