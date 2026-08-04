const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function activate() {
  try {
    const updated = await prisma.providerProfile.update({
      where: {
        id: 'e8c9b658-f96f-4ec4-a66e-bc851bcad6b1'
      },
      data: {
        profileMode: 'WORK'
      }
    });
    console.log('Provider profile updated successfully to:', updated.profileMode);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
activate();
