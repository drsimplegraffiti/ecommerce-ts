import express, { Express, NextFunction, Request, Response } from "express"; // this will enable autocompletion for express and types for req and res
import { PORT } from "./secrets";
import rootRouter from "./routes";

//initialize prisma client
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

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

//show connection status
prismaClient.$connect().then(() => {
  console.log("Database connected!");
});

// app.use(errorMiddleware);

//4o4
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

//error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong: " + err.message });
});


const port: number = Number(PORT) || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
