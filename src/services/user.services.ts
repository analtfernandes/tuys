import { Stories, UserStatus } from "@prisma/client";
import { notFoundError } from "../helpers/errors.helper";
import * as userRepository from "../repositories/user.repository";
import * as storyRepository from "../repositories/story.repository";
import { formatStories } from "./story.services";

async function getUserData(userId: number) {
  const user = await userRepository.findUserData(userId);

  if (!user) throw notFoundError();

  return formatUser(user);
}

async function getUserStories(userId: number) {
  const stories = await storyRepository.findAllByUser(userId);

  if (!stories) throw notFoundError();

  return formatStories(stories, userId);
}

function formatUser(user: FormatUserParams) {
  return {
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
}

type FormatUserParams = {
  id: number;
  username: string;
  avatar: string;
  about: string;
  status: UserStatus;
  Stories: Stories[];
  Ranks: {
    color: string;
    name: string;
  };
  _count: {
    Followed: number;
    Follower: number;
    Stories: number;
  };
};

export { getUserData, getUserStories };
