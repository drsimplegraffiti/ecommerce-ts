import express, { Express, NextFunction, Request, Response } from "express"; // this will enable autocompletion for express and types for req and res
import { PORT } from "./secrets";
import rootRouter from "./routes";
import morgan from "morgan";

//initialize prisma client
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api", rootRouter);

//initialize prisma client
export const prismaClient = new PrismaClient({
  log: ["query", "info", "warn"],
}).$extends({
  result:{
    address:{
      formattedAddress:{
        needs:{
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}, ${addr.pincode}`
        }
      }
    }
  }

});

prismaClient.$connect().then(() => {
  console.log("Database connected!");
});

app.use(errorMiddleware);

const port: number = Number(PORT) || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));



// with cluster

// import cluster from "cluster";
// import express, { Express, NextFunction, Request, Response } from "express";
// import { PORT } from "./secrets";
// import rootRouter from "./routes";
// import morgan from "morgan";
// import { PrismaClient } from "@prisma/client";
// import { errorMiddleware } from "./middlewares/errors";

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev")); // Logging after parsing request body

// app.use(express.static("public"));

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.use("/api", rootRouter);

// // Error handling middleware (before routes)
// app.use(errorMiddleware);

// // Prisma Client initialization (outside of request handling)
// const prismaClient = new PrismaClient({
//   log: ["query", "info", "warn"],
// }).$extends({
//   result: {
//     address: {
//       formattedAddress: {
//         needs: {
//           lineOne: true,
//           lineTwo: true,
//           city: true,
//           country: true,
//           pincode: true,
//         },
//         compute: (addr) => `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}, ${addr.pincode}`,
//       },
//     },
//   },
// });

// prismaClient.$connect()
//   .then(() => console.log("Database connected!"))
//   .catch((error) => console.error("Database connection error:", error));

// if (cluster.isPrimary) {
//   const numCPUs = require("os").cpus().length;
//   console.log(`Master cluster setting up ${numCPUs} workers...`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//     console.log(`Worker ${i} started`);
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
//     console.log("Starting a new worker...");
//     cluster.fork();
//   });
// } else {
//   app.listen(PORT, () => console.log(`Worker ${process.pid} started`));
// }

// export { prismaClient };
