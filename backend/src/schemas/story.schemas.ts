import Joi from "joi";

const getByChannelId = Joi.object({
  channelId: Joi.number().integer().min(1).required(),
});

const postNew = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  body: Joi.string().min(10).max(1000).required(),
  channelId: Joi.number().integer().min(1).required(),
});

const postLike = Joi.object({
  storyId: Joi.number().integer().min(1).required(),
});

const postComment = Joi.object({
  text: Joi.string().required(),
});

const putBody = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  body: Joi.string().min(10).max(1000).required(),
});

const postDenounceBody = postComment;
const postDenounceParams = postLike;
const allCommentsParams = postLike;
const deleteParams = postLike;
const putParams = postLike;

export {
  getByChannelId,
  postNew,
  postLike,
  postComment,
  postDenounceParams,
  postDenounceBody,
  deleteParams,
  allCommentsParams,
  putBody,
  putParams,
};
