import { connectDatabase, db, disconnectDatabase } from '../database/mongo';


async function seed110Applications() {
  await connectDatabase();
  console.log('=== SEEDING JANSETU BIHAR 110 REFERENCE APPLICATIONS ===');

  try {
    // Check if already seeded or force reset
    const force = process.env.FORCE_RESET === '1' || process.argv.includes('--force');
    if (force) {
      console.log('Force reset requested. Clearing existing applications and follow-ups...');
      await db.followUp.deleteMany();
      await db.auditLog.deleteMany({ where: { entityType: 'APPLICATION' } });
      await db.application.deleteMany();
    } else {
      const count = await db.application.count();
      if (count >= 110) {
        console.log(`Database already has ${count} applications. Skipping seed.`);
        return;
      }
    }

    // Get districts & constituencies
    const districts = await db.district.findMany({ include: { constituencies: true } });
    if (districts.length === 0) {
      throw new Error('Districts not found. Run db:seed first.');
    }

    const categories = await db.complaintCategory.findMany();
    const defaultCat = categories[0] || { id: 1, name: 'Roads and infrastructure' };

    // Officers and Departments
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

    // Target breakdown:
    // Exactly 9 IMPORTANT Priority
    // Exactly 101 NORMAL Priority
    // Total = 110
    // Exactly 108 Active Follow-Ups (58 PENDING, 50 IN_PROGRESS)
    // Exactly 1 COMPLETED (Disposed)
    // Exactly 1 AWAITING_INFO
    // Total = 110

    const currentYear = new Date().getFullYear();
    const batchData: any[] = [];
    const followUpsData: any[] = [];
    const auditLogsData: any[] = [];

    const now = Date.now();

    for (let i = 1; i <= 110; i++) {
      const appId = `BACMS-${currentYear}-${String(i).padStart(4, '0')}`;
      const fName = applicantFirstNames[(i - 1) % applicantFirstNames.length];
      const lName = applicantLastNames[(i - 1) % applicantLastNames.length];
      const fullName = `${fName} ${lName}`;
      const mobile = `98${String(10000000 + (i * 7393) % 89999999).slice(0, 8)}`;

      // Priority: First 9 are IMPORTANT, remaining 101 are NORMAL
      const priority = i <= 9 ? 'IMPORTANT' : 'NORMAL';

      // Status breakdown:
      // i = 1: COMPLETED (Disposed case)
      // i = 2: AWAITING_INFO
      // i = 3 to 60 (58 apps): PENDING
      // i = 61 to 110 (50 apps): IN_PROGRESS
      // Active Follow-Ups = 58 PENDING + 50 IN_PROGRESS = 108!
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

      // Pick district and constituency
      const dist = districts[(i - 1) % districts.length];
      const acList = dist.constituencies;
      const ac = acList.length > 0 ? acList[(i - 1) % acList.length] : null;

      const cat = categories.length > 0 ? categories[(i - 1) % categories.length] : defaultCat;
      const officer = officers[(i - 1) % officers.length];
      const subject = sampleSubjects[(i - 1) % sampleSubjects.length];
      const daysAgo = (i % 30) + 1;
      const dateReceived = new Date(now - daysAgo * 24 * 3600 * 1000);
      const nextFollowUp = status !== 'COMPLETED' ? new Date(now + ((i % 7) + 1) * 24 * 3600 * 1000) : null;

      const appRecord = {
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
        description: `Representation submitted regarding ${subject.toLowerCase()} in ${dist.name}. Urgent official verification and execution required.`,
        priority: priority,
        status: status,
        assignedEmployee: officer.name,
        internalRemarks: status === 'COMPLETED' ? completionNotes : `Assigned to ${officer.dept} for on-ground inspection.`,
        dateReceived: dateReceived,
        nextFollowUpDate: nextFollowUp,
        completedAt: completedAt,
        completionNotes: completionNotes,
        lastActionTaken: status === 'COMPLETED' ? 'Case resolved and disposed.' : `Referred to ${officer.name} for departmental follow-up.`
      };

      batchData.push(appRecord);
    }

    console.log(`Inserting ${batchData.length} records into Application table...`);

    for (const record of batchData) {
      const created = await db.application.create({
        data: record
      });

      // Add initial follow-up
      await db.followUp.create({
        data: {
          applicationId: created.id,
          actionTaken: 'Application Intake & Departmental Routing',
          reminderNotes: `Application received and assigned to ${record.assignedEmployee}.`,
          previousStatus: 'NEW',
          newStatus: record.status,
          assignedTo: record.assignedEmployee,
          nextFollowUpDate: record.nextFollowUpDate,
          actionBy: 'Assembly Public Cell Officer'
        }
      });

      // Add audit log
      await db.auditLog.create({
        data: {
          applicationId: created.id,
          entityType: 'APPLICATION',
          action: 'CREATE',
          details: `Application ${record.applicationId} registered for ${record.applicantName} (${record.verifiedAcCode}). Priority: ${record.priority}, Status: ${record.status}.`,
          performedBy: 'admin@assembly.bihar.gov',
          ipAddress: '127.0.0.1'
        }
      });
    }

    // Verify final counts
    const totalApps = await db.application.count();
    const impCount = await db.application.count({ where: { priority: 'IMPORTANT' } });
    const normCount = await db.application.count({ where: { priority: 'NORMAL' } });
    const pendCount = await db.application.count({ where: { status: 'PENDING' } });
    const inProgCount = await db.application.count({ where: { status: 'IN_PROGRESS' } });
    const compCount = await db.application.count({ where: { status: { in: ['COMPLETED', 'DISPOSED'] } } });

    console.log('\n=== SEED VERIFICATION ===');
    console.log(`Total Applications: ${totalApps} (Expected 110)`);
    console.log(`Important Priority: ${impCount} (Expected 9)`);
    console.log(`Normal Priority: ${normCount} (Expected 101)`);
    console.log(`Active Follow-Ups: ${pendCount + inProgCount} (Expected 108: ${pendCount} Pending + ${inProgCount} In Progress)`);
    console.log(`Disposed Cases: ${compCount} (Expected 1)`);
    console.log('✓ EXACT 110 REFERENCE APPLICATIONS DATASET SEEDED SUCCESSFULLY!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

seed110Applications();
