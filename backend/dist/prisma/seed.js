import { PrismaClient, Role } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin',
            password: adminPassword,
            role: Role.ADMIN,
            isEmailVerified: true
        }
    });
    console.log('✅ Created admin user:', admin.email);
    // Create regular user for testing
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Test User',
            password: userPassword,
            role: Role.USER,
            isEmailVerified: true
        }
    });
    console.log('✅ Created test user:', user.email);
    // Create sample reminders for the test user
    const reminder1 = await prisma.reminder.upsert({
        where: { id: 'cld123reminder1' },
        update: {},
        create: {
            id: 'cld123reminder1',
            text: 'Call doctor for appointment',
            dateTime: new Date('2025-11-01T14:00:00Z'),
            status: 'upcoming',
            userId: user.id
        }
    });
    const reminder2 = await prisma.reminder.upsert({
        where: { id: 'cld123reminder2' },
        update: {},
        create: {
            id: 'cld123reminder2',
            text: 'Buy groceries',
            dateTime: new Date('2025-10-31T18:00:00Z'),
            status: 'upcoming',
            userId: user.id
        }
    });
    const reminder3 = await prisma.reminder.upsert({
        where: { id: 'cld123reminder3' },
        update: {},
        create: {
            id: 'cld123reminder3',
            text: 'Complete project report',
            dateTime: new Date('2025-10-29T10:00:00Z'),
            status: 'completed',
            userId: user.id
        }
    });
    console.log('✅ Created sample reminders:', [reminder1.id, reminder2.id, reminder3.id]);
}
main()
    .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
