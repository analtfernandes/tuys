import Joi from "joi";

const imageFormatRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;

const postChannel = Joi.object({
  name: Joi.string().required(),
  background: Joi.string().regex(imageFormatRegex).message("A url da imagem é inválida!").required(),
});

const allChannelIdParams = Joi.object({
  channelId: Joi.number().integer().min(1).required(),
});

export { postChannel, allChannelIdParams };
