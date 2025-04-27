import { SelectOption } from "components/SelectField";

export enum EducationLevels {
  PrimerGrado = 1,
  SegundoGrado = 2,
  TercerGrado = 3,
  CuartoGrado = 4,
  QuintoGrado = 5,
  SextoGrado = 6,
  SeptimoGrado = 7,
  OctavoGrado = 8,
  NovenoGrado = 9,
  DecimoGrado = 10,
  UndecimoGrado = 11,
}

export const gradeMapping: Record<EducationLevels, string> = {
  [EducationLevels.PrimerGrado]: "1° Grado",
  [EducationLevels.SegundoGrado]: "2° Grado",
  [EducationLevels.TercerGrado]: "3° Grado",
  [EducationLevels.CuartoGrado]: "4° Grado",
  [EducationLevels.QuintoGrado]: "5° Grado",
  [EducationLevels.SextoGrado]: "6° Grado",
  [EducationLevels.SeptimoGrado]: "1° Año",
  [EducationLevels.OctavoGrado]: "2° Año",
  [EducationLevels.NovenoGrado]: "3° Año",
  [EducationLevels.DecimoGrado]: "4° Año",
  [EducationLevels.UndecimoGrado]: "5° Año",
};

export function getLevelsAsOptions(): SelectOption[] {
  return Object.values(EducationLevels)
    .filter((value) => typeof value === "number") 
    .map((value) => ({
      value,
      label: gradeMapping[value as EducationLevels], 
    }))
    .sort((a, b) => {
      const aVal = Number(a.value);
      const bVal = Number(b.value);
      return aVal - bVal;
    });
}
