START TRANSACTION;

USE KindergartenSchema;

-- Common attributes
SET @avatar = 'https://nationaltoday.com/wp-content/uploads/2022/08/18-National-Welsh-Corgi-Day.jpg';

-- Insert schools
SET @sid1 = 'sid10000-0000-0000-0000-000000000000';
SET @sid2 = 'sid20000-0000-0000-0000-000000000000';
INSERT INTO School (id, name, address)
VALUES
    (@sid1, 'King\'s Landing', '107/2B Wall\'s Treet, Seven Kingdoms, Game Of Thrones'),
    (@sid2, 'Sơn Ca', '144 Trần Hưng Đạo, phường Mỹ Bình, thành phố Long Xuyên, tỉnh An Giang');

-- Insert Managers to school 1
SET @mgrid1 = 'mgrid100-0000-0000-0000-000000000000';
SET @mgrid2 = 'mgrid200-0000-0000-0000-000000000000';
SET @mgrid3 = 'mgrid300-0000-0000-0000-000000000000';
SET @mgrid4 = 'mgrid400-0000-0000-0000-000000000000';
INSERT INTO User (id, username, password, fullname, birthdate, email, phone, schoolId, userGroup, employeeRole)
VALUES
    (
        @mgrid1,
        'bach_principal',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Principal',
        '2001-04-14',
        'bach.principal@gmail.com',
        '0900000000',
        @sid1,
        'Manager',
        'Principal'
    ),
    (
        @mgrid2,
        'bach_viceprincipal',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách VicePrincipal',
        '2001-04-14',
        'bach.viceprincipal@gmail.com',
        '0900000003',
        @sid1,
        'Manager',
        'VicePrincipal'
    ),
    (
        @mgrid3,
        'bach_accountant1',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Accountant1',
        '2001-04-14',
        'bach.accountant1@gmail.com',
        '0900000002',
        @sid1,
        'Manager',
        'Accountant'
    ),
    (
        @mgrid4,
        'bach_accountant2',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Accountant2',
        '2001-04-14',
        'bach.accountant2@gmail.com',
        '0900000005',
        @sid1,
        'Manager',
        'Accountant'
    );

-- Insert Teachers to school 1
SET @tid1 = 'tid10000-0000-0000-0000-000000000000';
SET @tid2 = 'tid20000-0000-0000-0000-000000000000';
SET @tid3 = 'tid30000-0000-0000-0000-000000000000';
INSERT INTO User (id, username, password, fullname, birthdate, email, phone, schoolId, userGroup, employeeRole)
VALUES
    (
        @tid1,
        'bach_teacher1',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Teacher1',
        '2001-04-14',
        'bach.teacher1@gmail.com',
        '0900000004',
        @sid1,
        'Teacher',
        null
    ),
    (
        @tid2,
        'bach_teacher2',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Teacher2',
        '2001-04-14',
        'bach.teacher2@gmail.com',
        '0900000006',
        @sid1,
        'Teacher',
        null
    ),
    (
        @tid3,
        'bach_teacher3',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Teacher3',
        '2001-04-14',
        'bach.teacher3@gmail.com',
        '0900000007',
        @sid1,
        'Teacher',
        null
    )
;

-- Insert Classes to school 1
SET @clid1 = 'clid1000-0000-0000-0000-000000000000';
SET @clid2 = 'clid2000-0000-0000-0000-000000000000';
SET @clid3 = 'clid3000-0000-0000-0000-000000000000';
INSERT INTO Class (id, name, schoolYear, schoolId)
VALUES
    (@clid1, 'Stark A', 2022, @sid1),
    (@clid2, 'Stark A', 2021, @sid1),
    (@clid3, 'Stark B', 2022, @sid1)
;

-- Teacher - Class
INSERT INTO TeacherClassRelationship (teacherId, classId)
VALUES
    (@tid1, @clid1),
    (@tid2, @clid1),
    (@tid2, @clid2),
    (@tid3, @clid3)
;

