
import { Request, Response } from 'express';

export const successResponse = (res: Response, data: any, message: string) => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
    }