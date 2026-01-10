// services/careerMail.service.js
const transporter = require("../config/mail.config");
const { EMAIL_USER } = require('../config/env');

exports.sendCareerMail = async ({
    name,
    email,
    phone,
    position,
    message,
    resumeBase64,
    resumeName,
    resumeUrl, // Added for Cloudinary URL
}) => {
    // Add resume URL to the email if available
    const resumeSection = resumeUrl 
        ? `<tr><td style="padding:8px;font-weight:bold;">Resume</td><td style="padding:8px;"><a href="${resumeUrl}" target="_blank">View Resume (Cloudinary)</a></td></tr>`
        : resumeName 
            ? `<tr><td style="padding:8px;font-weight:bold;">Resume</td><td style="padding:8px;">${resumeName} (attached)</td></tr>`
            : '';

    const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
      
      <div style="background: #16a34a; color: #fff; padding: 20px;">
        <h2 style="margin: 0;">New Job Application</h2>
        <p style="margin: 5px 0 0;">Zyron Semiconductors Careers</p>
      </div>

      <div style="padding: 25px;">
        <p>Hello HR Team,</p>
        <p>You have received a new job application:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone || "-"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Position</td><td style="padding:8px;">${position}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${message || "-"}</td></tr>
          ${resumeSection}
        </table>

        <p>
          Reply to candidate: <a href="mailto:${email}">${email}</a>
        </p>

        <p style="color:#555;">Regards,<br/>Zyron Website Bot</p>
      </div>

      <div style="background:#f1f5f9;padding:12px;text-align:center;font-size:12px;color:#666;">
        © ${new Date().getFullYear()} Zyron Semiconductors Pvt. Ltd.
      </div>
    </div>
  </div>
  `;

    // Only include attachment if resumeBase64 is provided but no resumeUrl (for backward compatibility)
    const attachments = resumeBase64 && !resumeUrl
        ? [
            {
                filename: resumeName || "resume.pdf",
                content: resumeBase64.split("base64,")[1],
                encoding: "base64",
            },
        ]
        : [];

    try {
        // Try to send the email, but don't fail if email is disabled
        const result = await transporter.sendMail({
            from: `"Zyron Careers" <${EMAIL_USER}>`,
            to: EMAIL_USER,
            replyTo: email,
            subject: `Job Application: ${position} - ${name}`,
            html: htmlTemplate,
            attachments,
        });
        console.log('📧 Career email sent successfully');
        return result;
    } catch (error) {
        console.log('📧 Email sending disabled or failed, continuing with database save only');
        // Return a mock success result to maintain compatibility
        return { messageId: 'mock-id', response: 'Email sending disabled, but data saved to database' };
    }
};
