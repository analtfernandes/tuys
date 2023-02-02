import { badRequestError, notFoundError } from "../helpers/errors.helper";
import * as userRepository from "../repositories/user.repository";
import * as storyRepository from "../repositories/story.repository";
import * as notificationRepository from "../repositories/notification.repository";
import { formatStories } from "./story.services";
import { Follows, Users } from "@prisma/client";

async function getUserData(userId: number) {
  const user = await userRepository.findUserData(userId);

  if (!user) throw notFoundError();

  const formatedUser = {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    about: user.about,
    status: user.status,
    rankName: user.Ranks.name,
    rankColor: user.Ranks.color,
    bannedStories: user.Stories.length,
    createdStories: user._count.Stories,
    followers: user._count.Follower,
    following: user._count.Followed,
  };

  return formatedUser;
}

async function getUserResgiter(userId: number) {
  const user = await userRepository.findUserRegister(userId);

  if (!user) throw notFoundError();

  return user;
}

async function getUserDataByUserId(userId: number, wantedUser: number) {
  const user = await userRepository.findUserDataByUserId(wantedUser, userId);

  if (!user) throw notFoundError();

  const formatedUser = {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    about: user.about,
    status: user.status,
    rankName: user.Ranks.name,
    rankColor: user.Ranks.color,
    createdStories: user._count.Stories,
    followers: user._count.Follower,
    following: user._count.Followed,
    isFollowing: user.Follower.length > 0 ? true : false,
    isUser: user.id === userId,
  };

  return formatedUser;
}

async function getUserStories(userId: number) {
  const stories = await storyRepository.findAllByUser(userId, userId);

  if (!stories) throw notFoundError();

  return formatStories(stories, userId);
}

async function getUserStoriesByUserId(userId: number, wantedUser: number) {
  const user = await userRepository.findUserById(wantedUser);
  if (!user) throw notFoundError();

  const stories = await storyRepository.findAllByUser(wantedUser, userId);

  return formatStories(stories, userId);
}

async function getUsersByUsername(userId: number, username: string) {
  const users = await userRepository.findUsers(userId, username);

  const formatedUsers = users.map(({ Follower, Ranks, ...user }) => ({
    following: Follower.length > 0 ? true : false,
    rankColor: Ranks.color,
    isUser: user.id === userId,
    ...user,
  }));

  return formatedUsers;
}

async function postFollow({ followedId, followerId }: PostFollowParams) {
  const followed = await userRepository.findUserById(followedId);
  if (!followed) throw notFoundError();

  const userAlreadyFollow = await userRepository.findFollow({ followedId, followerId });
  if (userAlreadyFollow) throw badRequestError();

  await userRepository.createFollow({ followedId, followerId });

  await postFollowNotification(followedId);
}

async function postUnfollow({ followedId, followerId }: PostFollowParams) {
  const followed = await userRepository.findUserById(followedId);
  if (!followed) throw notFoundError();

  const userAlreadyFollow = await userRepository.findFollow({ followedId, followerId });
  if (!userAlreadyFollow) throw badRequestError();

  await userRepository.deleteFollow({ followedId, followerId });
}

async function postFollowNotification(userId: number) {
  const followers = await userRepository.findFollowers(userId);

  const user = followers[0].Follower.username;

  if (followers.length === 1) {
    const notificationMessage = `${user} começou a te seguir.`;
    await notificationRepository.createNewFollowNotification(notificationMessage, userId);
  }

  if (followers.length % 4 === 0) {
    const notificationMessage = `${user} e mais 3 começaram a te seguir.`;
    await notificationRepository.createNewFollowNotification(notificationMessage, userId);
  }
}

async function putUser(userId: number, data: PutUserParams) {
  const user = await userRepository.findUserById(userId);
  if (!user) throw notFoundError();

  const userWithUsername = await userRepository.findUserByUsername(data.username);
  if (userWithUsername && userWithUsername.id !== userId) throw badRequestError();

  await userRepository.updateUser(userId, data);
}

type PostFollowParams = Omit<Follows, "id">;
type PutUserParams = Omit<Users, "id" | "email" | "password" | "rankId" | "status">;

export {
  getUserData,
  getUserResgiter,
  getUserStories,
  getUsersByUsername,
  getUserDataByUserId,
  getUserStoriesByUserId,
  postFollow,
  postUnfollow,
  putUser,
};
