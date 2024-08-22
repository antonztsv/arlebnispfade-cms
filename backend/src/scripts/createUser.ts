import config from '@/config';
import { connectToDatabase } from '@/db/database';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';

async function createUser() {
  await connectToDatabase();

  const username = config.adminUsername;
  const password = config.adminPassword;
  const role = 'admin';

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('User already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    process.exit(0);
  }
}

createUser();
