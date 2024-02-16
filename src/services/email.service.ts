import { sendEmail } from "../utils/emailsender";
import emitter from "../utils/event.listeners";

emitter.on("send-email", async (data: any) => {
  await sendEmail({
    email: data.email,
    subject: "Welcome to our app",
    message: `Welcome to our app, ${data.name}, we are glad to have you! You can now login to our app with your email and password. Your OTP is ${data.otp}`,
  });
});

emitter.on("send-otp", async (data: any) => {
  await sendEmail({
    email: data.email,
    subject: "OTP for password reset",
    message: `Your OTP for password reset is ${data.otp}`,
  });
});

export { emitter };
