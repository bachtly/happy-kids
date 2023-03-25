import { medicineService } from "../../service/common-services";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  GetMedicineLetterListParams,
  GetMedicineLetterParams,
  PostMedicineLetterParams,
  UpdateStatusMedicineLetterParams
} from "./protocols";

export const medicineRouter = createTRPCRouter({
  postMedicineLetter: protectedProcedure
    .input(PostMedicineLetterParams)
    .mutation(async ({ input }) => {
      return await medicineService.createMedicineLetter(
        input.parentId,
        input.studentId,
        input.startDate,
        input.endDate,
        input.time,
        input.note,
        input.medicines
      );
    }),

  getMedicineLetterList: protectedProcedure
    .input(GetMedicineLetterListParams)
    .query(async ({ input }) => {
      return await medicineService.getMedicineLetterList(
        input.studentId,
        input.classId
      );
    }),

  getMedicineLetter: protectedProcedure
    .input(GetMedicineLetterParams)
    .query(async ({ input }) => {
      return await medicineService.getMedicineLetter(input.medicineLetterId);
    }),

  updateMedicineLetter: protectedProcedure
    .input(UpdateStatusMedicineLetterParams)
    .mutation(async ({ input }) => {
      return await medicineService.updateMedicineLetter(
        input.teacherId,
        input.medicineLetterId,
        input.status,
        input.isUsed
      );
    })
});
