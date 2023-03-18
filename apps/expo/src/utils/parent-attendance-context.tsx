import React from "react";

interface ParentAttendanceContextProps {
  studentId: string;
}

const ParentAttendanceContext =
  React.createContext<ParentAttendanceContextProps | null>(null);

interface TeacherAttendanceContextProps {
  classId: string;
}
const TeacherAttendanceContext =
  React.createContext<TeacherAttendanceContextProps | null>(null);

export { ParentAttendanceContext, TeacherAttendanceContext };
