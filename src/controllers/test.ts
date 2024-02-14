import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { BadRequestsException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { cloudinary } from '../utils/cloudinary';

const prismaClient = new PrismaClient();

export const uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await prismaClient.user.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (!user) {
        throw new BadRequestsException("User not found", ErrorCode.USER_NOT_FOUND);
    }

    const file = req.file;
    const originalname = file!.originalname as string;
    const filename = file!.filename as string;
    const path = file!.path as string;
    const destination = file!.destination as string;
    const size = file!.size as number;
    const mimetype = file!.mimetype as string;
    console.log({ originalname, filename, path, destination, size, mimetype });

    const result = await cloudinary.uploader.upload(path, {
      folder: "profile",
      public_id: user.id.toString(),
      resource_type: "image",
    });

    const updatedUser = await prismaClient.user.update({
        where: {
            id: user.id,
        },
        data: {
            profilePicture: result.secure_url,
        },
    });

    res.json({ message: "Profile picture updated", data: updatedUser });

};