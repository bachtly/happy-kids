import { createTRPCRouter, publicProcedure } from "../../trpc";
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
  getPickupList: publicProcedure
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

  getPickupDetail: publicProcedure
    .input(GetPickupDetailRequest)
    .output(GetPickupDetailResponse)
    .mutation(
      async ({ input }) => await pickupService.getPickupDetail(input.id)
    ),

  getRelativeList: publicProcedure
    .input(GetRelativeListRequest)
    // .output(GetRelativeListResponse)
    .mutation(
      async ({ input }) => await pickupService.getRelativeList(input.parentId)
    ),

  insertRelative: publicProcedure
    .input(InsertRelativeRequest)
    .output(InsertRelativeResponse)
    .mutation(
      async ({ input }) =>
        await pickupService.insertRelative(
          input.fullname,
          input.note,
          input.phone,
          input.avatarData,
          input.parentId
        )
    ),

  insertPickupLetter: publicProcedure
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

  getPickupListFromClassId: publicProcedure
    .input(GetPickupListFromClassIdRequest)
    .output(GetPickupListFromClassIdResponse)
    .mutation(
      async ({ input }) =>
        await pickupService.getPickupListFromStudentIds(
          input.time,
          input.classId
        )
    ),

  confirmPickupLetter: publicProcedure
    .input(ConfirmPickupLetterRequest)
    .output(ConfirmPickupLetterResponse)
    .mutation(
      async ({ input }) =>
        await pickupService.confirmPickupLetter(input.id, input.teacherId)
    ),

  rejectPickupLetter: publicProcedure
    .input(RejectPickupLetterRequest)
    .output(RejectPickupLetterResponse)
    .mutation(
      async ({ input }) =>
        await pickupService.rejectPickupLetter(input.id, input.teacherId)
    )
});

export { pickupRouter };
