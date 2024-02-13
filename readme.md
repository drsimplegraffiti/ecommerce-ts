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