- npm init -y
- npm i typescript -D
- npx tsc --init

#### install the packages needed
- npm i express dotenv bcrypt jsonwebtoken prisma @prisma/client
- npm i @types/express @types/dotenv @types/bcrypt @types/jsonwebtoken ts-node -D
- npm i --save-dev @types/bcrypt
- npm i --save-dev @types/jsonwebtoken

#### setup nodemon
create a `nodemon.json` file
```json
{
    "watch": [
        "src"
    ],
    "ext": ".js,.ts",
    "exec": "npx ts-node ./src/index.ts"
}
```

in the `package.json` file, add the start script
```json
  "scripts": {
    "start": "npx nodemon"
  },
```

#### install prisma
- npm i @prisma/client prisma
- npx prisma init

By default you get a `schema.prisma` file and a `prisma` folder with postgresql as the default database.
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

```

And also a `.env` file with the database url
```env
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Install the prisma vscode extension for syntax highlighting and autocompletion.

#### db setup
Go to myswl and create an ecommerce database
```sql
CREATE DATABASE ecommerce;
```

Change the `DATABASE_URL` in the `.env` file to the new database url
```env
DATABASE_URL="mysql://root:Bassguitar1@localhost:3306/ecommerce?schema=public"
```


#### In the `schema.prisma` file, define the models
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  name     String?
  password String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users") // map to the users table in the database
}
```

#### Run the migration
- npx prisma migrate dev --name init
This will create a `migrations` folder with the migration file and also create the `users` table in the database.

#### go to prisma studio
- npx prisma studio


#### Seed the database with some data using the `seed.ts` file
```ts
import { prismaClient } from "..";


//seed data
const seedData = async () => {
    for (let i = 0; i < 10; i++) {
        
   await prismaClient.user.create({
        data: {
            email: `user-${i + 10}-one@yopmail.com`,
            name: `user-${i + 10}-one`,
            password: "password",
        },
    });
    }
}

seedData().then(() => {
    console.log("seeded data");
    process.exit(0); //exit the process after seeding data, 0 means success
}
).catch((error) => {
    console.log(error);
    process.exit(1); //exit the process after seeding data, 1 means failure
});

```

#### Run the seed file steps
Steps to run the seed file
 1. Run the build command to convert the typescript to javascript
 npm run build
 2. Run the seed command to seed the data
 node build/utils/seed.js

Or run npm run seed to run the seed command in the package.json file
```json
 {
     "scripts": {
         "seed": "ts-node --transpile-only ./src/utils/seed.ts"
     }

 }
```

remove all .js file usin bash command
- rm -rf src/**/*.js


