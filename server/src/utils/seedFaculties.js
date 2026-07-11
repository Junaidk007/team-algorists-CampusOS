require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Department = require('../models/Department');
const User = require('../models/User');

const seedFaculties = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing from environment.');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // Find Department
    const scaDept = await Department.findOne({ name: 'School of Computer Applications' });
    if (!scaDept) {
      console.error('Department "School of Computer Applications" not found. Please seed the department first.');
      process.exit(1);
    }
    console.log('Found Department ID:', scaDept._id);

    const facultiesToInsert = [];
    for (let i = 1; i <= 60; i++) {
      facultiesToInsert.push({
        name: `Prof. Faculty Member ${i}`,
        email: `faculty${i}@sca.campusos.dev`,
        password: 'password123', // will be hashed by pre-save hook
        role: 'faculty',
        department: scaDept._id
      });
    }

    console.log(`Creating ${facultiesToInsert.length} faculty users...`);
    // User.create handles arrays and executes hooks for each document
    await User.create(facultiesToInsert);
    console.log('Faculties seeded successfully.');

    await mongoose.disconnect();
    console.log('Database disconnected.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedFaculties();
