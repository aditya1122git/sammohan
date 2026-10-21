import { Router, Request, Response } from 'express';
import { db } from '../database/mongo';
import { authenticateToken, AuthenticatedRequest, requireDataEntryOrAdmin, requireWrite } from '../middleware/auth';

const router = Router();

// GET /api/projects/stats - Real database aggregated statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalAnnouncements = await db.projectAnnouncement.count();
    
    const ongoingProjects = await db.projectAnnouncement.count({
      where: {
        currentStage: { in: ['PLANNING', 'TENDERING', 'UNDER_CONSTRUCTION'] }
      }
    });

    const completedProjects = await db.projectAnnouncement.count({
      where: {
        currentStage: { in: ['COMMISSIONED', 'OPERATIONAL'] }
      }
    });

    const delayedProjects = await db.projectAnnouncement.count({
      where: { isDelayed: true }
    });

    const aggregates = await db.projectAnnouncement.aggregate({
      _sum: {
        sanctionedAmountCr: true,
        utilizedAmountCr: true
      },
      _avg: {
        verifiedProgress: true
      }
    });

    // Breakdown by department
    const allProjects = await db.projectAnnouncement.findMany({
      select: {
        department: true,
        districtName: true,
        currentStage: true,
        isDelayed: true,
        sanctionedAmountCr: true,
        utilizedAmountCr: true,
        verifiedProgress: true,
        communicationStatus: true
      }
    });

    const deptMap: Record<string, { count: number; sanctionedCr: number; utilizedCr: number }> = {};
    const districtMap: Record<string, number> = {};
    const stageMap: Record<string, number> = {};
    const commMap: Record<string, number> = {};

    allProjects.forEach(p => {
      // Dept
      const dKey = p.department || 'Other';
      if (!deptMap[dKey]) deptMap[dKey] = { count: 0, sanctionedCr: 0, utilizedCr: 0 };
      deptMap[dKey].count += 1;
      deptMap[dKey].sanctionedCr += p.sanctionedAmountCr || 0;
      deptMap[dKey].utilizedCr += p.utilizedAmountCr || 0;

      // District
      const distKey = p.districtName || 'Statewide';
      districtMap[distKey] = (districtMap[distKey] || 0) + 1;

      // Stage
      stageMap[p.currentStage] = (stageMap[p.currentStage] || 0) + 1;

      // Comm
      if (p.communicationStatus) {
        commMap[p.communicationStatus] = (commMap[p.communicationStatus] || 0) + 1;
      }
    });

    const departmentBreakdown = Object.entries(deptMap).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => b.count - a.count);

    const districtBreakdown = Object.entries(districtMap).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      stats: {
        totalAnnouncements,
        ongoingProjects,
        completedProjects,
        delayedProjects,
        totalSanctionedCr: Math.round((aggregates._sum.sanctionedAmountCr || 0) * 100) / 100,
        totalUtilizedCr: Math.round((aggregates._sum.utilizedAmountCr || 0) * 100) / 100,
        avgProgress: Math.round(aggregates._avg.verifiedProgress || 0),
        departmentBreakdown,
        districtBreakdown,
        stageBreakdown: stageMap,
        communicationBreakdown: commMap
      }
    });
  } catch (error: any) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({ error: 'Failed to compute project statistics' });
  }
});

// GET /api/projects - Search & filter project records
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search,
      department,
      stage,
      status, // 'delayed' | 'ongoing' | 'completed' | 'all'
      district,
      source,
      communicationStatus,
      page = '1',
      limit = '50'
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { referenceId: { contains: q } },
        { commitment: { contains: q } },
        { department: { contains: q } },
        { location: { contains: q } },
        { nextMilestone: { contains: q } },
        { delayOrObstacle: { contains: q } },
        { source: { contains: q } }
      ];
    }

    if (department && typeof department === 'string' && department !== 'ALL') {
      where.department = { contains: department };
    }

    if (stage && typeof stage === 'string' && stage !== 'ALL') {
      where.currentStage = stage;
    }

    if (status === 'delayed') {
      where.isDelayed = true;
    } else if (status === 'ongoing') {
      where.currentStage = { in: ['PLANNING', 'TENDERING', 'UNDER_CONSTRUCTION'] };
    } else if (status === 'completed') {
      where.currentStage = { in: ['COMMISSIONED', 'OPERATIONAL'] };
    }

    if (district && typeof district === 'string' && district !== 'ALL') {
      where.OR = [
        ...(where.OR || []),
        { districtName: { contains: district } },
        { location: { contains: district } }
      ];
    }

    if (source && typeof source === 'string' && source !== 'ALL') {
      where.source = { contains: source };
    }

    if (communicationStatus && typeof communicationStatus === 'string' && communicationStatus !== 'ALL') {
      where.communicationStatus = { contains: communicationStatus };
    }

    const [total, projects] = await Promise.all([
      db.projectAnnouncement.count({ where }),
      db.projectAnnouncement.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { updatedAt: 'desc' },
        include: {
          district: true
        }
      })
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      projects
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to retrieve project records' });
  }
});

