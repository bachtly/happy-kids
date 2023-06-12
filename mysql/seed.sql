START TRANSACTION;

USE KindergartenSchema;

-- password = 'password123'
SET @password_hashed = '$2a$10$1WrZyVUDl8mIKoImZ1O3vuOZwzVANa.5cicTr8LW5LUGYehFg4trS';

SET @portalAdminId1 = 'admin100-0000-0000-0000-000000000000';
INSERT INTO User (id, username, password, fullname, email, userGroup)
VALUES
    (
        @portalAdminId1,
        "happykids_admin@gmail.com",
        @password_hashed,
        "Happy Kids Admin",
        "happykids_admin@gmail.com",
        "Admin"
    );

-- Common attributes
SET @avatar = './seed/avatar';
SET @multi_avatar = concat('\["', @avatar, '", "', @avatar, '"', '\]');


-- Insert SchoolTerm 
SET @sy1t1 = 'sy1t1000-0000-0000-0000-000000000000';
SET @sy1t2 = 'sy1t2000-0000-0000-0000-000000000000';
SET @sy2t1 = 'sy2t1000-0000-0000-0000-000000000000';
SET @sy2t2 = 'sy2t2000-0000-0000-0000-000000000000';
SET @sy3t1 = 'sy3t1000-0000-0000-0000-000000000000';
SET @sy3t2 = 'sy3t2000-0000-0000-0000-000000000000';
INSERT INTO SchoolTerm (id, year, term)
VALUES
    (@sy1t1, 2022, 1),
    (@sy1t2, 2022, 2),
    (@sy2t1, 2021, 1),
    (@sy2t2, 2021, 2)
;

-- Insert schools
SET @sid1 = 'sid10000-0000-0000-0000-000000000000';
SET @sid2 = 'sid20000-0000-0000-0000-000000000000';
INSERT INTO School (id, name, address, schoolTermId)
VALUES
    (@sid1, 'Mẫu giáo Vàng Anh', '107/2B Wall Street, Seven Kingdoms, Game Of Thrones', @sy1t2),
    (@sid2, 'Sơn Ca', '144 Trần Hưng Đạo, phường Mỹ Bình, thành phố Long Xuyên, tỉnh An Giang', @sy1t2);


-- Insert Managers to school 1
SET @mgrid1 = 'mgrid100-0000-0000-0000-000000000000';
SET @mgrid2 = 'mgrid200-0000-0000-0000-000000000000';
SET @mgrid3 = 'mgrid300-0000-0000-0000-000000000000';
SET @mgrid4 = 'mgrid400-0000-0000-0000-000000000000';
INSERT INTO User (id, username, password, fullname, birthdate, email, phone, schoolId, userGroup, employeeRole, avatarUrl)
VALUES
    (
        @mgrid1,
        'bach_principal',
        @password_hashed,
        'Lý Thanh Bách Principal',
        '2001-04-14',
        'bach.principal@gmail.com',
        '0900000000',
        @sid1,
        'Employee',
        'Manager',
        @avatar
    ),
    (
        @mgrid2,
        'bach_viceprincipal',
        @password_hashed,
        'Nguyễn Phục Hưng (Hiệu trưởng)',
        '2001-04-14',
        'bach.viceprincipal@gmail.com',
        '0900000003',
        @sid1,
        'Employee',
        'Manager',
        @avatar
    ),
    (
        @mgrid3,
        'bach_accountant1',
        @password_hashed,
        'Trần Thủ Thư (Kế Toán)',
        '2001-04-14',
        'bach.accountant1@gmail.com',
        '0900000002',
        @sid1,
        'Employee',
        'Manager',
        @avatar
    ),
    (
        @mgrid4,
        'bach_accountant2',
        @password_hashed,
        'Lê Thủ Thư (Kế Toán)',
        '2001-04-14',
        'bach.accountant2@gmail.com',
        '0900000005',
        @sid1,
        'Employee',
        'Manager',
        @avatar
    );

