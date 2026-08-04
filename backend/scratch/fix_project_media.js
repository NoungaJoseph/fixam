const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  try {
    const providerId = 'e8c9b658-f96f-4ec4-a66e-bc851bcad6b1'; // Nounga Joseph

    const fixedPortfolio = [
      {
        id: "proj_1785427025859_0_816",
        title: "Enako - Mobile Banking App Design",
        category: "Mobile App Development",
        description: "Every smart financial decision you make today shapes the future you'll live tomorrow. 🌱\n\nFinancial freedom isn't about earning more, it's about building better habits. Start saving with purpose, manage your money with confidence, and take control of your financial future.\n\nStart your financial journey with E-NAKO.\n\n📲 Download now\n🌐 www.enako.cm",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
        ],
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        videos: [
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        ],
        price: 25000,
        packages: {
          basic: {
            enabled: true,
            summary: "Basic UI layout design with 2 screens, assets, and source files.",
            price: 15000,
            deliveryDays: 2,
            revisions: 1,
            expressDeliveryEnabled: true,
            expressDeliveryDays: 1,
            expressDeliveryPrice: 5000,
            features: ["2 Screens UI Layout", "Design Assets Included", "Source Files (Figma)"]
          },
          standard: {
            enabled: true,
            summary: "Standard clickable interactive prototype with 5 screens.",
            price: 25000,
            deliveryDays: 4,
            revisions: 3,
            expressDeliveryEnabled: true,
            expressDeliveryDays: 2,
            expressDeliveryPrice: 7500,
            features: ["5 Screens UI Layout", "Interactive Prototyping", "Source Files (Figma)", "Developer Handoff Support"]
          },
          premium: {
            enabled: true,
            summary: "Full high-fidelity application UI design with up to 10 screens and custom illustrations.",
            price: 45000,
            deliveryDays: 7,
            revisions: 5,
            expressDeliveryEnabled: true,
            expressDeliveryDays: 3,
            expressDeliveryPrice: 12000,
            features: ["10 Screens UI Design", "Interactive Prototyping", "Source Files (Figma)", "Developer Handoff Support", "Custom Illustrations"]
          }
        }
      }
    ];

    const updated = await prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        portfolio: fixedPortfolio
      }
    });

    console.log('Successfully updated provider profile portfolio items to use real working URLs and tiers!');
    console.log(JSON.stringify(updated.portfolio, null, 2));

  } catch (err) {
    console.error('Error updating project media:', err);
  } finally {
    await prisma.$disconnect();
  }
}
fix();
