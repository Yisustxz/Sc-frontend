import { FunctionComponent } from 'react';
import { Box, Button, Typography, Divider, Paper, List, ListItem, ListItemButton, IconButton } from '@mui/material';
import { IconCirclePlus, IconPlus } from '@tabler/icons';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import { AvailableCoursesProps, CourseType } from './types';

/**
 * Componente que muestra los cursos disponibles para seleccionar
 */
const AvailableCoursesPanel: FunctionComponent<AvailableCoursesProps> = ({
  coursesByGradeUnselected,
  onSelectAllGradeCourses,
  onCourseChange
}) => {
  return (
    <Paper sx={{ 
      flex: 1, 
      maxHeight: '400px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="h3">
          Materias Disponibles
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ 
        overflowY: 'auto',
        flex: 1,
        pr: 1
      }}>
        {Object.entries(coursesByGradeUnselected)
          .sort(([gradeA], [gradeB]) => Number(gradeA) - Number(gradeB))
          .map(([grade, courses]) => {
            // No mostrar el grado si no hay cursos disponibles
            if (courses.length === 0) return null;

            return (
              <Box key={`available-${grade}`} sx={{ mb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 1 
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {gradeMapping[Number(grade) as EducationLevels] || `Grado ${grade}`}
                  </Typography>
                  <Button 
                    size="small"
                    onClick={() => onSelectAllGradeCourses(+grade, true)}
                    startIcon={<IconCirclePlus size={16} />}
                    sx={{ minWidth: 'auto', py: 0.5 }}
                  >
                    Agregar todos
                  </Button>
                </Box>

                <List dense disablePadding sx={{ ml: 1 }}>
                  {courses.map((course: CourseType) => (
                    <ListItem 
                      key={`available-course-${course.id}`}
                      disablePadding
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={() => onCourseChange(course.id, true)}
                        >
                          <IconPlus size={16} />
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        dense
                        onClick={() => onCourseChange(course.id, true)}
                        sx={{ py: 0.5 }}
                      >
                        <Typography variant="body2">
                          {course.course?.name || 'Sin nombre'}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            );
          })}
      </Box>
    </Paper>
  );
};

export default AvailableCoursesPanel; 