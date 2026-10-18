import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import {
  addScriptToWork,
  getScriptById,
  listScriptsForWork,
  removeScript,
  updateExistingScript,
} from "../services/scriptService";
import { CreateScriptDto, UpdateScriptDto } from "../dto/scriptDtos";

export const handleListScriptsForWork = asyncHandler(
  async (request: Request, response: Response) => {
    const scripts = await listScriptsForWork(request.params.workId);
    response.status(200).json(scripts);
  }
);

export const handleGetScriptById = asyncHandler(
  async (request: Request, response: Response) => {
    const script = await getScriptById(request.params.scriptId);
    response.status(200).json(script);
  }
);

export const handleCreateScript = asyncHandler(
  async (request: Request, response: Response) => {
    const createdScript = await addScriptToWork(request.body as CreateScriptDto);
    response.status(201).json(createdScript);
  }
);

export const handleUpdateScript = asyncHandler(
  async (request: Request, response: Response) => {
    const updatedScript = await updateExistingScript(
      request.params.scriptId,
      request.body as UpdateScriptDto
    );
    response.status(200).json(updatedScript);
  }
);

export const handleDeleteScript = asyncHandler(
  async (request: Request, response: Response) => {
    await removeScript(request.params.scriptId);
    response.status(204).send();
  }
);
