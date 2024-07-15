import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const list = [
    { title: 'Create example apps', description: 'For Go/Ruby/Node', completed: false },
    { title: 'Switch to opentofu', description: 'Migrate from hashicorp terraform to opentofu', completed: false },
  ];

  const count = await prisma.todo.count();

  if (count !== 0) {
    return;
  }

  const promises = list.map((item) => {
    return prisma.todo.create({
      data: {
        title: item.title,
        description: item.description,
        is_completed: item.completed,
      },
    });
  });

  await Promise.all(promises);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
