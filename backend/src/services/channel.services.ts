import { Channels } from "@prisma/client";
import { badRequestError, notFoundError } from "../helpers/errors.helper";
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

async function putChannel(data: PutChannelParams) {
  const channel = await channelRepository.findById(data.id);
  if (!channel) throw notFoundError();
  if (!channel.editable) throw badRequestError("Esse canal não é editável!");

  if (channel.name !== data.name) {
    const channelWithSameName = await channelRepository.findAllByName(data.name);
    if (channelWithSameName.length > 0) throw badRequestError(`Já existe um canal chamado ${data.name.toLowerCase()}!`);
  }

  await channelRepository.updateChannel(data);
}

async function deleteChannel(id: number) {
  const channel = await channelRepository.findById(id);
  if (!channel) throw notFoundError();
  if (!channel.editable) throw badRequestError();

  await channelRepository.deleteChannel(id);
}

type PostChannelParams = Omit<Channels, "id" | "editable">;
type PutChannelParams = Omit<Channels, "editable">;

export { getAll, postChannel, putChannel, deleteChannel };
