DROP SCHEMA IF EXISTS `KindergartenSchema`;

START TRANSACTION;

CREATE SCHEMA `KindergartenSchema`;

CREATE TABLE `KindergartenSchema`.`School` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `name` varchar(255),
  `address` varchar(255)
);

CREATE TABLE `KindergartenSchema`.`Class` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `name` varchar(255),
  `schoolYear` int,
  `schoolId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`StudentClassRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `studentId` varchar(36),
  `classId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`User` (
  `id` varchar(36) PRIMARY KEY NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(255),
  `birthdate` datetime,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(16),
  `schoolId` varchar(36),
  `employeeRole` varchar(255),
  `userGroup` ENUM ('Manager', 'Teacher', 'Parent')
);

CREATE TABLE `KindergartenSchema`.`TeacherClassRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `teacherId` varchar(36),
  `classId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Relative` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `fullname` varchar(255),
  `phone` bigint,
  `avatarUrl` varchar(255),
  `note` varchar(255),
  `parentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Student` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `fullname` varchar(255),
  `avatarUrl` varchar(255),
  `birthdate` datetime,
  `parentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Post` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `createdAt` datetime,
  `title` varchar(255),
  `content` text,
  `employeeId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`UserCommentPostRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `content` varchar(255),
  `time` datetime,
  `userId` varchar(36),
  `postId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`UserReactPostRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `time` datetime,
  `userId` varchar(36),
  `postId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`UserCanViewPostRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `userId` varchar(36),
  `postId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`LeaveLetter` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `createdAt` datetime,
  `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
  `fromTime` datetime,
  `toTime` datetime,
  `reason` text,
  `updatedByTeacherId` varchar(36),
  `studentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`MedicineLetter` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `createdAt` datetime,
  `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
  `isUsed` bool,
  `note` text,
  `updatedByTeacherId` varchar(36),
  `studentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Medicine` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `name` varchar(255),
  `photoUrl` text,
  `amount` varchar(255),
  `medicineLetterId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`MedicineUseTime` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `time` datetime,
  `medicineLetterId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`PickupLetter` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `note` varchar(255),
  `pickupTime` datetime,
  `createdAt` datetime,
  `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
  `pickerRelativeId` varchar(36),
  `updatedByTeacherId` varchar(36),
  `studentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`NoteLetter` (
  `id` varchar(36) PRIMARY KEY,
  `createdAt` datetime,
  `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
  `content` text,
  `updatedByTeacherId` varchar(36),
  `studentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`NoteLetterReply` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `createdAt` datetime,
  `content` text,
  `userId` varchar(36),
  `noteLetterId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Attendance` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `date` datetime,
  `checkinTime` datetime,
  `checkoutTime` datetime,
  `checkinNote` varchar(255),
  `checkoutNote` varchar(255),
  `checkinPhotoUrl` varchar(255),
  `checkoutPhotoUrl` varchar(255),
  `status` ENUM ('CheckedIn', 'NotCheckedIn', 'AbsenseWithPermission', 'AbsenseWithoutPermission'),
  `studentId` varchar(36),
  `checkInTeacherId` varchar(36),
  `checkOutTeacherId` varchar(36),
  `pickerRelativeId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Timetable` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `startDate` datetime,
  `weekNumber` int,
  `fileUrl` varchar(255),
  `classId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Lecture` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `startTime` datetime,
  `endTime` datetime,
  `name` varchar(255),
  `timetableId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Menu` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `date` datetime
);

CREATE TABLE `KindergartenSchema`.`MenuClassRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `menuId` varchar(36),
  `classId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Meal` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `time` datetime,
  `menuId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Dish` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `name` varchar(255),
  `mealId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`DailyRemark` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `date` datetime,
  `activity` ENUM ('Study', 'Eat', 'Sleep', 'Wc', 'Other'),
  `content` text,
  `teacherId` varchar(36),
  `studentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`PeriodRemark` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `period` ENUM ('Week', 'Month', 'Quarter', 'Year'),
  `content` text,
  `startTime` datetime,
  `endTime` datetime,
  `teacherId` varchar(36),
  `studentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`TuitionFee` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `status` ENUM ('Paid', 'Unpaid'),
  `startTime` datetime,
  `endTime` datetime,
  `billUrl` varchar(255),
  `amount` bigint,
  `studentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Album` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `title` varchar(255),
  `description` text
);

