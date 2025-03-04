import nodemailer from 'nodemailer'
import { User } from './models/User';

const transporter = nodemailer.createTransport({
  host: "mail.netlylogistics.com",
  port: 465, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail=async (user:User)=>{
    try {
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Verify Your Email",
          html: `<p>Verification Code is ${user.verificationCode}</p>`,
        });
    }catch(e){
        console.error(e)
        throw new Error("Failed to send verification email")
    }

}

export const sendCustom = async (email: string,data:{
    subject: string,
    message: string
}) =>{
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: data.subject,
            html: data.message,
        });

    }catch(e){
        console.error(e)
        throw new Error("Failed to custom send email")
        }
    

}