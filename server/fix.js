const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  await prisma.product.updateMany({
    where: { name: 'Silk Scarf' },
    data: { image: 'https://images.unsplash.com/photo-1623832101940-647285e32a58?q=80&w=880&auto=format&fit=crop' }
  });
  console.log('Updated Silk Scarf image');
}
run().finally(() => prisma.$disconnect());
