import { Request, Response } from "express";
import { WorkType } from "@prisma/client";
import { parseCursorPage } from "../../../shared/utils/cursorPagination";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import {
  getPublishedWorkById,
  listWorks,
  publishNewWork,
  removeWork,
  updateExistingWork,
} from "../services/workService";
import { CreateWorkDto, UpdateWorkDto } from "../dto/workDtos";

export const handleListWorks = asyncHandler(async (request: Request, response: Response) => {
  const typeFilter = request.query.type as WorkType | undefined;
  const page = parseCursorPage(request.query.limit, request.query.cursor);
  const works = await listWorks({ type: typeFilter, ...page });
  response.status(200).json(works);
});

export const handleGetWorkById = asyncHandler(async (request: Request, response: Response) => {
  const work = await getPublishedWorkById(request.params.workId);
  response.status(200).json(work);
});

export const handleCreateWork = asyncHandler(async (request: Request, response: Response) => {
  const createdWork = await publishNewWork(request.body as CreateWorkDto, request.authenticatedUser!.id);
  response.status(201).json(createdWork);
});

export const handleUpdateWork = asyncHandler(async (request: Request, response: Response) => {
  const updatedWork = await updateExistingWork(
    request.params.workId,
    request.body as UpdateWorkDto,
    request.authenticatedUser!.id
  );
  response.status(200).json(updatedWork);
});

export const handleDeleteWork = asyncHandler(async (request: Request, response: Response) => {
  await removeWork(request.params.workId, request.authenticatedUser!.id);
  response.status(204).send();
});
