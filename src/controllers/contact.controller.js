const { sendContactMail } = require("../services/mail.service");
const dbService = require("../services/db.service");

exports.contactController = async (req, res) => {
    try {
        const { name, email, message, phone } = req.body;
        
        // Save contact to database
        try {
            if (dbService && typeof dbService.createContact === 'function') {
                await dbService.createContact({ name, email, message, phone });
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue with sending email even if DB save fails
        }

        await sendContactMail({ name, email, message, phone });

        return res.status(200).json({
            message: "Message sent successfully",
        });
    } catch (error) {
        console.error("Contact mail error:", error);
        return res.status(500).json({
            message: "Failed to send message",
        });
    }
};