CREATE TABLE `KindergartenSchema`.`AlbumStudentRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `studentId` varchar(36),
  `albumId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`AlbumPhoto` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `photoUrl` text,
  `albumId` varchar(36)
);

ALTER TABLE `KindergartenSchema`.`Class` ADD FOREIGN KEY (`schoolId`) REFERENCES `KindergartenSchema`.`School` (`id`);

ALTER TABLE `KindergartenSchema`.`StudentClassRelationship` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`StudentClassRelationship` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`User` ADD FOREIGN KEY (`schoolId`) REFERENCES `KindergartenSchema`.`School` (`id`);

ALTER TABLE `KindergartenSchema`.`TeacherClassRelationship` ADD FOREIGN KEY (`teacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`TeacherClassRelationship` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`Relative` ADD FOREIGN KEY (`parentId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Student` ADD FOREIGN KEY (`parentId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Post` ADD FOREIGN KEY (`employeeId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`UserCommentPostRelationship` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`UserCommentPostRelationship` ADD FOREIGN KEY (`postId`) REFERENCES `KindergartenSchema`.`Post` (`id`);

ALTER TABLE `KindergartenSchema`.`UserReactPostRelationship` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`UserReactPostRelationship` ADD FOREIGN KEY (`postId`) REFERENCES `KindergartenSchema`.`Post` (`id`);

ALTER TABLE `KindergartenSchema`.`UserCanViewPostRelationship` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`UserCanViewPostRelationship` ADD FOREIGN KEY (`postId`) REFERENCES `KindergartenSchema`.`Post` (`id`);

ALTER TABLE `KindergartenSchema`.`LeaveLetter` ADD FOREIGN KEY (`updatedByTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`LeaveLetter` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`MedicineLetter` ADD FOREIGN KEY (`updatedByTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`MedicineLetter` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`Medicine` ADD FOREIGN KEY (`medicineLetterId`) REFERENCES `KindergartenSchema`.`MedicineLetter` (`id`);

ALTER TABLE `KindergartenSchema`.`MedicineUseTime` ADD FOREIGN KEY (`medicineLetterId`) REFERENCES `KindergartenSchema`.`MedicineLetter` (`id`);

ALTER TABLE `KindergartenSchema`.`PickupLetter` ADD FOREIGN KEY (`pickerRelativeId`) REFERENCES `KindergartenSchema`.`Relative` (`id`);

ALTER TABLE `KindergartenSchema`.`PickupLetter` ADD FOREIGN KEY (`updatedByTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`PickupLetter` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteLetter` ADD FOREIGN KEY (`updatedByTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteLetter` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteLetterReply` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteLetterReply` ADD FOREIGN KEY (`noteLetterId`) REFERENCES `KindergartenSchema`.`NoteLetter` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`checkInTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`checkOutTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`pickerRelativeId`) REFERENCES `KindergartenSchema`.`Relative` (`id`);

ALTER TABLE `KindergartenSchema`.`Timetable` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`Lecture` ADD FOREIGN KEY (`timetableId`) REFERENCES `KindergartenSchema`.`Timetable` (`id`);

ALTER TABLE `KindergartenSchema`.`MenuClassRelationship` ADD FOREIGN KEY (`menuId`) REFERENCES `KindergartenSchema`.`Menu` (`id`);

ALTER TABLE `KindergartenSchema`.`MenuClassRelationship` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`Meal` ADD FOREIGN KEY (`menuId`) REFERENCES `KindergartenSchema`.`Menu` (`id`);

ALTER TABLE `KindergartenSchema`.`Dish` ADD FOREIGN KEY (`mealId`) REFERENCES `KindergartenSchema`.`Meal` (`id`);

ALTER TABLE `KindergartenSchema`.`DailyRemark` ADD FOREIGN KEY (`teacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`DailyRemark` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`PeriodRemark` ADD FOREIGN KEY (`teacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`PeriodRemark` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`TuitionFee` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`AlbumStudentRelationship` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`AlbumStudentRelationship` ADD FOREIGN KEY (`albumId`) REFERENCES `KindergartenSchema`.`Album` (`id`);

ALTER TABLE `KindergartenSchema`.`AlbumPhoto` ADD FOREIGN KEY (`albumId`) REFERENCES `KindergartenSchema`.`Album` (`id`);

COMMIT;
