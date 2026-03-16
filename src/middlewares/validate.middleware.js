const { body, validationResult } = require("express-validator");

// Validation for contact form
exports.contactValidation = [
    // Name validation: required, string, 2-100 characters, no special characters except spaces and hyphens
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s\-\'\.]+$/)
        .withMessage("Name can only contain letters, spaces, hyphens, apostrophes, and periods")
        .notEmpty()
        .withMessage("Name is required"),

    // Email validation: required, valid email format
    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email required")
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage("Email is too long"),

    // Message validation: required, 10-2000 characters
    body("message")
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Message must be between 10 and 2000 characters")
        .notEmpty()
        .withMessage("Message is required"),

    // Phone validation: optional
    body("phone")
        .optional()
        .trim()
        .isMobilePhone("any")
        .withMessage("Valid phone number required"),

    // Reject any unexpected fields
    (req, res, next) => {
        const allowedFields = ['name', 'email', 'message', 'phone'];
        const receivedFields = Object.keys(req.body);
        const unexpectedFields = receivedFields.filter(field => !allowedFields.includes(field));

        if (unexpectedFields.length > 0) {
            return res.status(400).json({
                errors: [{ msg: `Unexpected fields: ${unexpectedFields.join(', ')}` }]
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Validation for job applications
exports.jobApplicationValidation = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s\-\'\.]+$/)
        .withMessage("Name can only contain letters, spaces, hyphens, apostrophes, and periods")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email required")
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage("Email is too long"),

    body("phone")
        .optional()
        .trim()
        .isMobilePhone("any")
        .withMessage("Valid phone number required"),

    body("position")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Position must be between 2 and 100 characters")
        .notEmpty()
        .withMessage("Position is required"),

    body("message")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Message must be less than 2000 characters"),

    body("resumeName")
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage("Resume name is too long"),

    (req, res, next) => {
        const allowedFields = ['name', 'email', 'phone', 'position', 'message', 'resumeBase64', 'resumeName'];
        const receivedFields = Object.keys(req.body);
        const unexpectedFields = receivedFields.filter(field => !allowedFields.includes(field));

        if (unexpectedFields.length > 0) {
            return res.status(400).json({
                errors: [{ msg: `Unexpected fields: ${unexpectedFields.join(', ')}` }]
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Validation for community join requests
exports.communityValidation = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s\-\'\.]+$/)
        .withMessage("Name can only contain letters, spaces, hyphens, apostrophes, and periods")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email required")
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage("Email is too long"),

    body("interest")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Interest field is too long"),

    body("message")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Message must be less than 2000 characters"),

    (req, res, next) => {
        const allowedFields = ['name', 'email', 'interest', 'message'];
        const receivedFields = Object.keys(req.body);
        const unexpectedFields = receivedFields.filter(field => !allowedFields.includes(field));

        if (unexpectedFields.length > 0) {
            return res.status(400).json({
                errors: [{ msg: `Unexpected fields: ${unexpectedFields.join(', ')}` }]
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Validation for resource enquiries
exports.resourceValidation = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s\-\'\.]+$/)
        .withMessage("Name can only contain letters, spaces, hyphens, apostrophes, and periods")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email required")
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage("Email is too long"),

    body("topic")
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Topic must be between 2 and 200 characters")
        .notEmpty()
        .withMessage("Topic is required"),

    body("message")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Message must be less than 2000 characters"),

    (req, res, next) => {
        const allowedFields = ['name', 'email', 'topic', 'message'];
        const receivedFields = Object.keys(req.body);
        const unexpectedFields = receivedFields.filter(field => !allowedFields.includes(field));

        if (unexpectedFields.length > 0) {
            return res.status(400).json({
                errors: [{ msg: `Unexpected fields: ${unexpectedFields.join(', ')}` }]
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
