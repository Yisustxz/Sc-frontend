// assets
import { IconCalendar, IconBookmarks, IconUserCheck } from "@tabler/icons";
import { MenuItem, MenuItemType } from "./types";

const schoolYear: MenuItem = {
  id: "schoolYear",
  type: MenuItemType.Group,
  title: "Año escolar",
  children: [
    {
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

export default schoolYear; 