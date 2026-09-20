import { WorkStatus } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { CreateScriptDto, UpdateScriptDto } from "../dto/scriptDtos";

export function findScriptsByWorkId(workId: string) {
  return prismaClient.script.findMany({
    where: { workId, status: WorkStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
  });
}

export function findScriptById(scriptId: string) {
  return prismaClient.script.findFirst({ where: { id: scriptId, status: WorkStatus.PUBLISHED } });
}

export function findScriptForManagement(scriptId: string) {
  return prismaClient.script.findUnique({ where: { id: scriptId } });
}

export function createScript(scriptData: CreateScriptDto) {
  return prismaClient.script.create({ data: scriptData });
}

export function updateScriptById(scriptId: string, scriptData: UpdateScriptDto) {
  return prismaClient.script.update({ where: { id: scriptId }, data: scriptData });
}

export function deleteScriptById(scriptId: string) {
  return prismaClient.script.delete({ where: { id: scriptId } });
}
