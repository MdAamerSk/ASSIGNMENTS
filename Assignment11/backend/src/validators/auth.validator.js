import { body, validationResult } from "express-validator";

export const registerValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a valid string")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
        .escape(),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Enter a valid email")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a valid string").bail()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[@$!%*?&#]/).withMessage("Password must contain at least one special character"),
    body("confirmPassword")
        .notEmpty().withMessage("Please confirm your password").bail()
        .isString().withMessage("Confirm password must be a valid string")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            });
        }
        next();
    }
];
