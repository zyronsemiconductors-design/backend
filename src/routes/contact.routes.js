const router = require("express").Router();
const { contactController } = require("../controllers/contact.controller");
const { contactValidation, jobApplicationValidation, communityValidation, resourceValidation } = require("../middlewares/validate.middleware");
const { applyForJob } = require("../controllers/careers.controller");
const { joinCommunity } = require("../controllers/community.controller");
const {
    sendResourceEnquiry,
} = require("../controllers/resources.controller");

router.post("/resources/enquiry", resourceValidation, sendResourceEnquiry);
router.post("/apply", jobApplicationValidation, applyForJob);
router.post("/community", communityValidation, joinCommunity);
router.post("/", contactValidation, contactController);

module.exports = router;
