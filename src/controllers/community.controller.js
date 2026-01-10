// controllers/community.controller.js
const { sendCommunityMail } = require("../services/sendCommunityMail");
const dbService = require("../services/db.service");

exports.joinCommunity = async (req, res) => {
    try {
        const { name, email, interest, message } = req.body;

        // Save community request to database
        try {
            if (dbService && typeof dbService.createCommunityRequest === 'function') {
                await dbService.createCommunityRequest({ name, email, interest, message });
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue with sending email even if DB save fails
        }

        await sendCommunityMail({ name, email, interest, message });

        res.json({ message: "Community join request sent successfully" });
    } catch (error) {
        console.error("Community mail error:", error);
        res.status(500).json({ message: "Failed to send community request" });
    }
};
