import { notFoundError } from "../../../shared/errors/AppError";
import { getWorkById } from "../../works/services/workService";
import {
  createDubbedVersion,
  createEpisode,
  deleteDubbedVersionById,
  findDubbedVersionById,
  findDubbedVersionForManagement,
  findDubbedVersionsByWorkId,
  updateDubbedVersionById,
} from "../repositories/dubbedRepository";
import { CreateDubbedVersionDto, CreateEpisodeDto, UpdateDubbedVersionDto } from "../dto/dubbedDtos";

export function listDubbedVersionsForWork(workId: string) {
  return findDubbedVersionsByWorkId(workId);
}

export async function getDubbedVersionById(dubbedVersionId: string) {
  const dubbedVersion = await findDubbedVersionById(dubbedVersionId);

  if (!dubbedVersion) {
    throw notFoundError("Dubbed version", dubbedVersionId);
  }

  return dubbedVersion;
}

export async function addDubbedVersionToWork(dubbedVersionData: CreateDubbedVersionDto) {
  // Confirms the parent Work exists before attaching a dubbed version to
  // it, since "dubbed" builds on top of "works" rather than duplicating
  // it (architecture doc, section 19).
  await getWorkById(dubbedVersionData.workId);
  return createDubbedVersion(dubbedVersionData);
}

export async function updateExistingDubbedVersion(
  dubbedVersionId: string,
  dubbedVersionData: UpdateDubbedVersionDto
) {
  const existing = await findDubbedVersionForManagement(dubbedVersionId);
  if (!existing) throw notFoundError("Dubbed version", dubbedVersionId);
  return updateDubbedVersionById(dubbedVersionId, dubbedVersionData);
}

export async function removeDubbedVersion(dubbedVersionId: string) {
  const existing = await findDubbedVersionForManagement(dubbedVersionId);
  if (!existing) throw notFoundError("Dubbed version", dubbedVersionId);
  await deleteDubbedVersionById(dubbedVersionId);
}

export async function addEpisodeToDubbedVersion(episodeData: CreateEpisodeDto) {
  const version = await findDubbedVersionForManagement(episodeData.dubbedVersionId);
  if (!version) throw notFoundError("Dubbed version", episodeData.dubbedVersionId);
  return createEpisode(episodeData);
}
