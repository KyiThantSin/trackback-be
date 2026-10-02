import "dotenv/config";
import { Resend } from "resend";
import type { EmailTemplatePayLoad } from "@/types/email";
import emailTemplates from "@/utils/emailTemplates";

const sendEmail = async (payload: EmailTemplatePayLoad) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = payload.senderEmail || process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM must be configured");
  }

  const resend = new Resend(apiKey);
  const resetUrl = payload.url;
  
  if (payload.type === "FORGOT" && !resetUrl) {
    throw new Error("A reset URL is required for forgot-password emails");
  }

  const template = payload.type === "FORGOT"
    ? emailTemplates.FORGOT(resetUrl as string, payload.recipientName)
    : emailTemplates.RESET(undefined, payload.recipientName);

  const { error } = await resend.emails.send({
    from,
    to: payload.receiverEmail,
    subject: template.subject,
    html: template.html,
  });

  if (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

export default sendEmail;
