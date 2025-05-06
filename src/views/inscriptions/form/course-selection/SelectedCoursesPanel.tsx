import { FunctionComponent } from 'react';
import { Box, Button, Typography, Divider, Paper, List, ListItem, ListItemButton, IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import { SelectedCoursesProps, CourseType } from './types';

/**
 * Componente que muestra los cursos seleccionados
 */
const SelectedCoursesPanel: FunctionComponent<SelectedCoursesProps> = ({
  selectedGrade,
  selectedCoursesSchoolYear,
  coursesByGradeSelected,
  onAutomaticAddCourses,
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
          Materias Seleccionadas
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          {selectedCoursesSchoolYear.length} materias
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {selectedCoursesSchoolYear.length <= 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 8,
          color: 'text.secondary'
        }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            No hay materias seleccionadas
          </Typography>
          {selectedGrade && (
            <Button 
              variant="outlined"
              color="primary"
              onClick={onAutomaticAddCourses}
              sx={{ ml: 2 }}
            >
              Agregar materias del grado {selectedGrade}
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ overflowY: 'auto', pr: 1, flex: 1 }}>
          {Object.entries(coursesByGradeSelected)
            .sort(([gradeA], [gradeB]) => Number(gradeA) - Number(gradeB))
            .map(([grade, courses]) => (
              <Box key={`selected-${grade}`} sx={{ mb: 2 }}>
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
                    color="secondary"
                    onClick={() => onSelectAllGradeCourses(+grade, false)}
                    startIcon={<IconTrash size={16} />}
                    sx={{ minWidth: 'auto', py: 0.5 }}
                  >
                    Quitar todos
                  </Button>
                </Box>
                
                <List dense disablePadding sx={{ ml: 1 }}>
                  {courses.map((course: CourseType) => (
                    <ListItem 
                      key={`selected-course-${course.id}`}
                      disablePadding
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          size="small"
                          color="error"
                          onClick={() => onCourseChange(course.id, false)}
                        >
                          <IconTrash size={16} />
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        dense
                        onClick={() => onCourseChange(course.id, false)}
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
            ))}
        </Box>
      )}
    </Paper>
  );
};

export default SelectedCoursesPanel; 