import { Channels } from "@prisma/client";
import { prisma } from "../database";

function findAll() {
  return prisma.channels.findMany({ orderBy: { id: "asc" } });
}

function findById(id: number) {
  return prisma.channels.findUnique({ where: { id } });
}

function findByName(name: string) {
  return prisma.channels.findFirst({ where: { name: { contains: name, mode: "insensitive" } } });
}

function createChannel(data: CreateChannelParams) {
  return prisma.channels.create({ data: { ...data, editable: true } });
}

type CreateChannelParams = Omit<Channels, "id" | "editable">;

export { findAll, findById, findByName, createChannel };
