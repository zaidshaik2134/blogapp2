import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => error.msg)
      .join(', ');

    throw new AppError(message, 422);
  }

  next();
};

export default validateRequest;