-- INSERT Parent
SET @prid1 = 'prid1000-0000-0000-0000-000000000000'; -- normal parent 1 child
SET @prid2 = 'prid2000-0000-0000-0000-000000000000'; -- parent 2 children same class
SET @prid3 = 'prid3000-0000-0000-0000-000000000000'; -- parent 2 children different class
SET @prid4 = 'prid4000-0000-0000-0000-000000000000'; -- parent 2 children different school
INSERT INTO User (id, username, password, fullname, birthdate, email, phone, schoolId, userGroup, employeeRole)
VALUES
    (
        @prid1,
        'bach_parent1',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Parent1',
        '2001-04-14',
        'bach.parent1@gmail.com',
        '0900000008',
        null,
        'Parent',
        null
    ),
    (
        @prid2,
        'bach_parent2',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Parent2',
        '2001-04-14',
        'bach.parent2@gmail.com',
        '0900000009',
        null,
        'Parent',
        null
    ),
    (
        @prid3,
        'bach_parent3',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Parent3',
        '2001-04-14',
        'bach.parent3@gmail.com',
        '09000000010',
        null,
        'Parent',
        null
    ),
    (
        @prid4,
        'bach_parent4',
        '$argon2id$v=19$m=65536,t=3,p=4$vQuMUfM8K8n3Xzaa5+Ar/Q$9H9UvhkquRAfRtFN2PoD2lFZ8VT1gEQfqIwSUcmn5d0',
        'Lý Thanh Bách Parent4',
        '2001-04-14',
        'bach.parent4@gmail.com',
        '09000000011',
        null,
        'Parent',
        null
    )
;

-- INSERT Stdudent to school 1
SET @stid1 = 'stid1000-0000-0000-0000-000000000000';
SET @stid2 = 'stid2000-0000-0000-0000-000000000000';
SET @stid3 = 'stid3000-0000-0000-0000-000000000000';
SET @stid4 = 'stid4000-0000-0000-0000-000000000000';
SET @stid5 = 'stid5000-0000-0000-0000-000000000000';
SET @stid6 = 'stid6000-0000-0000-0000-000000000000';
INSERT INTO Student (id, fullname, birthdate, parentId, avatarUrl)
VALUES
    (@stid1, 'Lý Thanh Bách Student1', '2001-04-14', @prid1, @avatar),
    (@stid2, 'Lý Thanh Bách Student2', '2001-04-14', @prid2, @avatar),
    (@stid3, 'Lý Thanh Bách Student3', '2001-04-14', @prid2, @avatar),
    (@stid4, 'Lý Thanh Bách Student4', '2001-04-14', @prid3, @avatar),
    (@stid5, 'Lý Thanh Bách Student5', '2001-04-14', @prid3, @avatar),
    (@stid6, 'Lý Thanh Bách Student6', '2001-04-14', @prid4, @avatar)
;

-- Student - Class
INSERT INTO StudentClassRelationship (studentId, classId)
VALUES
    (@stid1, @clid1),
    (@stid2, @clid1),
    (@stid3, @clid1),
    (@stid4, @clid1),
    (@stid6, @clid1),
    (@stid1, @clid2),
    (@stid2, @clid2),
    (@stid4, @clid2),
    (@stid5, @clid3)
;

-- Relative
SET @rlid1 = 'rlid1000-0000-0000-0000-000000000000';
INSERT INTO Relative (id, fullname, phone, note, parentId, avatarUrl)
VALUES
    (@rlid1, 'Lý Thanh Bách Relative1', '0900000012', 'Chú tư của bé.', @prid3, @avatar)
;

-- LeaveLetter
INSERT INTO LeaveLetter (createdAt, status, fromTime, toTime, reason, updatedByTeacherId, studentId)
VALUES
    ('2023-01-01', 'Confirmed', '2023-01-02', '2023-01-02', 'Bé bị sốt', @tid1, @stid1),
    ('2023-01-03', 'Rejected', '2023-01-03', '2023-01-03', 'Bé đi du lịch với cả nhà', @tid1, @stid4),
    ('2023-01-13', 'NotConfirmed', '2023-01-16', '2023-01-16', "Du lich", null, @stid2)
;

-- Medicine
SET @medletid1 = 'medletid-1000-0000-0000-000000000000';
INSERT INTO MedicineLetter (id, createdAt, status, isUsed, note, updatedByTeacherId, studentId)
VALUES (@medletid1, '2023-01-03', 'Confirmed', true, 'Bé bị sốt', @tid2, @stid1);

INSERT INTO Medicine (name, amount, medicineLetterId, photoUrl)
VALUES ("Paracetamol", '1 vien', @medletid1, 'https://nhathuocanphuoc.vn/wp-content/uploads/2020/10/Tottri.webp');