-- Insert Teachers to school 1
SET @tid1 = 'tid10000-0000-0000-0000-000000000000';
SET @tid2 = 'tid20000-0000-0000-0000-000000000000';
SET @tid3 = 'tid30000-0000-0000-0000-000000000000';

INSERT INTO User (id, username, password, fullname, birthdate, email, phone, schoolId, userGroup, employeeRole, avatarUrl)
VALUES
    (
        @tid1,
        'bach_teacher1',
        @password_hashed,
        'Nguyễn Anh Thư',
        '2001-04-14',
        'bach.teacher1@gmail.com',
        '0900000004',
        @sid1,
        'Employee',
        'Teacher',
        @avatar
    ),
    (
        @tid2,
        'bach_teacher2',
        @password_hashed,
        'Nguyễn Hải Yến',
        '2001-04-14',
        'bach.teacher2@gmail.com',
        '0900000006',
        @sid1,
        'Employee',
        'Teacher',
        @avatar
    ),
    (
        @tid3,
        'bach_teacher3',
        @password_hashed,
        'Nguyễn Quỳnh Nga',
        '2001-04-14',
        'bach.teacher3@gmail.com',
        '0900000007',
        @sid1,
        'Employee',
        'Teacher',
        @avatar
    )
;

-- Insert Classes to school 1
SET @clid1 = 'clid1000-0000-0000-0000-000000000000';
SET @clid2 = 'clid2000-0000-0000-0000-000000000000';
SET @clid3 = 'clid3000-0000-0000-0000-000000000000';
INSERT INTO Class (id, schoolYear, name, schoolId)
VALUES
    (@clid1, 2022, 'Lá A', @sid1),
    (@clid2, 2021, 'Chồi A', @sid1),
    (@clid3, 2021, 'Chồi B', @sid1)
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
INSERT INTO User (id, username, password, fullname, birthdate, email, phone, schoolId, userGroup, employeeRole, avatarUrl)
VALUES
    (
        @prid1,
        'bach_parent1',
        @password_hashed,
        'Trần Mạnh Hùng',
        '2001-04-14',
        'bach.parent1@gmail.com',
        '0900000008',
        null,
        'Parent',
        null,
        @avatar
    ),
    (
        @prid2,
        'bach_parent2',
        @password_hashed,
        'Trần Đăng Khoa',
        '2001-04-14',
        'bach.parent2@gmail.com',
        '0900000009',
        null,
        'Parent',
        null,
        @avatar
    ),
    (
        @prid3,
        'bach_parent3',
        @password_hashed,
        'Trần Thành Đạt',
        '2001-04-14',
        'bach.parent3@gmail.com',
        '09000000010',
        null,
        'Parent',
        null,
        @avatar
    ),
    (
        @prid4,
        'bach_parent4',
        @password_hashed,
        'Lê Trọng Nghĩa',
        '2001-04-14',
        'bach.parent4@gmail.com',
        '09000000011',
        null,
        'Parent',
        null,
        @avatar
    )
;

-- INSERT Stdudent to school 1
SET @stid1 = 'stid1000-0000-0000-0000-000000000000';
SET @stid2 = 'stid2000-0000-0000-0000-000000000000';
SET @stid3 = 'stid3000-0000-0000-0000-000000000000';
SET @stid4 = 'stid4000-0000-0000-0000-000000000000';
SET @stid5 = 'stid5000-0000-0000-0000-000000000000';
SET @stid6 = 'stid6000-0000-0000-0000-000000000000';
INSERT INTO Student (id, fullname, birthdate, parentId, avatarUrl, height, weight)
VALUES
    (@stid1, 'Trần Thiên Ân', '2001-03-24', @prid1, './bothui/bothui1.jpeg','100.0','27.5'),
    (@stid2, 'Trần Gia Huy', '2001-01-12', @prid2, './bothui/bothui2.jpeg','105.5','23.5'),
    (@stid3, 'Trần Gia Bảo', '2001-05-13', @prid2, './bothui/bothui3.jpeg','98.0','20.5'),
    (@stid4, 'Trần Đăng Khoa', '2001-02-09', @prid3, './bothui/bothui5.jpeg','110.0','21.3'),
    (@stid5, 'Trần Minh Quân', '2001-07-07', @prid3, './bothui/bothui2.jpeg','110.5','20.5'),
    (@stid6, 'Lê Anh Quân', '2001-04-01', @prid4, './bothui/bothui1.jpeg','102.0','27.5')
