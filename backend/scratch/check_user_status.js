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
    console.log('User fullName:', user?.fullName);
    console.log('User isOnline:', user?.isOnline);
    console.log('Provider Profile profileMode:', user?.providerProfile?.profileMode);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
checkUserDetail();
