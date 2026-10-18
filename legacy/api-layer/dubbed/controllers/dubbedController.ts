import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import {
  addDubbedVersionToWork,
  addEpisodeToDubbedVersion,
  getDubbedVersionById,
  listDubbedVersionsForWork,
  removeDubbedVersion,
  updateExistingDubbedVersion,
} from "../services/dubbedService";
import { CreateDubbedVersionDto, CreateEpisodeDto, UpdateDubbedVersionDto } from "../dto/dubbedDtos";

export const handleListDubbedVersionsForWork = asyncHandler(
  async (request: Request, response: Response) => {
    const dubbedVersions = await listDubbedVersionsForWork(request.params.workId);
    response.status(200).json(dubbedVersions);
  }
);

export const handleGetDubbedVersionById = asyncHandler(
  async (request: Request, response: Response) => {
    const dubbedVersion = await getDubbedVersionById(request.params.dubbedVersionId);
    response.status(200).json(dubbedVersion);
  }
);

export const handleCreateDubbedVersion = asyncHandler(
  async (request: Request, response: Response) => {
    const createdDubbedVersion = await addDubbedVersionToWork(
      request.body as CreateDubbedVersionDto
    );
    response.status(201).json(createdDubbedVersion);
  }
);

export const handleUpdateDubbedVersion = asyncHandler(
  async (request: Request, response: Response) => {
    const updatedDubbedVersion = await updateExistingDubbedVersion(
      request.params.dubbedVersionId,
      request.body as UpdateDubbedVersionDto
    );
    response.status(200).json(updatedDubbedVersion);
  }
);

export const handleDeleteDubbedVersion = asyncHandler(
  async (request: Request, response: Response) => {
    await removeDubbedVersion(request.params.dubbedVersionId);
    response.status(204).send();
  }
);

export const handleCreateEpisode = asyncHandler(
  async (request: Request, response: Response) => {
    const createdEpisode = await addEpisodeToDubbedVersion(request.body as CreateEpisodeDto);
    response.status(201).json(createdEpisode);
  }
);
