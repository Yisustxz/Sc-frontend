import { SelectOption } from "components/SelectField";

enum EducationLevels {
    'PrimerGrado' = 1,
    'SegundoGrado' = 2,
    'TercerGrado' = 3,
    'CuartoGrado' = 4,
    'QuintoGrado' = 5,
    'SextoGrado' = 6,
    'PrimerAño' = 7,
    'SegundoAño' = 8,
    'TercerAño' = 9,
    'CuartoAño' = 10,
    'QuintoAño' = 11
}

export function getLevelsAsOptions(): SelectOption[] {
  const levelsArray = Object.entries(EducationLevels)
    .filter(([key]) => isNaN(Number(key))) // Filtrar las claves numéricas (mapeo inverso)
    .map(([key]) => ({
      value: EducationLevels[key as keyof typeof EducationLevels],
      label: key.replace(/([A-Z])/g, " $1").trim(), // Formatear el nombre (e.g., "PrimerGrado" -> "Primer Grado")
    }));

  return levelsArray;
}