// assets
import { IconCalendar, IconBook2, IconBooks, IconBookmarks } from "@tabler/icons";
import { MenuItem, MenuItemType } from "./types";

const school: MenuItem = {
  id: "school",
  type: MenuItemType.Group,
  title: "Escuela",
  children: [
    {
      id: "academicYear",
      title: "Años escolares",
      type: MenuItemType.Collapse,
      icon: IconCalendar,
      breadcrumbs: false,
      children: [
        {
          id: "list-academic-year",
          title: "Lista de años escolares",
          type: MenuItemType.Item,
          url: "/school-years",
          breadcrumbs: false,
        },
        {
          id: "create-academic-year",
          title: "Crear año escolar",
          type: MenuItemType.Item,
          url: "/school-years/create",
          breadcrumbs: false,
        },
      ],
    },
    {
      id: "asignaturas",
      title: "Asignaturas",
      type: MenuItemType.Collapse,
      icon: IconBooks,
      breadcrumbs: false,
      children: [
        {
          id: "list-courses",
          title: "Lista de asignaturas",
          type: MenuItemType.Item,
          url: "/courses",
          breadcrumbs: false,
        },
        {
          id: "create-courses",
          title: "Crear asignatura",
          type: MenuItemType.Item,
          url: "/courses/create",
          breadcrumbs: false,
        },
      ],
    },
    {
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
    },
  ],
};

export default school;
