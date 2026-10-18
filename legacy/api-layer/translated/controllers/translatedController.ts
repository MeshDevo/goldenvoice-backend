import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import {
  addTranslatedVersionToWork,
  getTranslatedVersionById,
  listTranslatedVersionsForWork,
  removeTranslatedVersion,
  updateExistingTranslatedVersion,
} from "../services/translatedService";
import { CreateTranslatedVersionDto, UpdateTranslatedVersionDto } from "../dto/translatedDtos";

export const handleListTranslatedVersionsForWork = asyncHandler(
  async (request: Request, response: Response) => {
    const translatedVersions = await listTranslatedVersionsForWork(request.params.workId);
    response.status(200).json(translatedVersions);
  }
);

export const handleGetTranslatedVersionById = asyncHandler(
  async (request: Request, response: Response) => {
    const translatedVersion = await getTranslatedVersionById(request.params.translatedVersionId);
    response.status(200).json(translatedVersion);
  }
);

export const handleCreateTranslatedVersion = asyncHandler(
  async (request: Request, response: Response) => {
    const createdTranslatedVersion = await addTranslatedVersionToWork(
      request.body as CreateTranslatedVersionDto
    );
    response.status(201).json(createdTranslatedVersion);
  }
);

export const handleUpdateTranslatedVersion = asyncHandler(
  async (request: Request, response: Response) => {
    const updatedTranslatedVersion = await updateExistingTranslatedVersion(
      request.params.translatedVersionId,
      request.body as UpdateTranslatedVersionDto
    );
    response.status(200).json(updatedTranslatedVersion);
  }
);

export const handleDeleteTranslatedVersion = asyncHandler(
  async (request: Request, response: Response) => {
    await removeTranslatedVersion(request.params.translatedVersionId);
    response.status(204).send();
  }
);
