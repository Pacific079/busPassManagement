require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Route = require('../models/Route.model');

const connectDB = require('../config/db');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Route.deleteMany({});

  console.log('🗑️  Cleared existing data');

  // Seed Admin
  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@safarpass.com',
    password: 'Admin@123',
    phone: '9999999999',
    role: 'admin',
  });
  console.log('👤 Admin created:', admin.email);

  // Seed User
  const user = await User.create({
    name: 'John Doe',
    email: 'user@safarpass.com',
    password: 'User@123',
    phone: '8888888888',
    role: 'user',
  });
  console.log('👤 Test user created:', user.email);

  // Seed Categories
  const categories = await Category.insertMany([
    {
      name: 'General',
      description: 'Standard monthly bus pass for general commuters',
      price: 500,
      duration: 30,
      requiredDocuments: ['idProof', 'addressProof'],
      discount: 0,
    },
    {
      name: 'Student',
      description: 'Discounted pass for school and college students',
      price: 200,
      duration: 30,
      requiredDocuments: ['idProof', 'studentId', 'addressProof'],
      discount: 60,
    },
    {
      name: 'Senior Citizen',
      description: 'Subsidized pass for citizens above 60 years',
      price: 100,
      duration: 30,
      requiredDocuments: ['idProof', 'ageProof', 'addressProof'],
      discount: 80,
    },
    {
      name: 'Differently Abled',
      description: 'Specially discounted pass for persons with disabilities',
      price: 50,
      duration: 30,
      requiredDocuments: ['idProof', 'disabilityProof', 'addressProof'],
      discount: 90,
    },
    {
      name: 'Monthly Premium',
      description: 'Premium pass with priority boarding and all routes',
      price: 800,
      duration: 30,
      requiredDocuments: ['idProof', 'addressProof'],
      discount: 0,
    },
  ]);
  console.log(`🏷️  ${categories.length} categories created`);

  // Seed Routes
  const routes = await Route.insertMany([
    {
      routeNumber: 'R001',
      routeName: 'City Center - Airport',
      startPoint: 'City Center Bus Stand',
      endPoint: 'International Airport',
      stops: [
        { name: 'City Center Bus Stand', order: 1 },
        { name: 'Railway Station', order: 2 },
        { name: 'East Gate', order: 3 },
        { name: 'Tech Park', order: 4 },
        { name: 'International Airport', order: 5 },
      ],
      distance: 35,
      fare: 60,
    },
    {
      routeNumber: 'R002',
      routeName: 'North - South Corridor',
      startPoint: 'North Terminal',
      endPoint: 'South Bus Depot',
      stops: [
        { name: 'North Terminal', order: 1 },
        { name: 'Market Square', order: 2 },
        { name: 'Central Park', order: 3 },
        { name: 'Hospital Junction', order: 4 },
        { name: 'South Bus Depot', order: 5 },
      ],
      distance: 22,
      fare: 40,
    },
    {
      routeNumber: 'R003',
      routeName: 'University Express',
      startPoint: 'Main Bus Stand',
      endPoint: 'University Campus',
      stops: [
        { name: 'Main Bus Stand', order: 1 },
        { name: 'Residential Colony', order: 2 },
        { name: 'Shopping Mall', order: 3 },
        { name: 'University Gate', order: 4 },
        { name: 'University Campus', order: 5 },
      ],
      distance: 18,
      fare: 35,
    },
    {
      routeNumber: 'R004',
      routeName: 'Industrial Area Loop',
      startPoint: 'Central Station',
      endPoint: 'Industrial Zone',
      stops: [
        { name: 'Central Station', order: 1 },
        { name: 'Sector 5', order: 2 },
        { name: 'Sector 12', order: 3 },
        { name: 'Factory Gate', order: 4 },
        { name: 'Industrial Zone', order: 5 },
      ],
      distance: 28,
      fare: 50,
    },
    {
      routeNumber: 'R005',
      routeName: 'Suburb Connector',
      startPoint: 'Downtown',
      endPoint: 'East Suburb',
      stops: [
        { name: 'Downtown', order: 1 },
        { name: 'Old Town', order: 2 },
        { name: 'New Colony', order: 3 },
        { name: 'East Suburb', order: 4 },
      ],
      distance: 15,
      fare: 30,
    },
  ]);
  console.log(` ${routes.length} routes created`);

  console.log('\n✅ Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin  → admin@safarpass.com  / Admin@123');
  console.log('User   → user@safarpass.com   / User@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
