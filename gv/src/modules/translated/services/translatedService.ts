import { notFoundError } from "../../../shared/errors/AppError";
import { getWorkById } from "../../works/services/workService";
import {
  createTranslatedVersion,
  deleteTranslatedVersionById,
  findTranslatedVersionById,
  findTranslatedVersionForManagement,
  findTranslatedVersionsByWorkId,
  updateTranslatedVersionById,
} from "../repositories/translatedRepository";
import { CreateTranslatedVersionDto, UpdateTranslatedVersionDto } from "../dto/translatedDtos";

export function listTranslatedVersionsForWork(workId: string) {
  return findTranslatedVersionsByWorkId(workId);
}

export async function getTranslatedVersionById(translatedVersionId: string) {
  const translatedVersion = await findTranslatedVersionById(translatedVersionId);

  if (!translatedVersion) {
    throw notFoundError("Translated version", translatedVersionId);
  }

  return translatedVersion;
}

export async function addTranslatedVersionToWork(
  translatedVersionData: CreateTranslatedVersionDto
) {
  await getWorkById(translatedVersionData.workId);
  return createTranslatedVersion(translatedVersionData);
}

export async function updateExistingTranslatedVersion(
  translatedVersionId: string,
  translatedVersionData: UpdateTranslatedVersionDto
) {
  const existing = await findTranslatedVersionForManagement(translatedVersionId);
  if (!existing) throw notFoundError("Translated version", translatedVersionId);
  return updateTranslatedVersionById(translatedVersionId, translatedVersionData);
}

export async function removeTranslatedVersion(translatedVersionId: string) {
  const existing = await findTranslatedVersionForManagement(translatedVersionId);
  if (!existing) throw notFoundError("Translated version", translatedVersionId);
  await deleteTranslatedVersionById(translatedVersionId);
}
