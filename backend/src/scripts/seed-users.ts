import bcrypt from 'bcryptjs';
import { connectDatabase, db, disconnectDatabase } from '../database/mongo';

const users = [
  {
    name: 'Dr. Anand Kumar',
    email: 'admin@assembly.bihar.gov',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@Bihar2026',
    role: 'ADMIN',
    department: 'Bihar Assembly IT & Oversight Cell',
    phone: '9835012345'
  },
  {
    name: 'Sunita Devi',
    email: 'dataentry@assembly.bihar.gov',
    password: process.env.SEED_DATA_ENTRY_PASSWORD || 'DataEntry@2026',
    role: 'DATA_ENTRY',
    department: 'Central Grievance Reception Cell',
    phone: '9835023456'
  },
  {
    name: 'Rajesh Ranjan',
    email: 'reviewer@assembly.bihar.gov',
    password: process.env.SEED_REVIEWER_PASSWORD || 'Reviewer@2026',
    role: 'REVIEWER',
    department: 'Assembly Grievance Scrutiny Board',
    phone: '9835034567'
  },
  {
    name: 'Pooja Verma',
    email: 'readonly@assembly.bihar.gov',
    password: process.env.SEED_READONLY_PASSWORD || 'Auditor@2026',
    role: 'READONLY',
    department: 'Public Affairs & Audit Desk',
    phone: '9835045678'
  }
];

async function seedUsers(): Promise<void> {
  await connectDatabase();

  for (const user of users) {
    const password = await bcrypt.hash(user.password, 10);
    await db.user.upsert({
      where: { email: user.email },
      update: { ...user, password },
      create: { ...user, password }
    });
  }

  console.log(`Seeded ${users.length} users with bcrypt password hashes.`);
}

seedUsers()
  .catch((error) => {
    console.error('User seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
