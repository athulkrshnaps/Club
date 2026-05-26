import { validationResult } from 'express-validator';

export const validate = (rules) => async (req, _res, next) => {
  await Promise.all(rules.map((rule) => rule.run(req)));

  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const error = new Error('Validation failed');
  error.statusCode = 422;
  error.errors = result.array().map((item) => ({
    field: item.path,
    message: item.msg
  }));
  next(error);
};
