import type {EmailTemplate} from "@/types/email"

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

// factory pattern
const createPasswordEmailTemplate = (
  title: string,
  message: string,
  resetUrl?: string,
  recipientName = "Buddy",
): EmailTemplate => ({
  subject: title,
  html: `
    <div style="background:#f4f7fb;padding:32px;font-family:Arial,sans-serif;color:#172033">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:32px;border-radius:12px">
        <h1 style="margin:0 0 20px;font-size:24px">Trackback</h1>
        <p>Hi ${escapeHtml(recipientName)},</p>
        <p>${message}</p>
        ${resetUrl ? `<p style="margin:28px 0">
          <a href="${escapeHtml(resetUrl)}" style="background:#2563eb;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block">
            Continue
          </a>
        </p>` : ""}
        <p style="font-size:13px;color:#667085">${resetUrl ? "This password reset link expires in 15 minutes. If you did not request this email, you can ignore it. If you did not change your password, please contact support immediately." : ""}</p>
      </div>
    </div>
  `,
});

// strategy pattern
const emailTemplates = {
  FORGOT: (resetUrl: string, recipientName?: string) =>
    createPasswordEmailTemplate(
      "Reset your Trackback password",
      "We received a request to reset your Trackback password. Click the button below to choose a new password.",
      resetUrl,
      recipientName,
    ),
  RESET: (_resetUrl: string | undefined, recipientName?: string) =>
    createPasswordEmailTemplate(
      "Your Trackback password was reset successfully",
      "Your Trackback password has been reset successfully. You can now sign in with your new password.",
      undefined,
      recipientName,
    ),
};

export default emailTemplates;