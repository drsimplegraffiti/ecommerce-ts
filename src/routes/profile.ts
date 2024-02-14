import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import { uploadProfilePicture } from "../controllers/test";
import adminMiddleware from "../middlewares/admin";
import { Router } from "express";
import { upload } from "../utils/multer";

const profileRoutes: Router = Router();

profileRoutes.post(
  "/picture/:id",
  upload.single("image"),
  [authMiddleware, adminMiddleware],
  errorHandler(uploadProfilePicture)
);

export default profileRoutes;