INSERT INTO MedicineUseTime (time, medicineLetterId)
VALUES ('2023-01-04T09:00:00', @medletid1), ('2023-01-04T14:00:00', @medletid1);

-- PickupLetter
INSERT INTO PickupLetter (note, pickupTime, createdAt, status, pickerRelativeId, updatedByTeacherId, studentId)
VALUES ('Chiều nay mẹ bé bận, nhờ chú Tư rước bé', '2023-01-05T17:00:00', '2023-01-04',
        'Confirmed', @rlid1, @tid1, @stid4);

-- NoteLetter
SET @notletid1 = 'notletid-1000-0000-0000-000000000000';
INSERT INTO NoteLetter (id, createdAt, status, content, updatedByTeacherId, studentId)
VALUES (@notletid1, '2023-01-05', 'Confirmed', 'Hôm nay bé bị cảm nhẹ, nhờ cô để mắt tới bé nhiều hơn', @tid1, @stid1);

INSERT INTO NoteLetterReply (createdAt, content, userId, noteLetterId)
VALUES
    ('2023-01-05', 'Dạ vâng chị', @tid1, @notletid1),
    ('2023-01-05', 'Cảm ơn cô nhiều nhé', @prid3, @notletid1)
;

-- Post1
SET @postid1 = 'postid10-0000-0000-0000-000000000000';
INSERT INTO Post (id, createdAt, title, employeeId, content)
VALUES (@postid1, '2023-01-06', 'THÔNG BÁO: Nghỉ học tránh bão số 1000', @mgrid4, 'Dựa vào dự báo thời tiết của VTV, bão số 1000 dự kiến sẽ đổ bộ vào khu vực tỉnh chúng ta vào ngày thứ 2 tới." Để tránh những ảnh hưởng đáng tiếc xảy ra, nhà trường xin thông báo cho các phụ huynh về việc tạm ngưng việc học của bé vào T2 tới và sẽ tiếp tục việc học vào T3');

INSERT INTO UserReactPostRelationship (time, userId, postId)
VALUES ('2023-01-06T20:00:00', @mgrid1, @postid1);

INSERT INTO UserCommentPostRelationship (time, userId, postId, content)
VALUES ('2023-01-06T20:00:00', @prid1, @postid1, 'Nam mô a di đà phật');

INSERT INTO UserCanViewPostRelationship (userId, postId)
VALUES (@mgrid1, @postid1), (@mgrid2, @postid1), (@mgrid3, @postid1),
       (@mgrid4, @postid1), (@tid1, @postid1), (@tid2,@postid1), (@tid3, @postid1),
       (@prid1, @postid1), (@prid2, @postid1), (@prid3, @postid1), (@prid4, @postid1)
;

-- Post2
SET @postid2 = 'postid20-0000-0000-0000-000000000000';
INSERT INTO Post (id, createdAt, employeeId, title, content)
VALUES (@postid2, '2023-01-10', @tid2,'THÔNG BÁO: Hoạt động ngoại khóa tìm hiểu cấu tạo các loại hoa', 'Ngày mai lớp có hoạt động dã ngoại, nhờ quý phụ huynh cho các bé mặc đồ thoải mãi dễ hoạt động ngoài trời');

INSERT INTO UserReactPostRelationship (time, userId, postId)
VALUES ('2023-01-10T20:00:00', @mgrid1, @postid2);

INSERT INTO UserCanViewPostRelationship (userId, postId)
VALUES (@mgrid1, @postid2), (@mgrid2, @postid2), (@mgrid3, @postid2),
       (@mgrid4, @postid2), (@tid1, @postid2), (@tid2,@postid2), (@tid3, @postid2),
       (@prid2, @postid2), (@prid3, @postid2), (@prid4, @postid2)
;

-- Album
SET @albumid1 = 'albumid1-0000-0000-0000-000000000000';
INSERT INTO Album (id, title, description)
VALUES (@albumid1, 'Hoạt động ngoại khóa tìm hiểu cấu tạo các loại hoa',  'Hoạt động ngoại khóa tìm hiểu cấu tạo các loại hoa');

INSERT INTO AlbumStudentRelationship (studentId, albumId)
VALUES (@stid1, @albumid1), (@stid2, @albumid1), (@stid4, @albumid1), (@stid6, @albumid1);

