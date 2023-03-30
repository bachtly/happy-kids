import { mysqlDB } from "@acme/db";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import "reflect-metadata";
import { container } from "tsyringe";
import AttendanceService from "./attendance-service";
import LoginService from "./login-service";
import SignupService from "./signup-service";
import MedicineService from "./medicine-service";
import PickupService from "./pickup-service";
import LeaveLetterService from "./leaveletter-service";

container.register<Kysely<DB>>(Kysely, { useValue: mysqlDB });

export const loginService = container.resolve(LoginService);
export const attendanceService = container.resolve(AttendanceService);
export const pickupService = container.resolve(PickupService);

export const signupService = container.resolve(SignupService);

export const medicineService = container.resolve(MedicineService);

export const leaveletterService = container.resolve(LeaveLetterService);
