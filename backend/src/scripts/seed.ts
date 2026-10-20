import { connectDatabase, db, disconnectDatabase } from '../database/mongo';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';


async function main() {
  await connectDatabase();
  console.log('--- Starting Bihar Assembly CMS Database Seed ---');

  // 1. Seed Users
  const usersData = [
    {
      name: 'Dr. Anand Kumar (System Administrator)',
      email: 'admin@assembly.bihar.gov',
      password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin@Bihar2026', 10),
      role: 'ADMIN',
      department: 'Bihar Assembly IT & Oversight Cell',
      phone: '9835012345'
    },
    {
      name: 'Sunita Devi (Data Entry Operator)',
      email: 'dataentry@assembly.bihar.gov',
      password: await bcrypt.hash(process.env.SEED_DATA_ENTRY_PASSWORD || 'DataEntry@2026', 10),
      role: 'DATA_ENTRY',
      department: 'Central Grievance Reception Cell',
      phone: '9835023456'
    },
    {
      name: 'Rajesh Ranjan (Reviewing Officer)',
      email: 'reviewer@assembly.bihar.gov',
      password: await bcrypt.hash(process.env.SEED_REVIEWER_PASSWORD || 'Reviewer@2026', 10),
      role: 'REVIEWER',
      department: 'Assembly Grievance Scrutiny Board',
      phone: '9835034567'
    },
    {
      name: 'Pooja Verma (Read-Only Viewer)',
      email: 'readonly@assembly.bihar.gov',
      password: await bcrypt.hash(process.env.SEED_READONLY_PASSWORD || 'Auditor@2026', 10),
      role: 'READONLY',
      department: 'Public Affairs & Audit Desk',
      phone: '9835045678'
    }
  ];

  for (const u of usersData) {
    await db.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        department: u.department,
        phone: u.phone,
        password: u.password
      },
      create: u
    });
  }
  console.log('Seeded 4 multi-role users successfully.');

  // 2. Seed Complaint Categories
  const categories = [
    { name: 'Roads and infrastructure', code: 'CAT-ROADS', description: 'Road construction, repair, bridges, culverts, street drainage' },
    { name: 'Electricity', code: 'CAT-ELEC', description: 'Power outage, faulty transformers, metering issues, rural electrification' },
    { name: 'Drinking water', code: 'CAT-WATER', description: 'Har Ghar Nal Ka Jal, tube-wells, water contamination, pipeline leaks' },
    { name: 'Education', code: 'CAT-EDU', description: 'School infrastructure, teachers presence, mid-day meal, scholarships' },
    { name: 'Healthcare', code: 'CAT-HEALTH', description: 'PHC facilities, doctor availability, emergency medicines, ambulance service' },
    { name: 'Pension', code: 'CAT-PENSION', description: 'Old age pension, widow pension, disability pension delays' },
    { name: 'Ration', code: 'CAT-RATION', description: 'PDS ration distribution, ration card issuance/correction, dealer issues' },
    { name: 'Housing', code: 'CAT-HOUSE', description: 'PM Awas Yojana, rural housing subsidies, shelter assistance' },
    { name: 'Land and revenue', code: 'CAT-LAND', description: 'Land mutation (dakhil-kharij), demarcation, land disputes, encroachment' },
    { name: 'Agriculture', code: 'CAT-AGRI', description: 'Kisan Samman Nidhi, seeds, fertilizers, crop insurance, irrigation support' },
    { name: 'Employment', code: 'CAT-EMP', description: 'Skill development, employment exchange, self-employment schemes' },
    { name: 'Social welfare', code: 'CAT-SOC', description: 'Women empowerment schemes, SC/ST welfare, minority welfare programs' },
    { name: 'Local administration', code: 'CAT-ADMIN', description: 'Block/Panchayat office delays, certificates (caste, income, residence)' },
    { name: 'Other', code: 'CAT-OTHER', description: 'General public complaints and miscellaneous public representations' }
  ];

  for (const cat of categories) {
    await db.complaintCategory.upsert({
      where: { code: cat.code },
      update: { name: cat.name, description: cat.description },
      create: cat
    });
  }
  console.log(`Seeded ${categories.length} complaint categories successfully.`);

  // 3. Seed Bihar 38 Districts
  const districtsFilePath = path.resolve(__dirname, '../../../data/bihar_38_districts.json');
  const rawDistricts = JSON.parse(fs.readFileSync(districtsFilePath, 'utf-8'));

  for (const d of rawDistricts) {
    await db.district.upsert({
      where: { id: d.district_id },
      update: {
        code: d.district_code,
        name: d.district_name,
        assemblySeatsCount: d.assembly_seats_count,
        state: d.state,
        isActive: d.is_active
      },
      create: {
        id: d.district_id,
        code: d.district_code,
        name: d.district_name,
        assemblySeatsCount: d.assembly_seats_count,
        state: d.state,
        isActive: d.is_active
      }
    });
  }
  console.log(`Seeded ${rawDistricts.length} Bihar districts successfully.`);

  // Create district lookup map by name
  const districtMap = new Map<string, number>();
  const dbDistricts = await db.district.findMany();
  for (const d of dbDistricts) {
    districtMap.set(d.name.toLowerCase().trim(), d.id);
  }

  // 4. Seed Bihar 243 Assembly Constituencies
  const acFilePath = path.resolve(__dirname, '../../../data/bihar_243_constituencies.json');
  const rawAcs = JSON.parse(fs.readFileSync(acFilePath, 'utf-8'));

  for (const ac of rawAcs) {
    const distName = ac.district_name.toLowerCase().trim();
    const districtId = districtMap.get(distName);
    if (!districtId) {
      console.warn(`Warning: District not found for AC ${ac.ac_number} (${ac.constituency_name}): "${ac.district_name}"`);
      continue;
    }

    await db.assemblyConstituency.upsert({
      where: { acNumber: ac.ac_number },
      update: {
        acCode: ac.ac_code,
        name: ac.constituency_name,
        reservation: ac.reservation,
        districtId: districtId,
        lokSabhaConstituency: ac.lok_sabha_constituency,
        isActive: ac.is_active
      },
      create: {
        id: ac.ac_number,
        acNumber: ac.ac_number,
        acCode: ac.ac_code,
        name: ac.constituency_name,
        reservation: ac.reservation,
        districtId: districtId,
        lokSabhaConstituency: ac.lok_sabha_constituency,
        isActive: ac.is_active
      }
    });
  }
  // 5. Seed System Settings (200 MB upload limit)
  await db.systemSetting.upsert({
    where: { id: 1 },
    update: { maxUploadSizeMb: 200 },
    create: { id: 1, maxUploadSizeMb: 200 }
  });
  console.log('Configured SystemSetting maxUploadSizeMb = 200 MB.');

  // 6. Optional: Seed Sample Applications (Only if SEED_DEMO_DATA=true)
  if (process.env.SEED_DEMO_DATA === 'true') {
    const sampleApps = [
    {
      applicationId: 'BACMS-2026-0001',
      applicantName: 'Manoj Kumar Thakur',
      mobileNumber: '9431245678',
      alternateMobile: '9801234567',
      address: 'Village Harinagar, Post Ramnagar',
      districtName: 'West Champaran',
      acNumber: 2, // Ramnagar
      categoryCode: 'CAT-ROADS',
      subject: 'Dilapidated culvert over canal road causing severe accident risk',
      description: 'The concrete culvert connecting Ward 4 to Main Ramnagar Road has collapsed on the left side during recent rains. Daily school buses and emergency vehicles are stranded. Immediate repair and barricading needed.',
      priority: 'IMPORTANT',
      status: 'IN_PROGRESS',
      assignedEmployee: 'Er. Ramesh Pandey (AE - RWD)',
      internalRemarks: 'Site inspection completed on 08-Oct. Estimate submitted to Executive Engineer.',
      nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
      lastActionTaken: 'Technical sanction requested from Superintending Engineer.',
      dateReceived: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      applicationId: 'BACMS-2026-0002',
      applicantName: 'Shanti Devi',
      mobileNumber: '9122345678',
      address: 'Mohalla Kadamkuan, Lane 3, Patna',
      districtName: 'Patna',
      acNumber: 182, // Bankipur
      categoryCode: 'CAT-PENSION',
      subject: 'Non-disbursement of Indira Gandhi National Old Age Pension since 6 months',
      description: 'Pension stopped after Aadhaar bank seeding update. Bank confirms account is active but portal indicates transaction reversal. Senior citizen has no other source of income.',
      priority: 'IMPORTANT',
      status: 'PENDING',
      assignedEmployee: 'Vikramaditya Singh (SDO Social Welfare)',
      internalRemarks: 'Bank linkage document received. Verification pending with BDO office.',
      nextFollowUpDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue!
      lastActionTaken: 'Forwarded to District Social Security Cell for PFMS re-trigger.',
      dateReceived: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      applicationId: 'BACMS-2026-0003',
      applicantName: 'Mohammad Tariq Alam',
      mobileNumber: '9934123890',
      address: 'Panchayat Bahraicha, Bahadurpur',
      districtName: 'Darbhanga',
      acNumber: 85, // Bahadurpur
      categoryCode: 'CAT-WATER',
      subject: 'Contaminated tap water and pipeline leakage in Ward No. 7',
      description: 'Under Har Ghar Nal Ka Jal scheme, the distribution pipe has burst near the open drain resulting in dirty water entering household taps. Several cases of gastrointestinal illness reported.',
      priority: 'IMPORTANT',
      status: 'PENDING',
      assignedEmployee: 'Shyam Kishor (PHED Sub-Divisional Officer)',
      internalRemarks: 'Sample collection requested. Water tanker dispatched as interim relief.',
      nextFollowUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      lastActionTaken: 'PHED junior engineer instructed to isolate and repair damaged joint.',
      dateReceived: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      applicationId: 'BACMS-2026-0004',
      applicantName: 'Dharmendra Yadav',
      mobileNumber: '9708912345',
      address: 'Village Mahnar, Block Bidupur',
      districtName: 'Vaishali',
      acNumber: 129, // Mahnar
      categoryCode: 'CAT-ELEC',
      subject: 'Burnt 63 KVA transformer not replaced for over 12 days',
      description: 'The agricultural and domestic supply transformer burnt out on 28th September. 140 farming families are unable to operate tubewells for rabi pre-sowing irrigation.',
      priority: 'NORMAL',
      status: 'IN_PROGRESS',
      assignedEmployee: 'Amitabh Sen (Assistant Electrical Engineer - NBPDCL)',
      internalRemarks: 'Replacement requisition placed with central transformer store Hajipur.',
      nextFollowUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      lastActionTaken: 'Store clearance issued. Delivery scheduled for tomorrow.',
      dateReceived: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      applicationId: 'BACMS-2026-0005',
      applicantName: 'Rameshwar Prasad Singh',
      mobileNumber: '9470123987',
      address: 'Gram Tarapur, PS Asarganj',
      districtName: 'Munger',
      acNumber: 164, // Tarapur
      categoryCode: 'CAT-LAND',
      subject: 'Delay in land mutation case pending beyond 90 days statutory limit',
      description: 'Mutation Case No. 452/2026 registered online with clear registered sale deed. Revenue Karamchari report submitted but CO office has not scheduled final order.',
      priority: 'NORMAL',
      status: 'AWAITING_INFO',
      assignedEmployee: 'Praveen Kumar (Circle Officer - Asarganj)',
      internalRemarks: 'Notice issued to applicant to provide genealogy affidavit.',
      nextFollowUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      lastActionTaken: 'Applicant contacted via SMS to submit certified genealogy document.',
      dateReceived: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    },
    {
      applicationId: 'BACMS-2026-0006',
      applicantName: 'Priya Ranjan',
      mobileNumber: '9835789012',
      address: 'Mohalla Mirjanhat, Bhagalpur',
      districtName: 'Bhagalpur',
      acNumber: 157, // Bhagalpur
      categoryCode: 'CAT-HEALTH',
      subject: 'Lack of anti-rabies vaccine and basic emergency medicines at Urban PHC',
      description: 'Patients visiting Mirjanhat PHC for dog bites are forced to purchase anti-rabies injections from private chemists at high costs. Immediate supply required.',
      priority: 'IMPORTANT',
      status: 'COMPLETED',
      assignedEmployee: 'Dr. Sudhir Sah (Civil Surgeon Bhagalpur)',
      internalRemarks: 'Emergency procurement done. 200 vials supplied to the facility on 05-Oct.',
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completionNotes: 'Civil Surgeon office replenished vaccine stock and verified cold chain maintenance. Complainant confirmed resolution.',
      lastActionTaken: 'Medicine consignment delivered and physically verified by Medical Officer In-Charge.',
      dateReceived: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      applicationId: 'BACMS-2026-0007',
      applicantName: 'Kameshwar Paswan',
      mobileNumber: '9546123456',
      address: 'Village Belaganj, Gaya',
      districtName: 'Gaya',
      acNumber: 232, // Belaganj
      categoryCode: 'CAT-RATION',
      subject: 'PDS Dealer underweighing foodgrains and demanding unauthorized charges',
      description: 'Dealer License No. 12/2018 in Belaganj Ward 2 distributes 4 kg instead of entitlement 5 kg per unit and demands Rs. 20 extra per cardholder.',
      priority: 'IMPORTANT',
      status: 'IN_PROGRESS',
      assignedEmployee: 'Neeraj Kumar (Block Supply Officer Belaganj)',
      internalRemarks: 'Show cause notice issued to the PDS dealer. Electronic weighing scale inspection ordered.',
      nextFollowUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      lastActionTaken: 'Inspected dealer stock and recorded statements of 12 cardholders.',
      dateReceived: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      applicationId: 'BACMS-2026-0008',
      applicantName: 'Archana Kumari',
      mobileNumber: '9631456789',
      address: 'Panchayat Pipra, Supaul',
      districtName: 'Supaul',
      acNumber: 42, // Pipra
      categoryCode: 'CAT-EDU',
      subject: 'Absence of clean drinking water and toilet facilities for girls in Upgraded Middle School',
      description: 'Over 280 girls enrolled in Utkramit Madhya Vidyalaya Pipra have no functional sanitation facility or potable water source, causing high absenteeism.',
      priority: 'NORMAL',
      status: 'PENDING',
      assignedEmployee: 'Sanjeev Jha (District Programme Officer - Samagra Shiksha)',
      internalRemarks: 'Sanction letter issued under composite school grant. Construction starting next week.',
      nextFollowUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      lastActionTaken: 'Fund allocation of Rs. 1.25 Lakh approved from DPO office.',
      dateReceived: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const app of sampleApps) {
    const distId = districtMap.get(app.districtName.toLowerCase().trim());
    if (!distId) continue;

    const cat = await db.complaintCategory.findUnique({ where: { code: app.categoryCode } });
    if (!cat) continue;

    const ac = await db.assemblyConstituency.findUnique({ where: { acNumber: app.acNumber } });
    if (!ac) continue;

    const created = await db.application.upsert({
      where: { applicationId: app.applicationId },
      update: {
        applicantName: app.applicantName,
        mobileNumber: app.mobileNumber,
        alternateMobile: app.alternateMobile,
        address: app.address,
        districtId: distId,
        constituencyId: ac.id,
        verifiedAcCode: ac.acCode,
        categoryId: cat.id,
        subject: app.subject,
        description: app.description,
        priority: app.priority,
        status: app.status,
        assignedEmployee: app.assignedEmployee,
        internalRemarks: app.internalRemarks,
        nextFollowUpDate: app.nextFollowUpDate,
        lastActionTaken: app.lastActionTaken,
        completedAt: app.completedAt,
        completionNotes: app.completionNotes,
        dateReceived: app.dateReceived
      },
      create: {
        applicationId: app.applicationId,
        applicantName: app.applicantName,
        mobileNumber: app.mobileNumber,
        alternateMobile: app.alternateMobile,
        address: app.address,
        districtId: distId,
        constituencyId: ac.id,
        verifiedAcCode: ac.acCode,
        categoryId: cat.id,
        subject: app.subject,
        description: app.description,
        priority: app.priority,
        status: app.status,
        assignedEmployee: app.assignedEmployee,
        internalRemarks: app.internalRemarks,
        nextFollowUpDate: app.nextFollowUpDate,
        lastActionTaken: app.lastActionTaken,
        completedAt: app.completedAt,
        completionNotes: app.completionNotes,
        dateReceived: app.dateReceived
      }
    });

    // Add initial follow-up record
    await db.followUp.create({
      data: {
        applicationId: created.id,
        actionTaken: app.lastActionTaken || 'Application registered in Bihar Assembly CMS portal',
        reminderNotes: 'Initial scrutiny completed and assigned to respective division.',
        previousStatus: 'PENDING',
        newStatus: app.status,
        assignedTo: app.assignedEmployee,
        nextFollowUpDate: app.nextFollowUpDate,
        actionBy: 'System Administrator'
      }
    });

    // Add audit log
    await db.auditLog.create({
      data: {
        applicationId: created.id,
        entityType: 'APPLICATION',
        action: 'CREATE',
        details: `Application ${app.applicationId} registered for ${app.applicantName} (${ac.acCode} - ${ac.name}, ${app.districtName})`,
        performedBy: 'admin@assembly.bihar.gov',
        ipAddress: '127.0.0.1'
      }
    });
    console.log(`Seeded ${sampleApps.length} sample applications with follow-ups and audit logs.`);
  }
  } else {
    console.log('Skipping sample demo applications (Master data initialized cleanly).');
  }

  console.log('--- Bihar Assembly CMS Database Seed Finished Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectDatabase();
  });
