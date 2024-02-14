import dotenv from 'dotenv';

dotenv.config({path:".env"});

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION!;
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME!;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_PORT = process.env.SMTP_PORT!;
export const SMTP_USER = process.env.SMTP_USER!;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD!;

export const USER_EMAIL = process.env.USER_EMAIL!;
export const USER_EMAIL_PASSWORD = process.env.USER_EMAIL_PASSWORD!;
export const FROM_NAME = process.env.FROM_NAME!;
