import Joi from "joi";

const imageFormatRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;

const postChannel = Joi.object({
  name: Joi.string().required(),
  background: Joi.string().regex(imageFormatRegex).message("A url da imagem é inválida!").required(),
});

export { postChannel };