;

-- Student - Class
INSERT INTO StudentClassRelationship (studentId, classId)
VALUES
    (@stid1, @clid1),
    (@stid2, @clid1),
    (@stid3, @clid1),
    (@stid4, @clid1),
    (@stid6, @clid1),
    (@stid5, @clid3),
    (@stid1, @clid2)
;

-- Relative
SET @rlid1 = 'rlid1000-0000-0000-0000-000000000000';
SET @rlid2 = 'rlid2000-0000-0000-0000-000000000000';
SET @rlid3 = 'rlid3000-0000-0000-0000-000000000000';
INSERT INTO Relative (id, fullname, phone, note, parentId, avatarUrl)
VALUES
    (@rlid1, 'Trần Mạnh Tư', '0900000012', 'Chú tư của bé.', @prid3, @avatar),
	(@rlid2, 'Trần Mạnh Ba', '0900000100', 'Chú ba của bé.', @prid1, @avatar),
	(@rlid3, 'Trần Mạnh Năm', '0900000200', 'Chú năm của bé.', @prid1, @avatar)
;

-- LeaveLetter
SET @leaveletid1 = uuid();
SET @leaveletid2 = uuid();
SET @leaveletid3 = uuid();
INSERT INTO LeaveLetter (id, createdAt, status, startDate, endDate, reason, updatedByTeacherId, studentId, createdByParentId, schoolTermId)
VALUES
    (@leaveletid1, '2023-06-05', 'Confirmed', '2023-06-08', '2023-06-13', 'Bé bị sốt', @tid1, @stid1, @prid1, @sy1t1),
    (@leaveletid3, '2023-06-10', 'Rejected', '2023-06-14', '2023-06-15', 'Bé đi du lịch với cả nhà', @tid1, @stid4, @prid1, @sy1t2)
;

INSERT INTO LeaveLetterPhoto (photo, leaveLetterId)
VALUES ('./seed/leave/fever', @leaveletid1);

-- Medicine
SET @medletid1 = uuid();
SET @medphotoc = './seed/medicine/vitaminc';
SET @medphotodc = './seed/medicine/dauca';
INSERT INTO MedicineLetter (id, startDate, endDate, createdAt, status, note, updatedByTeacherId, createdByParentId, studentId, schoolTermId)
VALUES (@medletid1,'2023-06-13','2023-06-15', '2023-06-01', 'Confirmed', 'Bé bị sốt', @tid2, @prid1, @stid1, @sy1t1);

SET @medid1 = uuid();
SET @medid2 = uuid();
INSERT INTO Medicine (id, name, amount, medicineLetterId, photo, time)
VALUES
    (@medid1, "Vitamin C", '2 vien', @medletid1, @medphotoc , 450),
    (@medid2, "Dầu cá", '3 vien', @medletid1, @medphotodc , 450)
;

INSERT INTO MedicineLetterUseDiary (id, status, date, note, medicineLetterId)
VALUES (@medid1,"Used", "2023-06-13", 'Bé uống hết thuốc', @medletid1);

-- PickupLetter
SET @pickupid1 = 'pickupid-1000-0000-0000-000000000000';
INSERT INTO PickupLetter (id, note, pickupTime, createdAt, status, pickerRelativeId, updatedByTeacherId, studentId, schoolTermId)
VALUES (@pickupid1, 'Chiều nay mẹ bé bận, nhờ chú Tư rước bé', '2023-06-12T17:00:00', '2023-06-04',
        'Confirmed', @rlid1, @tid1, @stid4, @sy1t1);

