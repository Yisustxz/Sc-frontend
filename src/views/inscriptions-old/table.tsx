import { Button, Pagination, Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import DynamicTable from 'components/DynamicTable';
import { InscriptionDto } from 'core/inscriptions/types/index';
import styled from 'styled-components';
import { useAppDispatch } from 'store/index';
import { setIsLoading, setSuccessMessage, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';
import { FunctionComponent, useCallback, useState } from 'react';
import { PaginateData } from 'services/types';
import { IconEdit, IconTrash, IconEye, IconCalendar, IconUser, IconBook } from '@tabler/icons';
import deleteInscriptionService from 'services/inscriptions/delete-inscription';
import DialogDelete from 'components/dialogDelete';
import { useNavigate } from 'react-router-dom';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';

interface Props {
    items: InscriptionDto[];
    paginate: PaginateData;
    className?: string;
    onChange: (page: number) => void;
    fetchItems: () => void;
}

const Table: FunctionComponent<Props> = ({ items, paginate, className, onChange, fetchItems }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<InscriptionDto | null>(null);

    // Manejador para abrir diálogo de eliminación
    const handleOpenDelete = useCallback((item: InscriptionDto) => {
        setSelectedItem(item);
        setDeleteOpen(true);
    }, []);

    // Manejador para navegar a la página de edición
    const handleEdit = useCallback((item: InscriptionDto) => {
        navigate(`/inscriptions/edit/${item.id}`);
    }, [navigate]);

    // Manejador para navegar a la página de detalle
    const handleDetail = useCallback((item: InscriptionDto) => {
        navigate(`/inscriptions/${item.id}`);
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
            await deleteInscriptionService(selectedItem.id);
            dispatch(setSuccessMessage('Inscripción eliminada correctamente'));
            fetchItems();
        } catch (error) {
            if (error instanceof BackendError) {
                dispatch(setErrorMessage(error.getMessage()));
            } else {
                dispatch(setErrorMessage('Error al eliminar la inscripción'));
            }
        } finally {
            dispatch(setIsLoading(false));
            handleCloseDialogs();
        }
    }, [dispatch, fetchItems, handleCloseDialogs, selectedItem]);

    // Función para convertir número de grado a texto
    const getGradeLabel = (grade: string): string => {
        const gradeNum = parseInt(grade, 10);
        if (gradeNum >= 1 && gradeNum <= 11) {
            return gradeMapping[gradeNum as EducationLevels] || `Grado ${grade}`;
        }
        return `Grado ${grade}`;
    };

    return (
        <div className={className}>
            <DynamicTable
                headers={[
                    { columnLabel: 'ID', fieldName: 'id', cellAlignment: 'left' },
                    { columnLabel: 'Estudiante', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        <Box className="student-cell">
                            <IconUser size={16} className="student-icon" />
                            <span>{row.student?.name || 'Sin estudiante'}</span>
                        </Box>
                    ) },
                    { columnLabel: 'Año Escolar', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        <Box className="school-year-cell">
                            <IconCalendar size={16} className="calendar-icon" />
                            <span>{row.schoolYear?.code || 'Sin año escolar'}</span>
                        </Box>
                    ) },
                    { columnLabel: 'Grado', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        getGradeLabel(row.grade)
                    ) },
                    { columnLabel: 'Asignaturas', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        <Chip 
                            label={`${row.courseInscriptions?.length || 0} asignaturas`} 
                            color="primary" 
                            variant="outlined" 
                            size="small"
                            className="courses-chip" 
                        />
                    ) },
                    { columnLabel: 'Acciones', cellAlignment: 'center' }
                ]}
                rows={items} 
                components={[
                    (row: InscriptionDto) => (
                        <Box className="action-buttons">
                            <Tooltip title="Detalle" arrow>
                                <IconButton
                                    color="info"
                                    onClick={() => handleDetail(row)}
                                    size="small"
                                    className="action-btn detail-btn"
                                >
                                    <IconEye size={18} />
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Editar" arrow>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(row)}
                                    size="small"
                                    className="action-btn edit-btn"
                                >
                                    <IconEdit size={18} />
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Eliminar" arrow>
                                <IconButton 
                                    color="error" 
                                    onClick={() => handleOpenDelete(row)}
                                    size="small"
                                    className="action-btn delete-btn"
                                >
                                    <IconTrash size={18} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )
                ]}
                emptyState={
                    <Box className="empty-state">
                        <Typography variant="subtitle1">No se encontraron inscripciones con los criterios de búsqueda.</Typography>
                        <Button 
                            color="primary"
                            variant="contained"
                            startIcon={<IconBook />}
                            onClick={() => navigate('/inscriptions/create')}
                            className="create-btn"
                        >
                            Nueva Inscripción
                        </Button>
                    </Box>
                }
            />

            {/* Diálogo de confirmación para eliminar */}
            <DialogDelete 
                handleClose={handleCloseDialogs} 
                onDelete={handleDelete} 
                open={deleteOpen}
            />

            {/* Paginación */}
            <Box className="paginator-container">
                <Box className="pagination-info">
                    <Typography variant="body2" color="textSecondary">
                        {paginate.totalItems > 0 
                            ? `${paginate.page * paginate.perPage - paginate.perPage + 1}-${Math.min(paginate.page * paginate.perPage, paginate.totalItems)} de ${paginate.totalItems}`
                            : '0-0 de 0'
                        }
                    </Typography>
                </Box>
                <Pagination
                    count={paginate.totalPages}
                    page={paginate.page}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    onChange={(event, page) => { onChange(page) }}
                />
            </Box>
        </div>
    );
}

export default styled(Table)`
    display: flex;
    flex-direction: column;

    .paginator-container {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: row;
        gap: 16px;
    }

    .student-cell, .school-year-cell {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .student-icon, .calendar-icon {
        color: #6E6E6E;
    }
    
    .courses-chip {
        font-size: 12px;
        height: 24px;
        border-radius: 12px;
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 8px;
    }

    .action-btn {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .detail-btn {
        color: #3f6ad8;
    }

    .edit-btn {
        color: #0A8FDC;
    }

    .delete-btn {
        color: #e63946;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        gap: 16px;
    }

    .create-btn {
        text-transform: none;
        font-weight: 500;
    }
`;
