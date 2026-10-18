import { Router } from "express";
import { WorkType, type Work as PrismaWork } from "@prisma/client";
import { listWorks, getPublishedWorkById } from "../modules/works/services/workService";
import { AppError } from "../shared/errors/AppError";
import { parseCursorPage } from "../shared/utils/cursorPagination";
import type { Work } from "./types/workTypes";
import { renderDocument } from "./render";
import { HomePage } from "./pages/HomePage";
import { WorksPage } from "./pages/WorksPage";
import { WorkDetailPage, MessagePage } from "./pages/WorkDetailPage";

// DIRECT CONNECTION — there is no API in this application.
// These page handlers run in the same process as the backend services
// and call them as ordinary functions (listWorks, getPublishedWorkById),
// then render the page to HTML with the data already inside it.
// The browser never calls the backend: it receives finished pages.

export const webRoutes = Router();

// The services return Prisma rows (Date objects); the page components
// work with ISO strings, exactly the shape the old client type used.
function toWorkView(row: PrismaWork): Work {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    thumbnailUrl: row.thumbnailUrl,
    coverUrl: row.coverUrl,
    type: row.type,
    status: row.status,
    releaseDate: row.releaseDate ? row.releaseDate.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function parseWorkType(raw: unknown): WorkType | undefined {
  if (typeof raw !== "string" || raw === "") return undefined;
  return (Object.values(WorkType) as string[]).includes(raw)
    ? (raw as WorkType)
    : undefined;
}

webRoutes.get("/", async (_request, response) => {
  try {
    const { items } = await listWorks({ limit: 20 });
    response.send(renderDocument("/", <HomePage works={items.map(toWorkView)} />));
  } catch {
    response
      .status(500)
      .send(renderDocument("/", <MessagePage message="Could not load works. The database could not be reached." />));
  }
});

webRoutes.get("/works", async (request, response) => {
  const type = parseWorkType(request.query.type);
  const page = parseCursorPage(request.query.limit, request.query.cursor);
  try {
    const { items, nextCursor } = await listWorks({ ...page, type });
    response.send(
      renderDocument(
        request.originalUrl,
        <WorksPage works={items.map(toWorkView)} selectedType={type ?? ""} nextCursor={nextCursor} />
      )
    );
  } catch {
    response
      .status(500)
      .send(renderDocument("/works", <MessagePage message="Could not load works. The database could not be reached." />));
  }
});

webRoutes.get("/works/:workId", async (request, response) => {
  try {
    const work = await getPublishedWorkById(request.params.workId);
    response.send(
      renderDocument(request.originalUrl, <WorkDetailPage work={toWorkView(work)} />)
    );
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500;
    response
      .status(status)
      .send(renderDocument(request.originalUrl, <MessagePage message="This work could not be found." />));
  }
});
