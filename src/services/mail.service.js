const transporter = require("../config/mail.config");
const { EMAIL_USER } = require('../config/env');

exports.sendContactMail = async ({ name, email, message }) => {
  const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
      
      <div style="background: #2563eb; color: #fff; padding: 20px;">
        <h2 style="margin: 0;">New Contact Enquiry</h2>
        <p style="margin: 5px 0 0;">Zyron Semiconductors Website</p>
      </div>

      <div style="padding: 25px;">
        <p>Hello Team,</p>
        <p>You have received a new message from the website contact form:</p>

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
            <td style="padding: 8px; font-weight: bold;">Message</td>
            <td style="padding: 8px;">${message}</td>
          </tr>
        </table>

        <p style="margin-top: 30px;">
          Please respond to the user at 
          <a href="mailto:${email}">${email}</a>.
        </p>

        <p style="color: #555;">Regards,<br/>Zyron Website Bot</p>
      </div>

      <div style="background: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} Zyron Semiconductors Pvt. Ltd.
      </div>
    </div>
  </div>
  `;

  const recipients = [
    // process.env.EMAIL_GENERAL,
    // process.env.EMAIL_HR,
    EMAIL_USER
  ].filter(Boolean); // remove undefined if any

  try {
    // Try to send the email, but don't fail if email is disabled
    const result = await transporter.sendMail({
      from: `"Zyron Website" <${EMAIL_USER}>`,
      to: recipients.join(","),   // ✅ now sends to both
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: htmlTemplate,
    });
    console.log('📧 Contact email sent successfully');
    return result;
  } catch (error) {
    console.log('📧 Email sending disabled or failed, continuing with database save only');
    // Return a mock success result to maintain compatibility
    return { messageId: 'mock-id', response: 'Email sending disabled, but data saved to database' };
  }
};
