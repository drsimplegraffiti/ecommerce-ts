import { User } from "@prisma/client";
import express  from "express";

// declare global {
//     namespace Express {
//         interface Request {
//         user?: User;
//         }
//     }
//     }

declare global {
    namespace Express {
      interface Request {
        user?: any
      }
    }
  }

