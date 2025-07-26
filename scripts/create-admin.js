const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@broker.com' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@broker.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@broker.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 