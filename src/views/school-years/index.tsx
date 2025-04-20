import { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import styled from 'styled-components';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import MainCard from 'components/cards/MainCard';
import DynamicTable, { Header } from 'components/DynamicTable';
import { useAppDispatch } from 'store';
import { setErrorMessage, setIsLoading } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';
import getPaginate from 'services/school-year/get-paginate';
import { SchoolYear } from 'core/school-year/types';
import { PaginateBody } from 'services/types';

interface Props {
  className?: string;
}

const breadcrumbsItems = [
  {
    label: 'Años Escolares',
    active: true
  }
];

const SchoolYears: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const headers: Header<SchoolYear>[] = [
    { columnLabel: 'ID', fieldName: 'id' },
    { columnLabel: 'Código', fieldName: 'code' },
    { columnLabel: 'Fecha Inicio', fieldName: 'startDate' },
    { columnLabel: 'Fecha Fin', fieldName: 'endDate' },
  ];

  const fetchSchoolYears = useCallback(async () => {
    try {
      setLoading(true);
      dispatch(setIsLoading(true));
      const paginateParams: PaginateBody = {
        page: page + 1,
        size: pageSize
      };
      const response = await getPaginate(paginateParams);
      setSchoolYears(response.items);
      setTotal(response.paginate.totalItems);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      } else {
        dispatch(setErrorMessage('Error al obtener los años escolares'));
      }
    } finally {
      setLoading(false);
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  const handleCreateClick = () => {
    navigate('/school-years/create');
  };

  const handleRowClick = (row: SchoolYear) => {
    navigate(`/school-years/edit/${row.id}`);
  };

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      <MainCard title="Años Escolares">
        <Box mb={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Crear Año Escolar
          </Button>
        </Box>
        
        <DynamicTable
          headers={headers}
          rows={schoolYears}
          emptyState="No hay años escolares registrados"
          renderColumnClass={(row) => row.isDeleted ? 'deleted-row' : ''}
          components={[
            (row) => (
              <Button
                key={`edit-${row.id}`}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleRowClick(row)}
              >
                Editar
              </Button>
            )
          ]}
        />
      </MainCard>
    </div>
  );
};

export default styled(SchoolYears)`
  width: 100%;
  
  .deleted-row {
    opacity: 0.5;
    text-decoration: line-through;
  }
`; 