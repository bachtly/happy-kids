import React from "react";

interface ParentAttendanceContextProps {
  studentId: string;
}

const AttendanceContext =
  React.createContext<ParentAttendanceContextProps | null>(null);

interface TeacherAttendanceContextProps {
  classId: string;
}
const TeacherAttendanceContext =
  React.createContext<TeacherAttendanceContextProps | null>(null);

export { AttendanceContext, TeacherAttendanceContext };
