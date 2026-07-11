const mongoose = require('mongoose');
const Department = require('../models/Department');
const Resource = require('../models/Resource');
const User = require('../models/User');

const seedDB = async () => {
  try {
    const deptCount = await Department.countDocuments();
    if (deptCount > 0) {
      console.log('Database already has seeded data. Skipping seed step.');
      return;
    }

    console.log('Database is empty. Initiating seed process...');

    // 1. Seed Departments
    const csDept = await Department.create({
      name: 'Computer Science',
      code: 'CS',
      description: 'Department of Computer Science and Engineering',
      floors: 4,
      rooms: 20,
      labs: 8,
    });

    const itDept = await Department.create({
      name: 'Information Technology',
      code: 'IT',
      description: 'Department of Information Technology and Systems',
      floors: 3,
      rooms: 15,
      labs: 5,
    });

    const phyDept = await Department.create({
      name: 'Physics',
      code: 'PHY',
      description: 'Department of Physical Sciences and Quantum Research',
      floors: 2,
      rooms: 10,
      labs: 4,
    });

    const baDept = await Department.create({
      name: 'Business Administration',
      code: 'BA',
      description: 'Department of Management Studies and Ventures',
      floors: 3,
      rooms: 12,
      labs: 2,
    });

    console.log('Departments seeded successfully.');

    // 2. Seed Resources
    await Resource.create([
      {
        name: 'Main Campus Auditorium',
        type: 'auditorium',
        department: csDept._id,
        floor: 1,
        capacity: 400,
        facilities: ['Projector', 'Sound System', 'Stage Lighting', 'Microphones', 'AC'],
        status: 'available',
      },
      {
        name: 'Ada Lovelace Computing Center',
        type: 'laboratory',
        department: csDept._id,
        floor: 2,
        capacity: 80,
        facilities: ['NVIDIA RTX Workstations', 'Dual Monitors', 'AC', 'Whiteboard'],
        status: 'available',
      },
      {
        name: 'Einstein Quantum Physics Lab',
        type: 'laboratory',
        department: phyDept._id,
        floor: 3,
        capacity: 30,
        facilities: ['AC'],
        status: 'available',
      },
      {
        name: 'Seminar Room 102',
        type: 'seminar_hall',
        department: baDept._id,
        floor: 1,
        capacity: 50,
        facilities: ['Interactive Smartboard', 'AC'],
        status: 'available',
      },
    ]);

    console.log('Resources/Facilities seeded successfully.');

    // 3. Seed Default Administrator
    const existingAdmin = await User.findOne({ email: 'junaid.k0004@gmail.com' });
    if (!existingAdmin) {
      console.log('Seeding default administrator...');
      await User.create({
        name: 'CampusOS Administrator',
        email: 'junaid.k0004@gmail.com',
        password: 'qwerty123',
        role: 'admin',
      });
      console.log('Default administrator seeded successfully.');
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};

module.exports = seedDB;
