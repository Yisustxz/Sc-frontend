import { Button, Pagination } from '@mui/material';
import DynamicTable from 'components/DynamicTable';
import { CourseSchoolYear } from 'core/course-school-year/types';
import styled from 'styled-components';
// Own
import { useAppDispatch } from 'store/index';
import { setIsLoading, setSuccessMessage, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';
import { FunctionComponent, useCallback, useState } from 'react';
import { PaginateData } from 'services/types';
import { IconEdit, IconTrash, IconCalendar, IconBook, IconUser, IconEye } from '@tabler/icons';
import deleteCourseSchoolYear from 'services/course-school-year/delete-course-school-year';
import DialogDelete from 'components/dialogDelete';
import { Box, IconButton, Tooltip } from '@mui/material';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import { useNavigate } from 'react-router-dom';

interface Props {
    items: CourseSchoolYear[];
    paginate: PaginateData;
    className?: string;
    onChange: (page: number) => void;
    fetchItems: () => void;
}

const Table: FunctionComponent<Props> = ({ items, paginate, className, onChange, fetchItems }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<CourseSchoolYear | null>(null);

    // Manejador para abrir diálogo de eliminación
    const handleOpenDelete = useCallback((item: CourseSchoolYear) => {
        setSelectedItem(item);
        setDeleteOpen(true);
    }, []);

    // Manejador para navegar a la página de edición
    const handleEdit = useCallback((item: CourseSchoolYear) => {
        navigate(`/course-school-year/edit/${item.id}`);
    }, [navigate]);

    // Manejador para navegar a la página de detalle
    const handleDetail = useCallback((item: CourseSchoolYear) => {
        navigate(`/course-school-year/detail/${item.id}`);
    }, [navigate]);

    // Manejador para cerrar diálogos
    const handleCloseDialogs = useCallback(() => {
        setDeleteOpen(false);
        setSelectedItem(null);
    }, []);

    // Manejador para eliminar un ítem
    const handleDelete = useCallback(async () => {
        if (!selectedItem) return;
        
        try {
            dispatch(setIsLoading(true));
            await deleteCourseSchoolYear(selectedItem.id);
            dispatch(setSuccessMessage('Asignatura por año escolar eliminada correctamente'));
            fetchItems();
        } catch (error) {
            if (error instanceof BackendError) {
                dispatch(setErrorMessage(error.getMessage()));
            }
        } finally {
            dispatch(setIsLoading(false));
            handleCloseDialogs();
        }
    }, [dispatch, fetchItems, handleCloseDialogs, selectedItem]);

    // Función para convertir número de grado a texto
    const getGradeLabel = (grade: number): string => {
        if (grade >= 1 && grade <= 11) {
            return gradeMapping[grade as EducationLevels] || `Grado ${grade}`;
        }
        return `Grado ${grade}`;
    };

    return (
        <div className={className}>
            <DynamicTable
                headers={[
                    { columnLabel: 'ID', fieldName: 'id', cellAlignment: 'left' },
                    { columnLabel: 'Asignatura', cellAlignment: 'left', onRender: (row: CourseSchoolYear) => (
                        <Box className="course-cell">
                            <IconBook size={16} className="course-icon" />
                            <span>{row.course?.name || 'Sin asignatura'}</span>
                        </Box>
                    ) },
                    { columnLabel: 'Año Escolar', cellAlignment: 'left', onRender: (row: CourseSchoolYear) => (
                        <Box className="school-year-cell">
                            <IconCalendar size={16} className="calendar-icon" />
                            <span>{row.schoolYear?.code || 'Sin año escolar'}</span>
                        </Box>
                    ) },
                    { columnLabel: 'Grado', cellAlignment: 'left', onRender: (row: CourseSchoolYear) => (
                        getGradeLabel(row.grade)
                    ) },
                    { columnLabel: 'Profesor', cellAlignment: 'left', onRender: (row: CourseSchoolYear) => (
                        <Box className="professor-cell">
                            <IconUser size={16} className="professor-icon" />
                            <span>{row.professor?.name || 'Sin asignar'}</span>
                        </Box>
                    ) },
                    { columnLabel: 'Horas Semanales', fieldName: 'weeklyHours', cellAlignment: 'center' },
                ]}
                rows={items} components={[
                    (row: CourseSchoolYear) =>
                        <Button
                            color="info"
                            onClick={() => handleDetail(row)}
                            startIcon={<IconEye />}
                        >
                            Detalle
                        </Button>,
                    (row: CourseSchoolYear) =>
                        <Button
                            color="primary"
                            onClick={() => handleEdit(row)}
                            startIcon={<IconEdit />}
                        >
                            Editar
                        </Button>,
                    (row: CourseSchoolYear) =>
                        <Button 
                            color="secondary" 
                            onClick={() => handleOpenDelete(row)}
                            startIcon={<IconTrash />}
                        >
                            Eliminar
                        </Button>
                ]}
            />

            {/* Diálogo de confirmación para eliminar */}
            <DialogDelete 
                handleClose={handleCloseDialogs} 
                onDelete={handleDelete} 
                open={deleteOpen}
            />

            {/* Paginación */}
            <div className="paginator-container">
                <Pagination
                    count={paginate.totalPages}
                    page={paginate.page}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    onChange={(event, page) => { onChange(page) }}
                />
            </div>
        </div>
    );
}

export default styled(Table)`
    display: flex;
    flex-direction: column;

    .paginator-container {
        margin-top: 12px;
        display: flex;
        justify-content: center;
        flex-direction: row;
    }

    .course-cell, .school-year-cell, .professor-cell {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .course-icon, .calendar-icon, .professor-icon {
        color: #6E6E6E;
    }
`; 