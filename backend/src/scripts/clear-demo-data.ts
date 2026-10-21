import { connectDatabase, db, disconnectDatabase } from '../database/mongo';
import fs from 'fs';
import path from 'path';


async function clearDemoData() {
  await connectDatabase();
  console.log('=== CLEARING SAMMOHAN DEMO & SAMPLE DATA ===');

  try {
    // 1. Delete all FollowUp records
    const followUpsDeleted = await db.followUp.deleteMany({});
    console.log(`✓ Deleted ${followUpsDeleted.count} demo/test follow-up actions.`);

    // 2. Delete all Application records
    const appsDeleted = await db.application.deleteMany({});
    console.log(`✓ Deleted ${appsDeleted.count} demo/test application records.`);

    // 3. Delete all ProjectAnnouncement records (clearing auto-detected projects)
    const projectsDeleted = await db.projectAnnouncement.deleteMany({});
    console.log(`✓ Deleted ${projectsDeleted.count} auto-generated/detected project announcements.`);

    // 4. Delete any pending PasswordResetTokens
    const tokensDeleted = await db.passwordResetToken.deleteMany({});
    console.log(`✓ Deleted ${tokensDeleted.count} temporary password reset tokens.`);

    // 5. Clean up uploaded documents directory
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let removedCount = 0;
      for (const file of files) {
        if (file !== '.gitkeep') {
          const filePath = path.join(uploadsDir, file);
          try {
            if (fs.statSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
              removedCount++;
            }
          } catch (e) {
            console.warn(`Could not remove ${file}:`, e);
          }
        }
      }
      console.log(`✓ Removed ${removedCount} test/demo uploaded files from ${uploadsDir}.`);
    }

    // 6. Verify preserved master data
    const userCount = await db.user.count();
    const districtCount = await db.district.count();
    const acCount = await db.assemblyConstituency.count();
    const categoryCount = await db.complaintCategory.count();
    const appCount = await db.application.count();

    const projectCount = await db.projectAnnouncement.count();

    console.log('\n--- VERIFICATION STATUS ---');
    console.log(`- Official Users Preserved: ${userCount}`);
    console.log(`- Official Bihar Districts Preserved: ${districtCount} / 38`);
    console.log(`- Official Assembly Constituencies Preserved: ${acCount} / 243`);
    console.log(`- Complaint Categories Preserved: ${categoryCount}`);
    console.log(`- Current Applications Count: ${appCount} (Zero demo data remaining)`);
    console.log(`- Current Projects Count: ${projectCount} (Zero auto-detected data remaining - Clean Manual Database)`);
    console.log('\n✓ ALL DEMO DATA SUCCESSFULLY CLEARED!');
  } catch (error) {
    console.error('Error clearing demo data:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

clearDemoData();
