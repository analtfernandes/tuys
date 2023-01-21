import * as channelRepository from "../repositories/channel.repository";

function getAll() {
  return channelRepository.findAll();
}

export { getAll };
