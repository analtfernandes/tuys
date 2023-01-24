import Joi from "joi";

const getStoriesByChannelIdSchema = Joi.object({
  channelId: Joi.number().integer().min(1).required(),
});

export { getStoriesByChannelIdSchema };
