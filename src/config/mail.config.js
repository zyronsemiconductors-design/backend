// Nodemailer disabled
// const nodemailer = require("nodemailer");
// const { EMAIL_USER, EMAIL_PASS } = require('../config/env');

// const transporter = nodemailer.createTransporter({
//     service: "gmail",
//     auth: {
//         user: EMAIL_USER,
//         pass: EMAIL_PASS,
//     },
// });

// Export a mock transporter that doesn't send emails
const mockTransporter = {
    sendMail: async (options) => {
        console.log('📧 Email sending disabled. Would have sent:', options.subject);
        // Simulate successful send
        return Promise.resolve({ messageId: 'mock-id', response: 'Mock response' });
    },
    verify: async () => {
        // Always nominal for mock
        return true;
    }
};

module.exports = mockTransporter;
