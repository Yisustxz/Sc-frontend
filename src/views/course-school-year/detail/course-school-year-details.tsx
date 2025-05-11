import { Grid, Box, Typography } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import { IconBook, IconCalendar, IconClock, IconUser } from '@tabler/icons';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';

interface Props {
  courseSchoolYear: any;
}

const CourseSchoolYearDetails: React.FC<Props> = ({ courseSchoolYear }) => {
  const getGradeLabel = (grade: number) => {
    return gradeMapping[grade as EducationLevels] || `Grado ${grade}`;
  };

  return (
    <MainCard title={`Detalle de Asignatura: ${courseSchoolYear.course.name}`} className="detail-card">
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ mr: 1 }}>
              <IconBook size="1.1rem" />
            </Box>
            <Typography variant="body1">
              <strong>Nombre:</strong> {courseSchoolYear.course.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ mr: 1 }}>
              <IconCalendar size="1.1rem" />
            </Box>
            <Typography variant="body1">
              <strong>Año Escolar:</strong> {courseSchoolYear.schoolYear.code}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1">
              <strong>Grado:</strong> {getGradeLabel(courseSchoolYear.grade)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ mr: 1 }}>
              <IconClock size="1.1rem" />
            </Box>
            <Typography variant="body1">
              <strong>Horas Semanales:</strong> {courseSchoolYear.weeklyHours} horas
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1 }}>
              <IconUser size="1.1rem" />
            </Box>
            <Typography variant="body1">
              <strong>Profesor:</strong> {courseSchoolYear.professor
                ? `${courseSchoolYear.professor.name} ${courseSchoolYear.professor.lastName}`
                : 'No asignado'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default CourseSchoolYearDetails;
