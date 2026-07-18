import mongoose from 'mongoose';
import { env } from '../core/config/env';
import { logger } from '../core/logging/logger';
import { fakerEN_IN as faker } from '@faker-js/faker'; // Use Indian locale for names, addresses
import * as argon2 from 'argon2';

// Models
import { UserModel } from '../domains/identity/models/user.model';
import { ProfileModel } from '../domains/identity/models/profile.model';
import { CommunityModel } from '../domains/communities/models/community.model';
import { EventModel } from '../domains/events/models/event.model';
import { IssueModel } from '../domains/civic/models/issue.model';
import { AccountStatus, Role } from '@civichub/shared';

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const cities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
];

async function seed() {
  await connectDB();
  logger.info('Clearing existing data...');
  
  await UserModel.deleteMany({});
  await ProfileModel.deleteMany({});
  await CommunityModel.deleteMany({});
  await EventModel.deleteMany({});
  // Try clearing issues if model exists
  if (IssueModel) {
    await IssueModel.deleteMany({});
  }

  logger.info('Seeding Admin User...');
  
  const hashedPassword = await argon2.hash('password123');

  // Create admin user
  const adminUser = await UserModel.create({
    email: 'admin@civichub.in',
    password: hashedPassword,
    firstName: 'Arjun',
    lastName: 'Sharma',
    role: Role.ADMIN,
    status: AccountStatus.ACTIVE,
  });

  const adminProfile = await ProfileModel.create({
    userId: adminUser._id,
    username: 'arjun_sharma',
    bio: 'Community organizer and CivicHub admin. Passionate about urban development in India.',
    avatarUrl: 'https://picsum.photos/seed/admin/200/200', // Realistic portrait
    location: 'Delhi, India',
    privacy: { profileVisibility: 'PUBLIC', showActivity: true, showCommunities: true },
  });

  logger.info('Seeding Random Users...');
  
  const createdUsers = [];
  
  for (let i = 0; i < 10; i++) {
    const user = await UserModel.create({
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: Role.USER,
      status: AccountStatus.ACTIVE,
    });
    
    await ProfileModel.create({
      userId: user._id,
      username: faker.internet.username({ firstName: user.firstName, lastName: user.lastName }).toLowerCase(),
      bio: faker.person.bio(),
      avatarUrl: `https://i.pravatar.cc/150?u=${user._id}`, // Fallback for reliable portraits
      location: `${faker.location.city()}, India`,
      privacy: { profileVisibility: 'PUBLIC', showActivity: true, showCommunities: true },
    });
    createdUsers.push(user);
  }

  logger.info('Seeding Communities...');
  
  const communityData = [
    { name: 'Mumbai Green Initiative', slug: 'mumbai-green', desc: 'Working towards a greener, cleaner Mumbai.', tags: ['environment', 'mumbai'], avatarUrl: 'https://picsum.photos/seed/mumbai/400/400' },
    { name: 'Bangalore Tech for Good', slug: 'blr-tech-good', desc: 'Using technology to solve civic issues in Namma Bengaluru.', tags: ['technology', 'bangalore'], avatarUrl: 'https://picsum.photos/seed/bangalore/400/400' },
    { name: 'Delhi Air Quality Watch', slug: 'delhi-aqi', desc: 'Monitoring and taking action on Delhi air pollution.', tags: ['pollution', 'delhi'], avatarUrl: 'https://picsum.photos/seed/delhi/400/400' },
  ];

  const createdCommunities = [];

  for (const c of communityData) {
    const creator = adminUser;
    const comm = await CommunityModel.create({
      ...c,
      description: c.desc,
      creatorId: creator._id.toString(),
      coverUrl: c.avatarUrl, // Reusing avatar as cover for simplicity
      visibility: 'PUBLIC',
      memberCount: faker.number.int({ min: 10, max: 500 }),
    });
    createdCommunities.push(comm);
  }

  logger.info('Seeding Events...');
  
  const eventTypes = ['MEETING', 'CLEANUP', 'PROTEST', 'WORKSHOP'];
  
  for (let i = 0; i < 15; i++) {
    const city = faker.helpers.arrayElement(cities);
    const comm = faker.helpers.arrayElement(createdCommunities);
    
    // Jitter coordinates slightly around the city center
    const lat = city.lat + (Math.random() - 0.5) * 0.1;
    const lng = city.lng + (Math.random() - 0.5) * 0.1;

    await EventModel.create({
      title: `${faker.company.catchPhrase()} in ${city.name}`,
      description: faker.lorem.paragraphs(2),
      eventType: faker.helpers.arrayElement(eventTypes),
      space: { type: 'community', id: comm._id.toString() },
      organizerId: adminUser._id.toString(),
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      address: faker.location.streetAddress(),
      capacity: faker.number.int({ min: 20, max: 200 }),
      visibility: 'PUBLIC',
      startTime: faker.date.soon({ days: 10 }),
      endTime: faker.date.soon({ days: 11 }),
      status: 'PUBLISHED',
      media: {
        bannerId: `https://picsum.photos/seed/event_${i}/800/400`,
        attachmentIds: []
      }
    });
  }

  logger.info('Seeding Issues...');
  
  const issueTitles = ['Pothole on main road', 'Broken Streetlight', 'Water logging', 'Garbage dumping'];
  
  for (let i = 0; i < 20; i++) {
    const city = faker.helpers.arrayElement(cities);
    const lat = city.lat + (Math.random() - 0.5) * 0.1;
    const lng = city.lng + (Math.random() - 0.5) * 0.1;
    const reporter = faker.helpers.arrayElement(createdUsers);

    if (IssueModel) {
      await IssueModel.create({
        title: `${faker.helpers.arrayElement(issueTitles)} near ${faker.location.street()}`,
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
        priority: faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH']),
        reporterId: reporter._id.toString(),
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        address: faker.location.streetAddress(),
        categoryId: new mongoose.Types.ObjectId().toString(),
        supportCount: faker.number.int({ min: 0, max: 100 }),
        images: [`https://picsum.photos/seed/issue_${i}/400/300`], // Example issue photo
      });
    }
  }

  logger.info('Database seeding completed successfully!');
  process.exit(0);
}

seed().catch((error) => {
  logger.error('Error seeding database:', error);
  process.exit(1);
});