// GET /api/projects/:id - Get single project by ID or reference ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let project = null;

    if (!isNaN(parseInt(id, 10))) {
      project = await db.projectAnnouncement.findUnique({
        where: { id: parseInt(id, 10) },
        include: { district: true }
      });
    }

    if (!project) {
      project = await db.projectAnnouncement.findUnique({
        where: { referenceId: id },
        include: { district: true }
      });
    }

    if (!project) {
      return res.status(404).json({ error: 'Project record not found' });
    }

    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve project details' });
  }
});

// POST /api/projects - Create new Announcement / Project record
router.post('/', authenticateToken, requireDataEntryOrAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      referenceId,
      department,
      commitment,
      location,
      beneficiaries,
      districtId,
      districtName,
      financialStatus,
      sanctionedAmountCr,
      utilizedAmountCr,
      currentStage,
      verifiedProgress,
      nextMilestone,
      nextMilestoneDate,
      delayOrObstacle,
      isDelayed,
      source,
      communicationStatus,
      documents
    } = req.body;

    if (!department || !commitment || !location) {
      return res.status(400).json({ error: 'Department, commitment, and location are required.' });
    }

    // Auto generate reference ID if not provided
    const ref = referenceId || `BHR-ANNC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const project = await db.projectAnnouncement.create({
      data: {
        referenceId: ref,
        department,
        commitment,
        location,
        beneficiaries: beneficiaries || null,
        districtId: districtId ? parseInt(districtId, 10) : null,
        districtName: districtName || null,
        financialStatus: financialStatus || `Sanctioned: ₹${sanctionedAmountCr || 0} Cr | Utilized: ₹${utilizedAmountCr || 0} Cr`,
        sanctionedAmountCr: sanctionedAmountCr ? parseFloat(sanctionedAmountCr) : 0,
        utilizedAmountCr: utilizedAmountCr ? parseFloat(utilizedAmountCr) : 0,
        currentStage: currentStage || 'UNDER_CONSTRUCTION',
        verifiedProgress: verifiedProgress ? parseInt(verifiedProgress, 10) : 0,
        nextMilestone: nextMilestone || 'Under Initial Execution',
        nextMilestoneDate: nextMilestoneDate ? new Date(nextMilestoneDate) : null,
        delayOrObstacle: delayOrObstacle || null,
        isDelayed: Boolean(isDelayed),
        source: source || "Hon'ble CM Announcement",
        communicationStatus: communicationStatus || 'ACTION_INITIATED',
        documents: documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : null,
        createdById: req.user?.id
      }
    });

    res.status(201).json({ success: true, project });
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message || 'Failed to create project record' });
  }
});

// PUT /api/projects/:id - Update existing project
router.put('/:id', authenticateToken, requireDataEntryOrAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id, 10);

    const project = await db.projectAnnouncement.update({
      where: { id: projectId },
      data: {
        ...req.body,
        sanctionedAmountCr: req.body.sanctionedAmountCr !== undefined ? parseFloat(req.body.sanctionedAmountCr) : undefined,
        utilizedAmountCr: req.body.utilizedAmountCr !== undefined ? parseFloat(req.body.utilizedAmountCr) : undefined,
        verifiedProgress: req.body.verifiedProgress !== undefined ? parseInt(req.body.verifiedProgress, 10) : undefined,
        isDelayed: req.body.isDelayed !== undefined ? Boolean(req.body.isDelayed) : undefined,
        nextMilestoneDate: req.body.nextMilestoneDate ? new Date(req.body.nextMilestoneDate) : undefined,
        documents: typeof req.body.documents === 'object' ? JSON.stringify(req.body.documents) : req.body.documents
      }
    });

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message || 'Failed to update project record' });
  }
});

// POST /api/projects/clear-all - Delete all auto-generated / project records (Admin/DataEntry)
router.post('/clear-all', authenticateToken, requireDataEntryOrAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedCount = await db.projectAnnouncement.deleteMany({});
    console.log(`[PROJECTS] Purged all ${deletedCount.count} project records.`);
    
    res.json({
      success: true,
      count: deletedCount.count,
      message: `Successfully cleared ${deletedCount.count} project records. Clean manual database initialized.`
    });
  } catch (error: any) {
    console.error('Error in projects clear-all:', error);
    res.status(500).json({ error: 'Failed to clear project records' });
  }
});

// DELETE /api/projects/:id - Delete project (Staff / Write authorization)
router.delete('/:id', authenticateToken, requireWrite, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.projectAnnouncement.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ success: true, message: 'Project record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete project record' });
  }
});

export default router;