INSERT INTO PickupLetter (note, pickupTime, createdAt, status, pickerRelativeId, updatedByTeacherId, studentId, schoolTermId)
VALUES
    ('Chiều nay mẹ bé bận', '2023-06-06T17:00:00', '2023-06-05', 'Confirmed', @rlid2, @tid1, @stid1, @sy1t1),
    ('Chiều nay mẹ bé bận', '2023-06-07T17:00:00', '2023-06-06', 'Confirmed', @rlid2, @tid1, @stid1, @sy1t1),
    ('Chiều nay mẹ bé bận', '2023-06-08T17:00:00', '2023-06-07', 'Confirmed', @rlid2, @tid1, @stid1, @sy1t2),
    ('Chiều nay mẹ bé bận', '2023-06-09T17:00:00', '2023-06-08', 'Confirmed', @rlid2, @tid1, @stid1, @sy1t2),
    ('Chiều nay mẹ bé bận', '2023-06-10T17:00:00', '2023-06-09', 'Confirmed', @rlid2, @tid1, @stid1, @sy1t2)
;
-- NoteLetter
SET @notletid1 = 'notletid-1000-0000-0000-000000000000';
SET @notletphotos = '{"photoPaths": ["./seed/note/canmongtay"]}';
INSERT INTO NoteThread (id, createdAt, startDate, endDate, status, content, createdByParentId, studentId, photos, schoolTermId)
VALUES (@notletid1, '2023-06-14', '2023-06-15', '2023-06-16', 'Confirmed', 'Bé hay cắn móng tay, cô chú ý giúp', @prid1, @stid1, @notletphotos, @sy1t1);

INSERT INTO NoteMessage (createdAt, content, userId, noteThreadId)
VALUES
    ('2023-06-14T08:00:00', 'Dạ vâng chị', @tid1, @notletid1),
    ('2023-06-14T08:03:00', 'Cảm ơn cô nhiều nhé', @prid1, @notletid1)
;

-- Post1
SET @postid1 = 'postid10-0000-0000-0000-000000000000';
INSERT INTO Post (id, createdAt, userId, photos, content, schoolTermId)
VALUES
	(@postid1, '2023-06-06', @mgrid4, @multi_avatar,
		'THÔNG BÁO: Nghỉ học tránh bão số 1000\nDựa vào dự báo thời tiết của VTV, bão số 1000 dự kiến sẽ đổ bộ vào khu vực tỉnh chúng ta vào ngày thứ 2 tới." Để tránh những ảnh hưởng đáng tiếc xảy ra, nhà trường xin thông báo cho các phụ huynh về việc tạm ngưng việc học của bé vào T2 tới và sẽ tiếp tục việc học vào T3', @sy1t1);

INSERT INTO PostReaction (time, reaction, userId, postId)
VALUES
	('2023-06-06T20:00:00', 'Like', @mgrid1, @postid1)
;

INSERT INTO PostComment (time, userId, postId, content)
VALUES
	('2023-06-06T20:00:00', @prid1, @postid1, 'Nam mô a di đà phật'),
    ('2023-06-07T21:00:00', @prid1, @postid1, 'Cảm ơn trường đã thông báo sớm (1). Gia đình em cũng có ý định đi du lịch từ sớm. Sẵn có dịp tốt thế này thì đi luôn cho tiện, hihi.'),
    ('2023-06-08T22:00:00', @prid1, @postid1, 'Cám ơn trường đã thông báo sớm (2). Gia đình em cũng có ý định đi du lịch từ sớm. Sẵn có dịp tốt thế này thì đi luôn cho tiện, hihi.'),
    ('2023-06-09T23:00:00', @prid1, @postid1, 'Cám ơn trường đã thông báo sớm (3). Gia đình em cũng có ý định đi du lịch từ sớm. Sẵn có dịp tốt thế này thì đi luôn cho tiện, hihi.'),
    ('2023-06-10T23:01:00', @prid1, @postid1, 'Cám ơn trường đã thông báo sớm (4). Gia đình em cũng có ý định đi du lịch từ sớm. Sẵn có dịp tốt thế này thì đi luôn cho tiện, hihi.'),
    ('2023-06-11T23:02:00', @prid1, @postid1, 'Cám ơn trường đã thông báo sớm (5). Gia đình em cũng có ý định đi du lịch từ sớm. Sẵn có dịp tốt thế này thì đi luôn cho tiện, hihi.')
