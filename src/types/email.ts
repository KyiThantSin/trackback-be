type EmailType = "FORGOT" | "RESET";

interface EmailTemplatePayLoad {
    senderEmail?: string;
    receiverEmail: string;
    type: EmailType;
    url?: string;
    recipientName?: string;
}

type EmailTemplate = {
  subject: string;
  html: string;
};


export type { EmailTemplatePayLoad, EmailType, EmailTemplate }