DROP SCHEMA IF EXISTS `KindergartenSchema`;

START TRANSACTION;

CREATE SCHEMA `KindergartenSchema`;

CREATE TABLE `KindergartenSchema`.`School` (
                                               `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                               `name` varchar(255),
                                               `address` varchar(255)
);

CREATE TABLE `KindergartenSchema`.`Class` (
                                              `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                              `name` varchar(255),
                                              `schoolYear` int,
                                              `schoolId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`StudentClassRelationship` (
                                                                 `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                                 `studentId` binary(16),
                                                                 `classId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`User` (
                                             `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                             `username` varchar(255) UNIQUE NOT NULL,
                                             `password` varchar(255),
                                             `fullname` varchar(255),
                                             `birthdate` datetime,
                                             `email` varchar(255) UNIQUE,
                                             `phone` bigint UNIQUE NOT NULL,
                                             `schoolId` binary(16),
                                             `employeeRole` varchar(255),
                                             `userGroup` ENUM ('Manager', 'Teacher', 'Parent')
);

CREATE TABLE `KindergartenSchema`.`TeacherClassRelationship` (
                                                                 `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                                 `teacherId` binary(16),
                                                                 `classId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Relative` (
                                                 `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                 `fullname` varchar(255),
                                                 `phone` bigint,
                                                 `avatarUrl` varchar(255),
                                                 `note` varchar(255),
                                                 `parentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Student` (
                                                `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                `fullname` varchar(255),
                                                `avatarUrl` varchar(255),
                                                `birthdate` datetime,
                                                `parentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Post` (
                                             `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                             `createdAt` datetime,
                                             `title` varchar(255),
                                             `content` text,
                                             `employeeId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`UserCommentPostRelationship` (
                                                                    `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                                    `content` varchar(255),
                                                                    `time` datetime,
                                                                    `userId` binary(16),
                                                                    `postId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`UserReactPostRelationship` (
                                                                  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                                  `time` datetime,
                                                                  `userId` binary(16),
                                                                  `postId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`UserCanViewPostRelationship` (
                                                                    `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                                    `userId` binary(16),
                                                                    `postId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`LeaveLetter` (
                                                    `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                    `createdAt` datetime,
                                                    `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
                                                    `fromTime` datetime,
                                                    `toTime` datetime,
                                                    `reason` text,
                                                    `updatedByTeacherId` binary(16),
                                                    `studentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`MedicineLetter` (
                                                       `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                       `createdAt` datetime,
                                                       `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
                                                       `isUsed` bool,
                                                       `note` text,
                                                       `updatedByTeacherId` binary(16),
                                                       `studentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Medicine` (
                                                 `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                 `name` varchar(255),
                                                 `photoUrl` text,
                                                 `amount` varchar(255),
                                                 `medicineLetterId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`MedicineUseTime` (
                                                        `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                        `time` datetime,
                                                        `medicineLetterId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`PickupLetter` (
                                                     `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                     `note` varchar(255),
                                                     `pickupTime` datetime,
                                                     `createdAt` datetime,
                                                     `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
                                                     `pickerRelativeId` binary(16),
                                                     `updatedByTeacherId` binary(16),
                                                     `studentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`NoteLetter` (
                                                   `id` binary(16) PRIMARY KEY,
                                                   `createdAt` datetime,
                                                   `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
                                                   `content` text,
                                                   `updatedByTeacherId` binary(16),
                                                   `studentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`NoteLetterReply` (
                                                        `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                        `createdAt` datetime,
                                                        `content` text,
                                                        `userId` binary(16),
                                                        `noteLetterId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Attendance` (
                                                   `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                   `date` datetime,
                                                   `checkinTime` datetime,
                                                   `checkoutTime` datetime,
                                                   `checkinNote` varchar(255),
                                                   `checkoutNote` varchar(255),
                                                   `checkinPhotoUrl` varchar(255),
                                                   `checkoutPhotoUrl` varchar(255),
                                                   `status` ENUM ('CheckedIn', 'NotCheckedIn', 'AbsenseWithPermission', 'AbsenseWithoutPermission'),
                                                   `studentId` binary(16),
                                                   `teacherId` binary(16),
                                                   `pickerRelativeId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Timetable` (
                                                  `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                  `startDate` datetime,
                                                  `weekNumber` int,
                                                  `fileUrl` varchar(255),
                                                  `classId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Lecture` (
                                                `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                `startTime` datetime,
                                                `endTime` datetime,
                                                `name` varchar(255),
                                                `timetableId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Menu` (
                                             `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                             `date` datetime
);

CREATE TABLE `KindergartenSchema`.`MenuClassRelationship` (
                                                              `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                              `menuId` binary(16),
                                                              `classId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Meal` (
                                             `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                             `time` datetime,
                                             `menuId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Dish` (
                                             `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                             `name` varchar(255),
                                             `mealId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`DailyRemark` (
                                                    `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                    `date` datetime,
                                                    `activity` ENUM ('Study', 'Eat', 'Sleep', 'Wc', 'Other'),
                                                    `content` text,
                                                    `teacherId` binary(16),
                                                    `studentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`PeriodRemark` (
                                                     `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                     `period` ENUM ('Week', 'Month', 'Quarter', 'Year'),
                                                     `content` text,
                                                     `startTime` datetime,
                                                     `endTime` datetime,
                                                     `teacherId` binary(16),
                                                     `studentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`TuitionFee` (
                                                   `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                   `status` ENUM ('Paid', 'Unpaid'),
                                                   `startTime` datetime,
                                                   `endTime` datetime,
                                                   `billUrl` varchar(255),
                                                   `amount` bigint,
                                                   `studentId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`Album` (
                                              `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                              `title` varchar(255),
                                              `description` text
);

CREATE TABLE `KindergartenSchema`.`AlbumStudentRelationship` (
                                                                 `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                                 `studentId` binary(16),
                                                                 `albumId` binary(16)
);

CREATE TABLE `KindergartenSchema`.`AlbumPhoto` (
                                                   `id` binary(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                                                   `photoUrl` text,
                                                   `albumId` binary(16)
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

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`teacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

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