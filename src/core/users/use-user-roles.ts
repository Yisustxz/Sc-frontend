import { SelectOption } from "components/SelectField";

enum Roles {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
}

export function getRolesAsOptions(): SelectOption[] {
  const rolesArray = Object.values(Roles) as string[];

  return rolesArray.map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  }));
}
