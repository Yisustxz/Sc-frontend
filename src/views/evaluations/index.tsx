import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// material-ui
import {
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';

// icons
import { IconSearch, IconEye, IconEdit, IconTrash } from '@tabler/icons';

// project imports
import MainCard from 'components/cards/MainCard';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import useGetEvaluations from 'services/hooks/use-get-evaluations';
import EvaluationDetails from './evaluation-details';
import EvaluationDetail from './detail';
import { EvaluationType } from 'core/evaluations/types';


// Componente principal para mostrar la lista de evaluaciones
const Evaluations = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
 // const { data: evaluations, isLoading, error, refetch } = useGetEvaluations(searchTerm);
  const error = null;
  const isLoading = false;
  const evaluations = [{
    id: 1,
    name: 'Evaluación 1',
    type: EvaluationType.EXAM,
    projectedDate: '2025-01-01',
    schoolCourtId: 1,
    courseSchoolYearId: 1,
    description: 'Descripción de la evaluación 1',
    weight: 100,
    schoolCourt: {
      id: 1,
      startDate: '2025-01-01',
      endDate: '2025-01-01',
      lapseId: 1,
      lapse: {
        id: 1,
        name: 'Lapso 1'
      }
    }
  }];

  // Manejador para cambios en el campo de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Definir las rutas para los breadcrumbs
  const breadcrumbItems = [
    {
      label: 'Evaluaciones'
    }
  ];

  if (true) {
     return (<EvaluationDetail />);
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <BreadcrumbsNav items={breadcrumbItems} />
      </Box>
    
      <MainCard title="Evaluaciones">
        <Grid container spacing={3}>

          <Grid item xs={12}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box display="flex" justifyContent="center" my={3}>
                <Typography color="error">Error al cargar evaluaciones</Typography>
              </Box>
            ) : evaluations.length === 0 ? (
              <Box display="flex" justifyContent="center" my={3}>
                <Typography>No se encontraron evaluaciones</Typography>
              </Box>
                ) : (
                    <>
                    <EvaluationDetails evaluation={{
                      id: 1,
                      name: 'Evaluación 1',
                      type: EvaluationType.EXAM,
                      projectedDate: '2025-01-01',
                      courseSchoolYearId: 1,
                      schoolCourtId: 1,
                      percentage: '100.00',
                      correlative: 1,
                      creationDate: '2025-01-01T00:00:00.000Z',
                      deletedAt: null,
                      courseSchoolYear: {
                        id: 1,
                        grade: 1,
                        weeklyHours: 5,
                        professorId: 1,
                        courseId: 1,
                        schoolYearId: 1,
                        deletedAt: null
                      },
                      schoolCourt: {
                        id: 1,
                        courtNumber: 1,
                        startDate: '2025-01-01',
                        endDate: '2025-01-01',
                        createdAt: '2025-01-01T00:00:00.000Z',
                        updatedAt: '2025-01-01T00:00:00.000Z',
                        deletedAt: null,
                        schoolLapse: {
                          id: 1,
                          lapseNumber: 1,
                          startDate: '2025-01-01',
                          endDate: '2025-01-01',
                          createdAt: '2025-01-01T00:00:00.000Z',
                          updatedAt: '2025-01-01T00:00:00.000Z',
                          deletedAt: null
                        }
                      }
                    }}
                        onEditClick={() => { }}
                      
                      />
                    
                      <EvaluationDetail />
                    </>
            )}
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

/*  id: number;
  name: string;
  description: string;
  type: string;
  weight: number;
  projectedDate: string;
  schoolCourtId: number;
  courseSchoolYearId?: number;
  schoolCourt?: {
    id: number;
    startDate: string;
    endDate: string;
    lapseId: number;
    lapse?: {
      id: number;
      name: string;
    }
  }*/

export default Evaluations;
