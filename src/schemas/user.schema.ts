import Joi from "joi";

const imageFormatRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;

const allUserIdParams = Joi.object({
  userId: Joi.number().integer().min(1).required(),
});

const putUserBody = Joi.object({
  username: Joi.string().required(),
  avatar: Joi.string().regex(imageFormatRegex).message("A url da imagem é inválida!").required(),
  about: Joi.string().allow("").required(),
});

export { allUserIdParams, putUserBody };
