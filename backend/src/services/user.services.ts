import { badRequestError, notFoundError } from "../helpers/errors.helper";
import * as userRepository from "../repositories/user.repository";
import * as storyRepository from "../repositories/story.repository";
import * as notificationRepository from "../repositories/notification.repository";
import { formatStories } from "./story.services";
import { Follows, StorieStatus, Users } from "@prisma/client";

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

async function getUserStories(userId: number, status: StorieStatus) {
  const stories = await storyRepository.findAllByUser(userId, userId, status);

  if (!stories) throw notFoundError();

  return formatStories(stories, userId);
}

async function getUserFollowers(userId: number) {
  const user = await userRepository.findUserById(userId);
  if (!user) throw notFoundError();

  const followers = await userRepository.findFollowers(userId);
  if (!followers) throw notFoundError();

  const formatedFollowers = followers.map(({ Followed: { Ranks, ...follower } }) => ({
    rankColor: Ranks.color,
    ...follower,
  }));

  return formatedFollowers;
}

async function getWhoUserIsFollowing(userId: number) {
  const user = await userRepository.findUserById(userId);
  if (!user) throw notFoundError();

  const following = await userRepository.findWhoUserIsFollowing(userId);
  if (!following) throw notFoundError();

  const formatedFollowing = following.map(({ Follower: { Ranks, ...follower } }) => ({
    rankColor: Ranks.color,
    ...follower,
  }));

  return formatedFollowing;
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

  await notificationRepository.createNewFollowNotification({ followedId, followerId });
}

async function postUnfollow({ followedId, followerId }: PostFollowParams) {
  const followed = await userRepository.findUserById(followedId);
  if (!followed) throw notFoundError();

  const userAlreadyFollow = await userRepository.findFollow({ followedId, followerId });
  if (!userAlreadyFollow) throw badRequestError();

  await userRepository.deleteFollow({ followedId, followerId });
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
  getUserFollowers,
  getWhoUserIsFollowing,
  getUsersByUsername,
  getUserDataByUserId,
  getUserStoriesByUserId,
  postFollow,
  postUnfollow,
  putUser,
};
