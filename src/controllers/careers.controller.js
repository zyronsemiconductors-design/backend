// controllers/careers.controller.js
const { sendCareerMail } = require("../services/sendCareerMail");
const dbService = require("../services/db.service");
const fileService = require("../services/file.service");

exports.applyForJob = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            position,
            message,
            resumeBase64,
            resumeName,
        } = req.body;

        // Upload resume to Cloudinary if provided
        let resumeUrl = null;
        if (resumeBase64 && resumeName) {
            try {
                const resumeUpload = await fileService.uploadBase64(resumeBase64, 'zyron-resumes', resumeName);
                resumeUrl = resumeUpload.url;
            } catch (uploadError) {
                console.error("Resume upload error:", uploadError);
                return res.status(500).json({ message: "Failed to upload resume" });
            }
        }

        // Save application to database
        try {
            if (dbService && typeof dbService.createJobApplication === 'function') {
                await dbService.createJobApplication({
                    name,
                    email,
                    phone,
                    position,
                    message,
                    resume_url: resumeUrl,
                    resume_name: resumeName,
                });
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue with sending email even if DB save fails
        }

        await sendCareerMail({
            name,
            email,
            phone,
            position,
            message,
            resumeBase64,
            resumeName,
        });

        res.json({ message: "Job application sent successfully" });
    } catch (error) {
        console.error("Career mail error:", error);
        res.status(500).json({ message: "Failed to send job application" });
    }
};
