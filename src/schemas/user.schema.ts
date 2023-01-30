import Joi from "joi";

const allUserIdParams = Joi.object({
  userId: Joi.number().integer().min(1).required(),
});

export { allUserIdParams };
