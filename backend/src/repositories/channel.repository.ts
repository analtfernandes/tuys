import { Channels } from "@prisma/client";
import { prisma } from "../database";

function findAll() {
  return prisma.channels.findMany({ orderBy: { id: "asc" } });
}

function findById(id: number) {
  return prisma.channels.findUnique({ where: { id } });
}

function findByName(name: string) {
  return prisma.channels.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
}

function findAllByName(name: string) {
  return prisma.channels.findMany({ where: { name: { equals: name, mode: "insensitive" } } });
}

function createChannel(data: CreateChannelParams) {
  return prisma.channels.create({ data: { ...data, editable: true } });
}

function updateChannel({ id, ...data }: UpdateChannelParams) {
  return prisma.channels.update({ where: { id }, data: { ...data, editable: true } });
}

function deleteChannel(id: number) {
  return prisma.$transaction(async (pr) => {
    await pr.stories.deleteMany({ where: { channelId: id } });
    await pr.channels.delete({ where: { id } });
  });
}

type CreateChannelParams = Omit<Channels, "id" | "editable">;
type UpdateChannelParams = Omit<Channels, "editable">;

export { findAll, findById, findByName, findAllByName, createChannel, updateChannel, deleteChannel };
