// controllers/resources.controller.js
const { sendResourceMail } = require("../services/sendResourceMail");
const dbService = require("../services/db.service");

exports.sendResourceEnquiry = async (req, res) => {
    try {
        const { name, email, topic, message } = req.body;

        // Save resource enquiry to database
        try {
            if (dbService && typeof dbService.createResourceEnquiry === 'function') {
                await dbService.createResourceEnquiry({ name, email, topic, message });
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue with sending email even if DB save fails
        }

        await sendResourceMail({ name, email, topic, message });

        res.json({ message: "Resources enquiry sent successfully" });
    } catch (error) {
        console.error("Resources mail error:", error);
        res.status(500).json({ message: "Failed to send resources enquiry" });
    }
};
