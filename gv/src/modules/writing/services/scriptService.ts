import { notFoundError } from "../../../shared/errors/AppError";
import { getWorkById } from "../../works/services/workService";
import {
  createScript,
  deleteScriptById,
  findScriptById,
  findScriptForManagement,
  findScriptsByWorkId,
  updateScriptById,
} from "../repositories/scriptRepository";
import { CreateScriptDto, UpdateScriptDto } from "../dto/scriptDtos";

export function listScriptsForWork(workId: string) {
  return findScriptsByWorkId(workId);
}

export async function getScriptById(scriptId: string) {
  const script = await findScriptById(scriptId);

  if (!script) {
    throw notFoundError("Script", scriptId);
  }

  return script;
}

export async function addScriptToWork(scriptData: CreateScriptDto) {
  await getWorkById(scriptData.workId);
  return createScript(scriptData);
}

export async function updateExistingScript(scriptId: string, scriptData: UpdateScriptDto) {
  const existing = await findScriptForManagement(scriptId);
  if (!existing) throw notFoundError("Script", scriptId);
  return updateScriptById(scriptId, scriptData);
}

export async function removeScript(scriptId: string) {
  const existing = await findScriptForManagement(scriptId);
  if (!existing) throw notFoundError("Script", scriptId);
  await deleteScriptById(scriptId);
}
