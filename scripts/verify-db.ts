import 'dotenv/config';
import prisma from '../lib/prisma';

async function main() {
    try {
        console.log('Connecting to database...');
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! Found ${userCount} users.`);

        // Also try to find a user to ensure reading works
        const testUser = await prisma.user.findFirst();
        if (testUser) {
            console.log('Successfully read a user record.');
        } else {
            console.log('No users found, but connection was successful.');
        }

    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