;

INSERT INTO UserCanViewPost (userId, postId)
VALUES (@mgrid1, @postid1), (@mgrid2, @postid1), (@mgrid3, @postid1),
       (@mgrid4, @postid1), (@tid1, @postid1), (@tid2,@postid1), (@tid3, @postid1),
       (@prid1, @postid1), (@prid2, @postid1), (@prid3, @postid1), (@prid4, @postid1)
;

-- Post2
SET @postid2 = 'postid20-0000-0000-0000-000000000000';
INSERT INTO Post (id, createdAt, userId, photos, content, schoolTermId)
VALUES
	(@postid2, '2023-06-10', @tid2, @multi_avatar,
		'THÔNG BÁO: Hoạt động ngoại khóa tìm hiểu cấu tạo các loại hoa\nNgày mai lớp có hoạt động dã ngoại, nhờ quý phụ huynh cho các bé mặc đồ thoải mãi dễ hoạt động ngoài trời', @sy1t1);

INSERT INTO PostReaction (time, reaction, userId, postId)
VALUES ('2023-06-10T20:00:00', 'Like', @mgrid1, @postid2);

INSERT INTO UserCanViewPost (userId, postId)
VALUES (@mgrid1, @postid2), (@mgrid2, @postid2), (@mgrid3, @postid2),
       (@mgrid4, @postid2), (@tid1, @postid2), (@tid2,@postid2), (@tid3, @postid2),
       (@prid2, @postid2), (@prid3, @postid2), (@prid4, @postid2)
;

-- Posts
SET @postid3 = 'postid30-0000-0000-0000-000000000000';
SET @postid4 = 'postid40-0000-0000-0000-000000000000';
SET @postid5 = 'postid50-0000-0000-0000-000000000000';
SET @postid6 = 'postid60-0000-0000-0000-000000000000';
INSERT INTO Post (id, createdAt, userId, photos, content, schoolTermId)
VALUES
	(@postid3, '2023-06-11', @tid2, @multi_avatar,
		'THÔNG BÁO: Hoạt động ngoại khóa tìm hiểu cấu tạo các loại hoa\nNgày mai lớp có hoạt động dã ngoại, nhờ quý phụ huynh cho các bé mặc đồ thoải mãi dễ hoạt động ngoài trời', @sy1t1),
	(@postid4, '2023-06-11', @tid2, @multi_avatar,
		'THÔNG BÁO: Hoạt động ngoại khóa tìm hiểu cấu tạo các loại hoa\nNgày mai lớp có hoạt động dã ngoại, nhờ quý phụ huynh cho các bé mặc đồ thoải mãi dễ hoạt động ngoài trời', @sy1t1),
	(@postid5, '2023-06-11', @tid2, @multi_avatar,
		'THÔNG BÁO: Hoạt động ngoại khóa tìm hiểu cấu tạo các loại hoa\nNgày mai lớp có hoạt động dã ngoại, nhờ quý phụ huynh cho các bé mặc đồ thoải mãi dễ hoạt động ngoài trời', @sy1t1),
	(@postid6, '2023-06-11', @tid2, @multi_avatar,
		'THÔNG BÁO: Hoạt động ngoại khóa tìm hiểu cấu tạo các loại hoa\nNgày mai lớp có hoạt động dã ngoại, nhờ quý phụ huynh cho các bé mặc đồ thoải mãi dễ hoạt động ngoài trời', @sy1t2)
