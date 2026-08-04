const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
  try {
    const providerId = 'e8c9b658-f96f-4ec4-a66e-bc851bcad6b1';
    const profile = await prisma.providerProfile.findUnique({
      where: { id: providerId }
    });
    console.log('--- Provider Profile Portfolio ---');
    console.log(JSON.stringify(profile.portfolio, null, 2));
  } catch (err) {
    console.error('Error inspecting:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
inspect();
