import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config({ path: ".env" });
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS,
    },
}); 

export const resetPasswordEmail = async (email, otp) => {
    await smtpTransport.sendMail({
        from: "HOLOGRAM",
        to: email,
        subject: "Reset Password",
        text: `OTP is ${otp}`,
        html: `<h3> USE THIS OTP TO RESET YOUR PASSWORD <b>${otp}</b> </h3>`,
    });
};


export const verifyEmail = async (email, otp) => {
    await smtpTransport.sendMail({
        from: "HOLOGRAM",
        to: email,
        subject: "Verify Email",
        text: `OTP is ${otp}`,
        html: `<h3> USE THIS OTP TO Verify your Email <b>${otp}</b> </h3>`,
    });
};
