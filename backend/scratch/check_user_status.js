const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'noungajoseph58@gmail.com' },
      include: { providerProfile: true }
    });
    console.log('--- User Status ---');
    console.log('ID:', user?.id);
    console.log('Full Name:', user?.fullName);
    console.log('Avatar URL in DB:', user?.avatar);
    console.log('Provider Profile Mode:', user?.providerProfile?.profileMode);
  } catch (err) {
    console.error('Error querying database:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
