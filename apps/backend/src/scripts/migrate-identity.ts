import mongoose from 'mongoose';
import crypto from 'crypto';
import { UserModel } from '../domains/identity/models/user.model';
import { ProfileModel } from '../domains/identity/models/profile.model';
import { PreferencesModel } from '../domains/identity/models/preferences.model';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const runMigration = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not found in env');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const users = await UserModel.find({});
    console.log(`Found ${users.length} users. Checking profiles and preferences...`);

    let profilesCreated = 0;
    let preferencesCreated = 0;

    for (const user of users) {
      const hasProfile = await ProfileModel.findOne({ userId: user._id });
      if (!hasProfile) {
        const baseUsername = `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`.replace(/[^a-z0-9]/g, '');
        let username = `${baseUsername}${crypto.randomBytes(2).toString('hex')}`;
        
        // Ensure uniqueness
        let existing = await ProfileModel.findOne({ username });
        while (existing) {
          username = `${baseUsername}${crypto.randomBytes(3).toString('hex')}`;
          existing = await ProfileModel.findOne({ username });
        }

        await ProfileModel.create({
          userId: user._id,
          username,
        });
        profilesCreated++;
      }

      const hasPreferences = await PreferencesModel.findOne({ userId: user._id });
      if (!hasPreferences) {
        await PreferencesModel.create({
          userId: user._id,
        });
        preferencesCreated++;
      }
    }

    console.log(`Migration complete. Created ${profilesCreated} profiles and ${preferencesCreated} preferences.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
