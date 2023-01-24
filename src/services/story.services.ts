import { Follows, Likes, Stories } from "@prisma/client";
import * as storyRepository from "../repositories/story.repository";
import * as channelRepository from "../repositories/channel.repository";
import { notFoundError } from "../helpers/errors.helper";

async function getAllOfChannel({ channelId, userId }: GetAllOfChannelParams) {
  const channel = await channelRepository.findById(channelId);

  if (!channel) throw notFoundError();

  const stories = await storyRepository.findAllByChannelId({ channelId, userId });

  return formatStories(stories, userId);
}

function formatStories(stories: FormatStoriesParams, userId: number) {
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

export { getAllOfChannel };
