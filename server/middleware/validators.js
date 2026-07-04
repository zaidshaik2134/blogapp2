import { body, param } from 'express-validator';

const mongoId = (field = 'id') => [
  param(field).isMongoId().withMessage(`Invalid ${field}`),
];

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const blogIdRules = mongoId('id');

export const blogRules = [
  body('title').trim().isLength({ min: 3, max: 160 }).withMessage('Title must be 3 to 160 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Description must be 10 to 10000 characters'),
  body('mediaType')
    .optional()
    .isIn(['none', 'image', 'gif', 'video', 'external'])
    .withMessage('Invalid media type'),
  body('mediaUrl')
    .if(body('mediaType').isIn(['gif', 'video', 'external']))
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('A valid media URL with protocol is required'),
];

export const likeRules = [
  ...mongoId('id'),
  body('liked').optional().isBoolean().withMessage('liked must be a boolean'),
];

export const commentRules = [
  ...mongoId('id'),
  body('username')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Username must be 2 to 60 characters'),
  body('comment')
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage('Comment must be 2 to 1000 characters'),
];

export const deleteCommentRules = [
  ...mongoId('id'),
  ...mongoId('commentId'),
];
