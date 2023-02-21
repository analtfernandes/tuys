import { Comments, Denunciations, Follows, Likes, Stories, StorieStatus, UserStatus } from "@prisma/client";
import * as storyRepository from "../repositories/story.repository";
import * as channelRepository from "../repositories/channel.repository";
import * as rankRepository from "../repositories/rank.repository";
import * as notificationRepository from "../repositories/notification.repository";
import { badRequestError, forbiddenError, notFoundError, unauthorizedError } from "../helpers/errors.helper";

async function getFromUserAndFollowed(userId: number) {
  const stories = await storyRepository.findAll(userId);
  return formatStories(stories, userId);
}

async function getAllOfChannel({ channelId, userId }: GetAllOfChannelParams) {
  await validateChannelId(channelId);

  const stories = await storyRepository.findAllByChannelId({ channelId, userId });

  return formatStories(stories, userId);
}

async function getComments({ storyId, userId }: GetCommentsParams) {
  const story = await storyRepository.findById(storyId);
  if (!story) throw notFoundError();

  const comments = await storyRepository.findComments(storyId, userId);

  return formatComments(comments, userId);
}

async function postStory(data: PostStoryParams) {
  const channel = await validateChannelId(data.channelId);

  const createdStory = await storyRepository.createStory(data);

  await notificationRepository.createNewStoryNotification({ story: createdStory, channel });
  await rankRepository.updateUserRank(data.userId);

  return { id: createdStory.id };
}

async function postLikeStory(storyId: number, userId: number) {
  const story = await storyRepository.findById(storyId);
  if (!story) throw notFoundError();
  validateStoryStatus(story);

  const isLikedByUser = await storyRepository.findStoryLikedByUser(storyId, userId);
  if (isLikedByUser) throw badRequestError();

  await storyRepository.createLike(storyId, userId);

  await notificationRepository.createNewLikeNotification(story, userId);
  await rankRepository.updateUserRank(story.userId);
}

async function postUnlikeStory(storyId: number, userId: number) {
  const story = await storyRepository.findById(storyId);
  if (!story) throw notFoundError();
  validateStoryStatus(story);

  const isLikedByUser = await storyRepository.findStoryLikedByUser(storyId, userId);
  if (!isLikedByUser) throw badRequestError();

  await storyRepository.deleteLike(isLikedByUser.id);
}

async function postComment(data: PostCommentParams) {
  const story = await storyRepository.findById(data.storyId);
  if (!story) throw notFoundError();
  validateStoryStatus(story);

  const comment = await storyRepository.createComment(data);

  await notificationRepository.createNewCommentNotification(story, data.userId);

  return { id: comment.id };
}

async function postDenounce(data: PostDenounceParams) {
  const story = await storyRepository.findById(data.storyId);
  if (!story) throw notFoundError();
  validateStoryStatus(story);

  const userAlreadyDenounceStory = await storyRepository.findStoryDenouncedByUser(data.storyId, data.userId);
  if (userAlreadyDenounceStory) throw badRequestError();

  await storyRepository.createDenunciation(data);
  await notificationRepository.createNewDenounceNotification(story, data.text);
}

async function deleteStory(data: DeleteStoryParams) {
  const story = await storyRepository.findById(data.id);
  if (!story) throw notFoundError();
  validateStoryStatus(story);

  if (story.userId !== data.userId) throw unauthorizedError();

  await storyRepository.deleteStory(data.id);
}

async function putStory(data: PutStoryParams) {
  const story = await storyRepository.findById(data.storyId);
  if (!story) throw notFoundError();
  validateStoryStatus(story);

  if (story.userId !== data.userId) throw unauthorizedError();

  await storyRepository.updateStory(data);
}

async function validateChannelId(id: number) {
  const channel = await channelRepository.findById(id);

  if (!channel) throw notFoundError();

  return channel;
}

function validateStoryStatus(story: Stories) {
  if (story.status === StorieStatus.BANNED) throw forbiddenError();
}

function formatComments(comments: FormartCommentsParams, userId: number) {
  return comments.map(({ Users, Stories, ...comment }) => ({
    owner: {
      isOwner: Users.id === userId,
      username: Users.username,
      avatar: Users.avatar,
      rankColor: Users.Ranks.color,
      status: Users.status,
    },
    isOwnerFollower: Users.Follower.length === 0 ? false : true,
    commentedByAuthor: Users.id === Stories.userId,
    ...comment,
  }));
}

export function formatStories(stories: FormatStoriesParams, userId: number) {
  return stories.map(({ Users, Likes, Channels, _count, ...story }) => ({
    owner: {
      isOwner: Users.id === userId,
      username: Users.username,
      avatar: Users.avatar,
      rankColor: Users.Ranks.color,
      status: Users.status,
    },
    likedByUser: Likes.length === 0 ? false : true,
    followedByUser: Users.Follower.length === 0 ? false : true,
    likes: _count.Likes,
    comments: _count.Comments,
    channel: Channels.name,
    ...story,
  }));
}

type GetAllOfChannelParams = { channelId: number; userId: number };
type GetCommentsParams = Omit<Comments, "id" | "text">;
type PostCommentParams = Omit<Comments, "id">;
type PostStoryParams = Omit<Stories, "id" | "date" | "status">;
type PostDenounceParams = Omit<Denunciations, "id">;
type DeleteStoryParams = { id: number; userId: number };
type PutStoryParams = Omit<Stories, "id" | "date" | "status"> & { storyId: number; userId: number };

type FormatStoriesParams = Partial<Stories> &
  {
    Likes: Likes[];
    Users: {
      id: number;
      username: string;
      avatar: string;
      status: string;
      Ranks: {
        color: string;
      };
      Follower: Follows[];
    };
    _count: {
      Comments: number;
      Likes: number;
    };
    Channels: {
      name: string;
    };
  }[];

type FormartCommentsParams = (Comments & {
  Users: {
    id: number;
    status: UserStatus;
    username: string;
    avatar: string;
    Ranks: {
      color: string;
    };
    Follower: Follows[];
  };
  Stories: {
    userId: number;
  };
})[];

export {
  getFromUserAndFollowed,
  getAllOfChannel,
  getComments,
  postStory,
  postLikeStory,
  postUnlikeStory,
  postComment,
  postDenounce,
  deleteStory,
  putStory,
};