INSERT INTO AlbumPhoto (albumId, photoUrl)
VALUES
    (@albumid1, 'https://hellobark.com/wp-content/uploads/madmax-corgi-2.jpg'),
    (@albumid1, 'https://zoipet.com/wp-content/uploads/2021/12/gia-cho-corgi.jpg'),
    (@albumid1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3EFJwoSJFW_VrtIzLDchg8P5VIPVLArjgxw&usqp=CAU')
;

-- Attendance T2 2023-01-02
INSERT INTO Attendance (date, checkinTime, checkoutTime, checkinPhotoUrl, checkoutPhotoUrl, status, studentId, teacherId)
VALUES
    ('2023-01-02', '2023-01-02T7:00:00', '2023-01-02T17:00:00', @avatar, @avatar, 'AbsenseWithPermission', @stid1, @tid1),
    ('2023-01-02', '2023-01-02T7:00:00', '2023-01-02T17:00:00', @avatar, @avatar, 'CheckedIn', @stid2, @tid1),
    ('2023-01-02', '2023-01-02T7:00:00', '2023-01-02T17:00:00', @avatar, @avatar, 'CheckedIn', @stid3, @tid2),
    ('2023-01-02', '2023-01-02T7:00:00', '2023-01-02T17:00:00', @avatar, @avatar, 'CheckedIn', @stid4, @tid1),
    ('2023-01-02', '2023-01-02T7:00:00', '2023-01-02T17:00:00', @avatar, @avatar, 'CheckedIn', @stid6, @tid2)
;

-- Attendance T5 2023-01-05
INSERT INTO Attendance
(date, checkinTime, checkoutTime, checkoutNote, checkinPhotoUrl, checkoutPhotoUrl, status, studentId, teacherId, pickerRelativeId)
VALUES
    ('2023-01-05', '2023-01-05T7:00:00', '2023-01-05T17:00:00', null, @avatar, @avatar, 'CheckedIn', @stid1, @tid1, null),
    ('2023-01-05', '2023-01-05T7:00:00', '2023-01-05T17:00:00', null, @avatar, @avatar, 'CheckedIn', @stid2, @tid1, null),
    ('2023-01-05', '2023-01-05T7:00:00', '2023-01-05T17:00:00', null, @avatar, @avatar, 'CheckedIn', @stid3, @tid2, null),
    ('2023-01-05', '2023-01-05T7:00:00', '2023-01-05T17:00:00', 'Bé được chú Tư rước', @avatar, @avatar, 'CheckedIn', @stid4, @tid1, @rlid1),
    ('2023-01-05', '2023-01-05T7:00:00', '2023-01-05T17:00:00', null, @avatar, @avatar, 'CheckedIn', @stid6, @tid2, null)
;

-- Attendance T4 2023-01-11
INSERT INTO Attendance
(date, checkinTime, checkoutTime, checkinPhotoUrl, checkoutPhotoUrl, status, studentId, teacherId)
VALUES
    ('2023-01-11', '2023-01-11T7:00:00', '2023-01-11T17:00:00', @avatar, @avatar, 'CheckedIn', @stid1, @tid1),
    ('2023-01-11', '2023-01-11T7:00:00', '2023-01-11T17:00:00', @avatar, @avatar, 'CheckedIn', @stid2, @tid1),
    ('2023-01-11', '2023-01-11T7:00:00', '2023-01-11T17:00:00', @avatar, @avatar, 'AbsenseWithoutPermission', @stid3, @tid2),
    ('2023-01-11', '2023-01-11T7:00:00', '2023-01-11T17:00:00', @avatar, @avatar, 'CheckedIn', @stid4, @tid1),
    ('2023-01-11', '2023-01-11T7:00:00', '2023-01-11T17:00:00', @avatar, @avatar, 'CheckedIn', @stid6, @tid2)
;

-- DailyRemark
INSERT INTO DailyRemark (date, activity, teacherId, studentId, content)
VALUES
    ('2023-01-02', 'Sleep', @tid1, @stid2, 'Nay bé Student2 không ngủ được cả buổi trưa. Mong gia đình theo dõi tình sức khỏe của bé thêm.'),
    ('2023-01-05', 'Eat', @tid2, @stid3, 'Bé Student3 ăn được 2/3 suất cơm, có biểu hiện biến ăn.')
;

-- Timetable
SET @ttabid1 = 'ttabid10-0000-0000-0000-000000000000';
INSERT INTO Timetable (id, startDate, weekNumber, fileUrl, classId)
VALUES (@ttabid1, '2023-01-02', 1, 'week1.csv', @clid1);

INSERT INTO Lecture (startTime, endTime, timetableId, name)
VALUES
    ('2023-01-02T08:00:00', '2023-01-02T09:00:00', @ttabid1, 'Tập  thể dục buổi sáng'),
    ('2023-01-02T09:00:00', '2023-01-02T11:00:00', @ttabid1, 'Học làm người'),
    ('2023-01-02T11:00:00', '2023-01-02T12:00:00', @ttabid1, 'Ăn trưa'),
    ('2023-01-02T12:00:00', '2023-01-02T14:00:00', @ttabid1, 'Ngủ trưa'),
    ('2023-01-02T14:00:00', '2023-01-02T17:00:00', @ttabid1, 'Kỹ năng sống: làm con nít sao cho chuẩn'),
    ('2023-01-03T07:00:00', '2023-01-03T12:00:00', @ttabid1, 'Hoạt động buổi sáng'),
    ('2023-01-03T13:00:00', '2023-01-03T17:00:00', @ttabid1, 'Thử thách sinh tồn: thử thách 4 tiếng làm con nít'),
    ('2023-01-04T07:00:00', '2023-01-04T12:00:00', @ttabid1, 'Hoạt động buổi sáng'),
    ('2023-01-04T13:00:00', '2023-01-04T17:00:00', @ttabid1, 'Thử thách sinh tồn: thử thách 4 tiếng làm con nít'),
    ('2023-01-05T07:00:00', '2023-01-05T12:00:00', @ttabid1, 'Hoạt động buổi sáng'),
    ('2023-01-05T13:00:00', '2023-01-05T17:00:00', @ttabid1, 'Thử thách sinh tồn: thử thách 4 tiếng làm con nít'),
    ('2023-01-06T07:00:00', '2023-01-06T12:00:00', @ttabid1, 'Hoạt động buổi sáng'),
    ('2023-01-06T13:00:00', '2023-01-06T17:00:00', @ttabid1, 'Thử thách sinh tồn: thử thách 4 tiếng làm con nít')
;

-- Menu
SET @menuid1 = 'menuid10-0000-0000-0000-000000000000';
INSERT INTO Menu (id, date)
VALUES (@menuid1, '2023-01-03');

SET @mealid1 = 'mealid10-0000-0000-0000-000000000000';
SET @mealid2 = 'mealid20-0000-0000-0000-000000000000';
SET @mealid3 = 'mealid30-0000-0000-0000-000000000000';
INSERT INTO Meal (id, time, menuId)
VALUES
    (@mealid1, '2023-01-06T07:00:00', @menuid1),
    (@mealid2, '2023-01-06T12:00:00', @menuid1),
    (@mealid3, '2023-01-06T15:00:00', @menuid1)
;

INSERT INTO Dish (name, mealId)
VALUES
    ('Xôi măn', @mealid1),
    ('Cháo cá mập trắng', @mealid2),
    ('nước cam', @mealid2),
    ('trứng khủng long chiên ốp la', @mealid2),
    ('Nem nướng nha trang', @mealid3),
    ('sinh tố nước lọc không đường', @mealid3)
;

INSERT INTO MenuClassRelationship (menuId, classId)
VALUES (@menuid1, @clid1), (@menuid1, @clid3);


-- PeriodRemark
INSERT INTO PeriodRemark (period, startTime, endTime, teacherId, studentId, content)
VALUES
    ('Week', '2023-01-09', '2023-01-13', @tid1, @stid1, 'Bé chăm ngoan, nhưng còn hơi tự kỉ, mong gia đình cho bé thêm tình thương'),
    ('Week', '2023-01-09', '2023-01-13', @tid1, @stid2, 'Bé chăm ngoan'),
    ('Week', '2023-01-09', '2023-01-13', @tid1, @stid3, 'Bé chăm ngoan'),
    ('Week', '2023-01-09', '2023-01-13', @tid2, @stid4, 'Bé chăm ngoan'),
    ('Week', '2023-01-09', '2023-01-13', @tid2, @stid6, 'Bé chăm ngoan')
;

-- TuitionFee
INSERT INTO TuitionFee (status, startTime, endTime, billUrl, amount, studentId)
VALUES
    ('Paid', '2022-12-01', '2023-01-01', 'bill.csv', '100000000', @stid1),
    ('UnPaid', '2022-01-01', '2023-02-01', 'bill.csv', '100000000', @stid1)
;

COMMIT;