;

-- Album
SET @albumid1 = 'albumid1-0000-0000-0000-000000000000';
Set @album1photo='["./seed/album/park1","./seed/album/park2","./seed/album/park3","./seed/album/park4","./seed/album/park5","./seed/album/park6","./seed/album/park7","./seed/album/park8"]';
INSERT INTO Album (id, title, description, photos, createdAt, classId, eventDate, teacherId, schoolTermId)
VALUES (@albumid1, 'Các bé đi chơi công viên', 'Hoạt động ngoại khóa bao gồm chơi thể thao, vui chơi giải trí ở công viên Lê Văn Tám', @album1photo, '2023-01-02T17:00:00', @clid1, '2023-01-02', @tid1, @sy1t1);

SET @topicid1 = 'topicid1-0000-0000-0000-000000000000';
SET @topicid2 = 'topicid2-0000-0000-0000-000000000000';
SET @topicid3 = 'topicid3-0000-0000-0000-000000000000';
INSERT INTO AlbumTopic (id, topic)
VALUES
    (@topicid1, 'Dã ngoại'),
    (@topicid2, 'Thể dục - thể thao'),
    (@topicid3, 'Công viên')
;

INSERT INTO AlbumTopicRelationship(albumId, topicId)
VALUES
    (@albumid1, @topicid1),
    (@albumid1, @topicid2),
    (@albumid1, @topicid3)
;

-- Attendance T2 2023-06-05
INSERT INTO Attendance (date, checkinTime, checkoutTime, checkinPhotos, checkoutPhotos, status, studentId, checkinTeacherId, checkoutTeacherId, thermo, schoolTermId)
VALUES
    ('2023-06-05', '2023-06-05T7:00:00', '2023-06-05T17:00:00', '[]', '[]', 'AbsenseWithPermission', @stid1, @tid1, @tid1, 36.5, @sy1t1),
    ('2023-06-05', '2023-06-05T7:00:00', '2023-06-05T17:00:00', @multi_avatar, @multi_avatar, 'CheckedOut', @stid2, @tid1, @tid2, 36.5, @sy1t1),
    ('2023-06-05', '2023-06-05T7:00:00', '2023-06-05T17:00:00', @multi_avatar, @multi_avatar, 'CheckedOut', @stid3, @tid2, @tid2, 36.5, @sy1t1),
    ('2023-06-05', '2023-06-05T7:00:00', '2023-06-05T17:00:00', @multi_avatar, @multi_avatar, 'CheckedOut', @stid4, @tid1, @tid1, 36.5, @sy1t1),
    ('2023-06-05', '2023-06-05T7:00:00', '2023-06-05T17:00:00', @multi_avatar, @multi_avatar, 'CheckedOut', @stid6, @tid2, @tid2, 36.5, @sy1t1)
;

-- Attendance T5 2023-06-08
INSERT INTO Attendance
(date, checkinTime, checkoutTime, checkoutNote, checkinPhotos, checkoutPhotos, status, studentId, checkinTeacherId, checkoutTeacherId, pickerRelativeId, thermo, schoolTermId)
VALUES
    ('2023-06-08', '2023-06-08T7:00:00', '2023-06-08T17:00:00', null, '["./bothui/bothui1.jpeg"]', '["./bothui/bothui5.jpeg"]', 'CheckedOut', @stid1, @tid1, @tid1, null, 36.5, @sy1t1),
    ('2023-06-08', '2023-06-08T7:00:00', '2023-06-08T17:00:00', null, @multi_avatar, @multi_avatar, 'CheckedOut', @stid2, @tid1, @tid1, null, 36.5, @sy1t1),
    ('2023-06-08', '2023-06-08T7:00:00', '2023-06-08T17:00:00', null, @multi_avatar, @multi_avatar, 'CheckedOut', @stid3, @tid2, @tid2, null, 36.5, @sy1t1),
    ('2023-06-08', '2023-06-08T7:00:00', '2023-06-08T17:00:00', 'Bé được chú Tư rước', @multi_avatar, @multi_avatar, 'CheckedOut', @stid4, @tid1, @tid1, @rlid1, 36.5, @sy1t1),
    ('2023-06-08', '2023-06-08T7:00:00', '2023-06-08T17:00:00', null, @multi_avatar, @multi_avatar, 'CheckedOut', @stid6, @tid2, @tid2, null, 36.5, @sy1t1)
