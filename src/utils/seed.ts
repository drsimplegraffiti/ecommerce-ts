import { prismaClient } from "..";
import bcrypt from "bcrypt";

//seed data
const seedData = async () => {
  await prismaClient.user.deleteMany({
    where: {
      role: "USER",
    },
  });

  for (let i = 0; i < 10; i++) {
    await prismaClient.user.create({
      data: {
        email: `user-${i + 10}-one@yopmail.com`,
        name: `user-${i + 10}-one`,
        password: await bcrypt.hash("password", 10),
      },
    });
  }
};

seedData()
  .then(() => {
    console.log("seeded data");
    process.exit(0); //exit the process after seeding data, 0 means success
  })
  .catch((error) => {
    console.log(error);
    process.exit(1); //exit the process after seeding data, 1 means failure
  });


  //use createMany to create multiple records at once
  const seedData2 = async () => {
    await prismaClient.user.deleteMany({
      where: {
        role: "USER",
      },
    });

    let users = [];

    for (let i = 0; i < 10; i++) {
      users.push({
        email: `user-${i + 30}-one@yopmail.com`,
        name: `user-${i + 40}-one`,
        password: await bcrypt.hash("password", 10),
      });
    }

    await prismaClient.user.createMany({
      data: users,
      skipDuplicates: true,
    });
  }
