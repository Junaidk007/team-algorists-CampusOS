require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Resource = require('../models/Resource');

const seedSCA = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing from environment.');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // 1. Create or Find Department
    let scaDept = await Department.findOne({ name: 'School of Computer Applications' });
    if (!scaDept) {
      scaDept = await Department.create({
        name: 'School of Computer Applications',
        code: 'SCA',
        description: 'School of Computer Applications and Technology',
        floors: 5,
        rooms: 90,
        labs: 20
      });
      console.log('Created Department: School of Computer Applications');
    } else {
      console.log('Department "School of Computer Applications" already exists.');
    }

    const resourcesToInsert = [];

    // - 10 rooms of capacity 200 with Projector, Whiteboard
    for (let i = 1; i <= 10; i++) {
      resourcesToInsert.push({
        name: `SCA Classroom ${100 + i}`,
        type: 'classroom',
        department: scaDept._id,
        floor: 1,
        capacity: 200,
        facilities: ['Projector', 'Whiteboard'],
        status: 'available',
      });
    }

    // - 40 rooms of capacity 80 with Whiteboard
    for (let i = 1; i <= 40; i++) {
      resourcesToInsert.push({
        name: `SCA Classroom ${200 + i}`,
        type: 'classroom',
        department: scaDept._id,
        floor: 2,
        capacity: 80,
        facilities: ['Whiteboard'],
        status: 'available',
      });
    }

    // - 10 rooms of capacity 100 with Projector, Whiteboard
    for (let i = 1; i <= 10; i++) {
      resourcesToInsert.push({
        name: `SCA Classroom ${300 + i}`,
        type: 'classroom',
        department: scaDept._id,
        floor: 3,
        capacity: 100,
        facilities: ['Projector', 'Whiteboard'],
        status: 'available',
      });
    }

    // - 10 labs fully facilitated
    for (let i = 1; i <= 10; i++) {
      resourcesToInsert.push({
        name: `SCA Computing Lab ${100 + i}`,
        type: 'laboratory',
        department: scaDept._id,
        floor: 4,
        capacity: 60,
        facilities: ['Computers', 'AC', 'Projector', 'Whiteboard', 'LAN'],
        status: 'available',
      });
    }

    // - 10 labs fully facilitated (2nd batch)
    for (let i = 1; i <= 10; i++) {
      resourcesToInsert.push({
        name: `SCA Computing Lab ${200 + i}`,
        type: 'laboratory',
        department: scaDept._id,
        floor: 4,
        capacity: 60,
        facilities: ['Computers', 'AC', 'Projector', 'Whiteboard', 'LAN'],
        status: 'available',
      });
    }

    // - 30 rooms more (classrooms, capacity 60 with Whiteboard)
    for (let i = 1; i <= 30; i++) {
      resourcesToInsert.push({
        name: `SCA Classroom ${400 + i}`,
        type: 'classroom',
        department: scaDept._id,
        floor: 3,
        capacity: 60,
        facilities: ['Whiteboard'],
        status: 'available',
      });
    }

    console.log(`Inserting ${resourcesToInsert.length} resources into database...`);
    await Resource.insertMany(resourcesToInsert);
    console.log('Seeding finished successfully.');

    await mongoose.disconnect();
    console.log('Database disconnected.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedSCA();
