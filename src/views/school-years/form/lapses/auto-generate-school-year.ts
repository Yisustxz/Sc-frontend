import { SchoolLapseForm, SchoolCourtForm } from '../types';

/**
 * Genera los lapsos para un año escolar completo basado en un año pivote
 * @param pivotYear Año desde el que se generará el año escolar (ej: 2023 para año escolar 2023-2024)
 * @returns Array de objetos SchoolLapseForm con tres lapsos y sus respectivos cortes
 */
export const generateSchoolYear = (pivotYear: number): SchoolLapseForm[] => {
  // Fechas clave para el año escolar
  // 1er lapso: 15 septiembre - 15 diciembre
  const firstLapseStartDate = `${pivotYear}-09-15`;
  const firstLapseEndDate = `${pivotYear}-12-15`;
  
  // 2do lapso: 7 enero - 7 abril
  const secondLapseStartDate = `${pivotYear + 1}-01-07`;
  const secondLapseEndDate = `${pivotYear + 1}-04-07`;
  
  // 3er lapso: 7 abril - 15 julio
  const thirdLapseStartDate = `${pivotYear + 1}-04-07`;
  const thirdLapseEndDate = `${pivotYear + 1}-07-15`;
  
  // Generar los lapsos con sus cortes, asegurando que el primer corte de cada lapso
  // tenga exactamente la misma fecha de inicio que el lapso
  return [
    {
      startDate: firstLapseStartDate,
      endDate: firstLapseEndDate,
      schoolCourts: generateCourts(firstLapseStartDate, firstLapseEndDate, 3),
      isNew: true,
    },
    {
      startDate: secondLapseStartDate,
      endDate: secondLapseEndDate,
      schoolCourts: generateCourts(secondLapseStartDate, secondLapseEndDate, 3),
      isNew: true,
    },
    {
      startDate: thirdLapseStartDate,
      endDate: thirdLapseEndDate,
      schoolCourts: generateCourts(thirdLapseStartDate, thirdLapseEndDate, 3),
      isNew: true,
    }
  ];
};

/**
 * Genera cortes para un lapso, dividiendo el tiempo entre la fecha de inicio y fin
 * en partes iguales
 * @param startDate Fecha de inicio del lapso en formato YYYY-MM-DD
 * @param endDate Fecha de fin del lapso en formato YYYY-MM-DD
 * @param count Número de cortes a generar
 * @returns Array de objetos SchoolCourtForm
 */
const generateCourts = (startDate: string, endDate: string, count: number): SchoolCourtForm[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calcular la duración total en días
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calcular la duración de cada corte
  const courtDurationDays = Math.floor(totalDays / count);
  
  const courts: SchoolCourtForm[] = [];
  
  for (let i = 0; i < count; i++) {
    // Para el primer corte, usamos el string original de fecha para evitar problemas de zona horaria
    if (i === 0) {
      // Fecha de fin de este corte
      const courtEndDate = new Date(start);
      courtEndDate.setDate(start.getDate() + courtDurationDays - 1);
      
      courts.push({
        startDate: startDate, // Usar el string original
        endDate: formatDate(courtEndDate),
        isNew: true,
      });
    } else if (i === count - 1) {
      // Para el último corte, calculamos la fecha de inicio normalmente, pero usamos la fecha de fin original
      const courtStartDate = new Date(start);
      courtStartDate.setDate(start.getDate() + (i * courtDurationDays));
      
      courts.push({
        startDate: formatDate(courtStartDate),
        endDate: endDate, // Usar el string original
        isNew: true,
      });
    } else {
      // Para los cortes intermedios, calculamos normalmente
      const courtStartDate = new Date(start);
      courtStartDate.setDate(start.getDate() + (i * courtDurationDays));
      
      const courtEndDate = new Date(courtStartDate);
      courtEndDate.setDate(courtStartDate.getDate() + courtDurationDays - 1);
      
      courts.push({
        startDate: formatDate(courtStartDate),
        endDate: formatDate(courtEndDate),
        isNew: true,
      });
    }
  }
  
  return courts;
};

/**
 * Formatea una fecha a formato YYYY-MM-DD
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene los años académicos actuales para mostrar en las opciones de generación automática
 * @returns Un array con los años pivote para generar años académicos
 */
export const getAcademicYearOptions = (): Array<{year: number, label: string}> => {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      year: currentYear - 1,
      label: `${currentYear - 1}-${currentYear}`
    },
    {
      year: currentYear,
      label: `${currentYear}-${currentYear + 1}`
    }
  ];
}; 