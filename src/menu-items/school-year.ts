import { IconBookmarks, IconUserCheck } from "@tabler/icons";
import { MenuItem, MenuItemType } from "./types";
import { Role } from "constants/roles";

const getCourseSchoolYearItem = (userRole: string | null | undefined) => {
  const children: any[] = [
    {
      id: "list-course-school-year",
      title: "Lista de asignaturas por año",
      type: MenuItemType.Item,
      url: "/course-school-year",
      breadcrumbs: false,
    }
  ];

  if (!userRole || userRole === Role.ADMIN) {
    children.push({
      id: "create-course-school-year",
      title: "Asignar asignatura",
      type: MenuItemType.Item,
      url: "/course-school-year/create",
      breadcrumbs: false,
    });
  }

  return {
    id: "courseSchoolYear",
    title: "Asignaturas por Año",
    type: MenuItemType.Collapse,
    icon: IconBookmarks,
    breadcrumbs: false,
    children,
  };
};

const courseSchoolYearItem = {
  id: "courseSchoolYear",
  title: "Asignaturas por Año",
  type: MenuItemType.Collapse,
  icon: IconBookmarks,
  breadcrumbs: false,
  children: [
    {
      id: "list-course-school-year",
      title: "Lista de asignaturas por año",
      type: MenuItemType.Item,
      url: "/course-school-year",
      breadcrumbs: false,
    },
    {
      id: "create-course-school-year",
      title: "Asignar asignatura",
      type: MenuItemType.Item,
      url: "/course-school-year/create",
      breadcrumbs: false,
    },
  ],
};

const inscriptionsItem = {
  id: "inscriptions",
  title: "Inscripciones",
  type: MenuItemType.Collapse,
  icon: IconUserCheck,
  breadcrumbs: false,
  children: [
    {
      id: "list-inscriptions",
      title: "Lista de inscripciones",
      type: MenuItemType.Item,
      url: "/inscriptions",
      breadcrumbs: false,
    },

    {
      id: "create-inscription",
      title: "Crear inscripción",
      type: MenuItemType.Item,
      url: "/inscriptions/create",
      breadcrumbs: false,
    },

    
  ],
};

const getSchoolYearByRole = (userRole: string | null | undefined): MenuItem => {
  const dynamicCourseSchoolYearItem = getCourseSchoolYearItem(userRole);
  const children: any[] = [dynamicCourseSchoolYearItem];

  if (!userRole || userRole === Role.ADMIN) {
    children.push(inscriptionsItem);
  }

  return {
    id: "schoolYear",
    type: MenuItemType.Group,
    title: "Año escolar",
    children,
  };
};

const schoolYear: MenuItem = {
  id: "schoolYear",
  type: MenuItemType.Group,
  title: "Año escolar",
  children: [courseSchoolYearItem, inscriptionsItem],
};

export default schoolYear;
export { getSchoolYearByRole };