;

-- Attendance T4 2023-06-07
INSERT INTO Attendance
(date, checkinTime, checkoutTime, checkinPhotos, checkoutPhotos, status, studentId, checkinTeacherId, checkoutTeacherId, thermo, schoolTermId)
VALUES
    ('2023-06-07', '2023-06-07T7:00:00', '2023-06-07T17:00:00', '["./bothui/bothui3.jpeg"]', '["./bothui/bothui2.jpeg"]', 'CheckedOut', @stid1, @tid1, @tid1, 36.5, @sy1t2),
    ('2023-06-07', '2023-06-07T7:00:00', '2023-06-07T17:00:00', @multi_avatar, @multi_avatar, 'CheckedOut', @stid2, @tid1, @tid1, 36.5, @sy1t2),
    ('2023-06-07', '2023-06-07T7:00:00', '2023-06-07T17:00:00', @multi_avatar, @multi_avatar, 'AbsenseWithoutPermission', @stid3, @tid2, @tid2, 36.5, @sy1t2),
    ('2023-06-07', '2023-06-07T7:00:00', '2023-06-07T17:00:00', @multi_avatar, @multi_avatar, 'CheckedOut', @stid4, @tid1, @tid1, 36.5, @sy1t2),
    ('2023-06-07', '2023-06-07T7:00:00', '2023-06-07T17:00:00', @multi_avatar, @multi_avatar, 'CheckedOut', @stid6, @tid2, @tid2, 36.5, @sy1t2)
;

-- Attendance more for student @stid1
INSERT INTO Attendance
(date, checkinTime, checkoutTime, checkinPhotos, checkoutPhotos, status, studentId, checkinTeacherId, checkoutTeacherId, thermo, schoolTermId)
VALUES
    ('2023-05-12', '2023-05-12T7:00:00', '2023-05-12T17:00:00', concat('["./bothui/bothui3.jpeg"]'), concat('["./bothui/bothui5.jpeg"]'), 'CheckedOut', @stid1, @tid1, @tid1, 36.5, @sy1t2),
    ('2023-05-13', '2023-05-13T7:00:00', '2023-05-13T17:00:00', '["./bothui/bothui3.jpeg"]', '["./bothui/bothui2.jpeg"]', 'CheckedOut', @stid1, @tid1, @tid1, 36.5, @sy1t2),
    ('2023-05-14', '2023-05-14T7:00:00', '2023-05-14T17:00:00', '["./bothui/bothui2.jpeg"]', '["./bothui/bothui1.jpeg"]', 'AbsenseWithoutPermission', @stid1, @tid2, @tid2, 36.5, @sy1t2),
    ('2023-05-15', '2023-05-15T7:00:00', '2023-05-15T17:00:00', '["./bothui/bothui1.jpeg"]', '["./bothui/bothui3.jpeg"]', 'AbsenseWithPermission', @stid1, @tid1, @tid1, 36.5, @sy1t2),
    ('2023-05-16', '2023-05-16T7:00:00', '2023-05-16T17:00:00', '["./bothui/bothui5.jpeg"]', '["./bothui/bothui2.jpeg"]', 'AbsenseWithPermission', @stid1, @tid2, @tid2, 36.5, @sy1t2)
;

