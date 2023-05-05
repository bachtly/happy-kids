import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  ConfirmPickupLetterRequest,
  ConfirmPickupLetterResponse,
  GetPickupDetailRequest,
  GetPickupDetailResponse,
  GetPickupListFromClassIdRequest,
  GetPickupListFromClassIdResponse,
  GetPickupListRequest,
  GetPickupListResponse,
  GetRelativeListRequest,
  InsertPickupLetterRequest,
  InsertPickupLetterResponse,
  InsertRelativeRequest,
  InsertRelativeResponse,
  RejectPickupLetterRequest,
  RejectPickupLetterResponse
} from "./protocols";
import { pickupService } from "../../service/common-services";

const pickupRouter = createTRPCRouter({
  getPickupList: protectedProcedure
    .input(GetPickupListRequest)
    .output(GetPickupListResponse)
    .mutation(
      async ({ input }) =>
        await pickupService.getPickupList(
          input.timeStart,
          input.timeEnd,
          input.studentId
        )
    ),

  getPickupDetail: protectedProcedure
    .input(GetPickupDetailRequest)
    .output(GetPickupDetailResponse)
    .mutation(
      async ({ input }) => await pickupService.getPickupDetail(input.id)
    ),

  getRelativeList: protectedProcedure
    .input(GetRelativeListRequest)
    // .output(GetRelativeListResponse)
    .mutation(
      async ({ ctx }) => await pickupService.getRelativeList(ctx.user.userId)
    ),

  insertRelative: protectedProcedure
    .input(InsertRelativeRequest)
    .output(InsertRelativeResponse)
    .mutation(
      async ({ ctx, input }) =>
        await pickupService.insertRelative(
          input.fullname,
          input.note,
          input.phone,
          input.avatarData,
          ctx.user.userId
        )
    ),

  insertPickupLetter: protectedProcedure
    .input(InsertPickupLetterRequest)
    .output(InsertPickupLetterResponse)
    .mutation(
      async ({ input }) =>
        await pickupService.insertPickupLetter(
          input.pickerId,
          input.date,
          input.studentId,
          input.note
        )
    ),

  getPickupListFromClassId: protectedProcedure
    .input(GetPickupListFromClassIdRequest)
    .output(GetPickupListFromClassIdResponse)
    .mutation(
      async ({ input }) =>
        await pickupService.getPickupListFromStudentIds(
          input.time,
          input.classId
        )
    ),

  confirmPickupLetter: protectedProcedure
    .input(ConfirmPickupLetterRequest)
    .output(ConfirmPickupLetterResponse)
    .mutation(
      async ({ ctx, input }) =>
        await pickupService.confirmPickupLetter(input.id, ctx.user.userId)
    ),

  rejectPickupLetter: protectedProcedure
    .input(RejectPickupLetterRequest)
    .output(RejectPickupLetterResponse)
    .mutation(
      async ({ ctx, input }) =>
        await pickupService.rejectPickupLetter(input.id, ctx.user.userId)
    )
});

export { pickupRouter };
