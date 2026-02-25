import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const email = process.argv[2] || process.env.PROMOTE_ADMIN_EMAIL;
if (!email) {
  console.error('Usage: node scripts/promoteAdmin.js <email>');
  console.error('   or set PROMOTE_ADMIN_EMAIL in .env');
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furnistor');
  const user = await User.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { role: 'admin' },
    { new: true }
  );
  if (!user) {
    console.error('User not found with email:', email);
    process.exit(1);
  }
  console.log('Promoted to admin:', user.email);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
