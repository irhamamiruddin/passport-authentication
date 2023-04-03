import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import verificationCode from "./verification";

dotenv.config();

// create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: 587,
    secure: false, //false for other ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// send mail with defined transport object
const sendMail = async (to: any, subject: string, html: string, text?: string) => {
    const info = await transporter.sendMail({
        from: process.env.MAIL_USERNAME as string, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
    console.log("Message sent: %s", info.messageId);
}

// send mail with defined transport object
const sendMailWithAttachment = async (to: any, subject: string, html: string, attachments: any, text?: string) => {
    const info = await transporter.sendMail({
        from: process.env.MAIL_USERNAME as string, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
        attachments: attachments
    });
    console.log("Message sent: %s", info.messageId);
}

const sendVerificationCode = async (to: any) => {
    // use verification code function to generate a random verification code
    const code = await verificationCode();

    // create a html body for the email with random verification code
    const html = `
        <h3>Verify your email</h3>
        <p>Enter the following code to verify your email.</p>
        <div style="text-align:center">
            <p><b style="font-size:20pt;letter-spacing:3px">${code}</b></p>
        </div>
        <p>Thank you!</p>
        <p>Regards,</p>
        <p>ARR News Support</p>
        <br>
        <i>This is an automatically generated email. Please do not reply to this email.</i>
    `;
    sendMail(to, "Verify your email", html);
    return code;
}

const sendApprovalNotice = async (to: any, user: any) => {
    // use verification code function to generate a random verification code
    const code = await verificationCode();

    // create a html body for the email with random verification code
    const html = `
        <h3>New User Registered. Waiting for Approval</h3>
        <p>The following user is waiting for approval.</p>
        <p>Username: ${user.username}</p>
        <p>Email: ${user.email}</p>
        <p>Thank you!</p>
        <p>Regards,</p>
        <p>ARR News Support</p>
        <br>
        <i>This is an automatically generated email. Please do not reply to this email.</i>
    `;
    sendMail(to, "New User Waiting For Approval", html);
    return code;
}

export { sendMail, sendMailWithAttachment, sendVerificationCode, sendApprovalNotice };