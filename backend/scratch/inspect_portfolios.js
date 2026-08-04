const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPortfolios() {
  try {
    const providers = await prisma.providerProfile.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            role: true
          }
        }
      }
    });

    console.log(`Found ${providers.length} provider profiles.`);
    providers.forEach(p => {
      console.log(`Provider ID: ${p.id}`);
      console.log(`User: ${p.user?.fullName} (${p.user?.email})`);
      console.log(`Portfolio:`, JSON.stringify(p.portfolio, null, 2));
      console.log('------------------------');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPortfolios();
