import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  GetAlbumListRequest,
  GetAlbumRequest,
  InsertAlbumRequest
} from "./protocols";
import { albumService } from "../../service/common-services";

const albumRouter = createTRPCRouter({
  getAlbumList: publicProcedure
    .input(GetAlbumListRequest)
    .query(async ({ input }) => {
      if (input.classId !== "")
        return await albumService.getAlbumListByClass(input.classId);
      return await albumService.getAlbumListByStudent(input.studentId);
    }),

  getAlbum: publicProcedure
    .input(GetAlbumRequest)
    .query(async ({ input }) => await albumService.getAlbum(input.albumId)),

  insertAlbum: publicProcedure
    .input(InsertAlbumRequest)
    .mutation(
      async ({ input }) =>
        await albumService.insertAlbum(
          input.title,
          input.description,
          input.photos,
          input.classId
        )
    )
});

export { albumRouter };
