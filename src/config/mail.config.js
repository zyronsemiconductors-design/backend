const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASS } = require('../config/env');

const createMockTransporter = () => ({
    sendMail: async (options) => {
        console.log('📧 Email sending disabled. Would have sent:', options.subject);
        return Promise.resolve({ messageId: 'mock-id', response: 'Mock response' });
    },
    verify: async () => true
});

if (!EMAIL_USER || !EMAIL_PASS) {
    module.exports = createMockTransporter();
} else {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    module.exports = transporter;
}
