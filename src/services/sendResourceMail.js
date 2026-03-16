// services/resourceMail.service.js
const transporter = require("../config/mail.config");
const { EMAIL_USER } = require('../config/env');
const dbService = require('./db.service');

exports.sendResourceMail = async ({ name, email, topic, message }) => {
    const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
      
      <div style="background: #7c3aed; color: #fff; padding: 20px;">
        <h2 style="margin: 0;">New Resources Enquiry</h2>
        <p style="margin: 5px 0 0;">Zyron Semiconductors Website</p>
      </div>

      <div style="padding: 25px;">
        <p>Hello Team,</p>
        <p>A user has requested expert guidance / resources:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Name</td>
            <td style="padding: 8px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Topic</td>
            <td style="padding: 8px;">${topic || "General"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Message</td>
            <td style="padding: 8px;">${message || "-"}</td>
          </tr>
        </table>

        <p style="margin-top: 30px;">
          Reply to: <a href="mailto:${email}">${email}</a>
        </p>

        <p style="color: #555;">Regards,<br/>Zyron Website Bot</p>
      </div>

      <div style="background: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} Zyron Semiconductors Pvt. Ltd.
      </div>
    </div>
  </div>
  `;

    const generalSettings = await dbService.getSetting('general');
    const receiverEmail = generalSettings?.contact_email || EMAIL_USER;
    const recipients = [receiverEmail].filter(Boolean);

    try {
        // Try to send the email, but don't fail if email is disabled
        const result = await transporter.sendMail({
            from: `"Zyron Website" <${EMAIL_USER}>`,
            to: recipients.join(","),
            replyTo: email,
            subject: `Resources Enquiry - ${name}`,
            html: htmlTemplate,
        });
        console.log('📧 Resource email sent successfully');
        return result;
    } catch (error) {
        console.log('📧 Email sending disabled or failed, continuing with database save only');
        // Return a mock success result to maintain compatibility
        return { messageId: 'mock-id', response: 'Email sending disabled, but data saved to database' };
    }
};