-- DailyRemark
SET @dremkid1 = 'dremkid1-0000-0000-0000-000000000000';
SET @dremkid2 = 'dremkid2-0000-0000-0000-000000000000';
SET @dremkid3 = 'dremkid3-0000-0000-0000-000000000000';
INSERT INTO DailyRemark (id, date, teacherId, studentId, schoolTermId)
VALUES
    (@dremkid1, '2023-06-05', @tid1, @stid1, @sy1t1),
    (@dremkid2, '2023-06-06', @tid1, @stid1, @sy1t1),
    (@dremkid3, '2023-06-07', @tid2, @stid1, @sy1t2)
;

INSERT INTO DailyRemarkActivity (dailyRemarkId, activity, content)
VALUES
	(@dremkid1, 'Sleep', 'Nay bé Student1 không ngủ được cả buổi trưa. Mong gia đình theo dõi tình sức khỏe của bé thêm.'),
    (@dremkid1, 'Eat', 'Bé Student ăn được 2/3 suất cơm, có biểu hiện biến ăn.'),
    (@dremkid1, 'Other', 'Bé có khiếu hài hước, cần phát huy'),
    (@dremkid2, 'Sleep', 'Nay bé Student1 không ngủ được cả buổi trưa. Mong gia đình theo dõi tình sức khỏe của bé thêm.'),
    (@dremkid2, 'Eat', 'Bé Student ăn được 2/3 suất cơm, có biểu hiện biến ăn.'),
    (@dremkid3, 'Sleep', 'Nay bé Student1 không ngủ được cả buổi trưa. Mong gia đình theo dõi tình sức khỏe của bé thêm.'),
    (@dremkid3, 'Eat', 'Bé Student ăn được 2/3 suất cơm, có biểu hiện biến ăn.')
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
    (@mealid1, '2023-05-06T07:00:00', @menuid1),
    (@mealid2, '2023-05-06T12:00:00', @menuid1),
    (@mealid3, '2023-05-06T15:00:00', @menuid1)
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
INSERT INTO PeriodRemark (period, startTime, endTime, teacherId, studentId, content, schoolTermId)
VALUES
    ('Week', '2023-06-01', '2023-06-30', @tid1, @stid1, 'Bé chăm ngoan, nhưng còn hơi rụt rè, mong gia đình cho bé thêm tình thương', @sy1t1),
    ('Week', '2023-06-01', '2023-06-30', @tid1, @stid2, 'Bé chăm ngoan', @sy1t1),
    ('Week', '2023-06-01', '2023-06-30', @tid1, @stid3, 'Bé chăm ngoan', @sy1t1),
    ('Week', '2023-06-01', '2023-06-30', @tid2, @stid4, 'Bé chăm ngoan', @sy1t1),
    ('Week', '2023-06-01', '2023-06-30', @tid2, @stid6, 'Bé chăm ngoan', @sy1t1)
;

-- TuitionFee
INSERT INTO TuitionFee (status, startTime, endTime, billUrl, amount, studentId)
VALUES
    ('Paid', '2022-04-01', '2023-05-01', 'bill.csv', '100000000', @stid1),
    ('UnPaid', '2022-04-01', '2023-05-01', 'bill.csv', '100000000', @stid1)
;

-- Notifications
INSERT INTO Noti (userId, classId, createUserId, title, content, route, photoUrl, time)
VALUES
	(@prid1, null, @tid1, 'Giáo viên đã phản hồi đơn đón về của bạn', 'Giáo viên đã xác nhận đơn đón về',
		'{"pathname": "parent/pickup/pickup-detail-screen", "params": {"id": "pickupid-1000-0000-0000-000000000000"}}',
		'./icons/pickup-icon.png', '2023-05-05T7:00:00'
    ),
    (@prid1, null, @tid1, 'Giáo viên đã phản hồi đơn đón về của bạn', 'Giáo viên đã xác nhận đơn đón về',
		'{"pathname": "parent/pickup/pickup-detail-screen", "params": {"id": "pickupid-1000-0000-0000-000000000000"}}',
		'./icons/pickup-icon.png', '2023-05-05T8:00:00'
    )
;

COMMIT;
