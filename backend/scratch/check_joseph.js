const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserDetail() {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: 'noungajoseph58@gmail.com'
      },
      include: {
        providerProfile: true
      }
    });
    console.log('User ID:', user?.id);
    console.log('Provider Profile ID:', user?.providerProfile?.id);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
checkUserDetail();
