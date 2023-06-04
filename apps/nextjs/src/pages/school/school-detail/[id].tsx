import { useRouter } from "next/router";
import { AdminToolHeader } from "~/components/layout/AdminToolHeader";
import { api } from "~/utils/api";
import { useState } from "react";
import { Icon, InfoIcon } from "@chakra-ui/icons";
import { FaChalkboardTeacher, FaChild, FaHouseUser } from "react-icons/fa";
import { SchoolGeneralInfo } from "~/components/school/SchoolGeneralInfo";
import { SchoolDetailInfo } from "@acme/api/src/router/school/protocols";
import { SchoolClassManagement } from "~/components/school/SchoolClassManagement";
import { SchoolStudentManagement } from "~/components/school/SchoolStudentManagement";
import { SchoolEmployeeManagement } from "~/components/school/SchoolEmployeeManagement";
enum SchoolManagementSection {
  Info = 0,
  Classes = 1,
  Employee = 2,
  Student = 3
}

const SchoolDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: schoolDetail, refetch } = api.school.getSchoolDetail.useQuery(
    {
      schoolId: id as string
    },
    { enabled: !!id && typeof id === "string" }
  );

  const sections = [
    SchoolManagementSection.Info,
    SchoolManagementSection.Classes,
    SchoolManagementSection.Employee,
    SchoolManagementSection.Student
  ];

  const [currentSection, setCurrentSection] = useState<SchoolManagementSection>(
    SchoolManagementSection.Info
  );

  const getSectionName = (section: SchoolManagementSection) => {
    switch (section) {
      case SchoolManagementSection.Info:
        return "Thông tin";
      case SchoolManagementSection.Employee:
        return "Nhân viên";
      case SchoolManagementSection.Student:
        return "Học sinh";
      case SchoolManagementSection.Classes:
        return "Lớp học";
    }
  };

  const getSectionIcon = (section: SchoolManagementSection) => {
    switch (section) {
      case SchoolManagementSection.Info:
        return <InfoIcon />;
      case SchoolManagementSection.Employee:
        return <Icon as={FaChalkboardTeacher} />;
      case SchoolManagementSection.Student:
        return <Icon as={FaChild} />;
      case SchoolManagementSection.Classes:
        return <Icon as={FaHouseUser} />;
    }
  };

  const renderSectionNavigation = (section: SchoolManagementSection) => (
    <div
      className={
        "flex cursor-pointer items-center space-x-2 rounded px-3 py-2" +
        (section == currentSection
          ? " bg-sky-900 font-semibold text-white"
          : " text-sky-950 hover:bg-sky-100")
      }
      onClick={() => setCurrentSection(section)}
    >
      {getSectionIcon(section)}
      <div>{getSectionName(section)}</div>
    </div>
  );

  const renderLeftPanelContent = () => {
    return (
      <div
        style={{ width: "240px" }}
        className={"space-y-2 bg-sky-50 px-2 py-4"}
      >
        {sections.map((section) => (
          <div key={section}>{renderSectionNavigation(section)}</div>
        ))}
      </div>
    );
  };

  const renderRightPanelContent = (schoolDetail: SchoolDetailInfo) => {
    switch (currentSection) {
      case SchoolManagementSection.Info:
        return (
          <SchoolGeneralInfo
            schoolDetail={schoolDetail}
            refetch={() => {
              void refetch();
            }}
          />
        );
      case SchoolManagementSection.Classes:
        return <SchoolClassManagement schoolId={schoolDetail.schoolId} />;

      case SchoolManagementSection.Student:
        return <SchoolStudentManagement schoolId={schoolDetail.schoolId} />;

      case SchoolManagementSection.Employee:
        return <SchoolEmployeeManagement schoolId={schoolDetail.schoolId} />;
    }
  };

  return (
    schoolDetail && (
      <div className={"flex h-screen flex-col"}>
        <AdminToolHeader
          title={schoolDetail.schoolName}
          prevPage={["/", "Tất cả các trường"]}
        />
        <div className={"flex flex-grow"}>
          {renderLeftPanelContent()}
          <div className={"flex-grow"}>
            {renderRightPanelContent(schoolDetail)}
          </div>
        </div>
      </div>
    )
  );
};

export default SchoolDetail;
