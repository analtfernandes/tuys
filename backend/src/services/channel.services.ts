import { Channels } from "@prisma/client";
import { badRequestError } from "../helpers/errors.helper";
import * as channelRepository from "../repositories/channel.repository";

function getAll() {
  return channelRepository.findAll();
}

async function postChannel(data: PostChannelParams) {
  const channelWithSameName = await channelRepository.findByName(data.name);
  if (channelWithSameName) throw badRequestError();

  const channel = await channelRepository.createChannel(data);

  return { id: channel.id };
}

type PostChannelParams = Omit<Channels, "id" | "editable">;

export { getAll, postChannel };
