import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  GetAlbumListRequest,
  GetAlbumRequest,
  InsertAlbumRequest,
  InsertAlbumTopicRequest
} from "./protocols";
import { albumService } from "../../service/common-services";

const albumRouter = createTRPCRouter({
  getAlbumList: protectedProcedure
    .input(GetAlbumListRequest)
    .query(async ({ input }) => {
      if (input.classId !== "")
        return await albumService.getAlbumListByClass(input.classId);
      return await albumService.getAlbumListByStudent(input.studentId);
    }),

  getAlbum: protectedProcedure
    .input(GetAlbumRequest)
    .query(async ({ input }) => await albumService.getAlbum(input.albumId)),

  insertAlbum: protectedProcedure
    .input(InsertAlbumRequest)
    .mutation(async ({ ctx, input }) => {
      return await albumService.insertAlbum(
        input.title,
        input.description,
        input.photos,
        input.classId,
        input.eventDate,
        input.topics,
        ctx.session.user.id
      );
    }),

  insertAlbumTopic: protectedProcedure
    .input(InsertAlbumTopicRequest)
    .mutation(
      async ({ input }) => await albumService.insertAlbumTopic(input.topic)
    ),

  getAlbumTopic: protectedProcedure.query(
    async () => await albumService.getAlbumTopic()
  )
});

export { albumRouter };
