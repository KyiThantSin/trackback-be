import "dotenv/config";
import nodemailer from "nodemailer";
import type { EmailTemplatePayLoad } from "@/types/email";
import emailTemplates from "@/utils/emailTemplates";

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (payload: EmailTemplatePayLoad) => {
  const from = payload.senderEmail || process.env.EMAIL_FROM;

  const template = payload.type === "FORGOT"
    ? emailTemplates.FORGOT(payload.url, payload.recipientName)
    : emailTemplates.RESET(payload.url, payload.recipientName);

  await transporter.sendMail({
    from,
    to: payload.receiverEmail,
    subject: template.subject,
    html: template.html,
  });
};

export default sendEmail;
