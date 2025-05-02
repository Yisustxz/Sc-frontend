import { Button, Pagination, Box, Typography } from '@mui/material';
import DynamicTable from 'components/DynamicTable';
import styled from 'styled-components';
import { useAppDispatch } from 'store/index';
import { setIsLoading, setSuccessMessage, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';
import { FunctionComponent, useCallback, useState } from 'react';
import { 
    IconEdit, 
    IconTrash, 
    IconEye, 
    IconPlus, 
    IconUser, 
    IconUsers, 
    IconSchool, 
    IconCalendar,
    IconBook
} from '@tabler/icons';
import deleteInscription from 'services/inscriptions/delete-inscription';
import DialogDelete from 'components/dialogDelete';
import { useNavigate } from 'react-router';
import { InscriptionDto } from 'core/inscriptions/types/index';
import { EducationLevels, gradeMapping } from 'core/courses/use-education-levels';

interface Props {
    items: InscriptionDto[];
    paginate: { totalItems: number; page: number; perPage: number; totalPages: number };
    className?: string;
    onChange: (page: number) => void;
    fetchItems: () => void;
}

    // Función para convertir número de grado a texto
const getGradeLabel = (grade: number): string => {
        if (grade >= 1 && grade <= 11) {
            return gradeMapping[grade as EducationLevels] || `Grado ${grade}`;
    }
    return `Grado ${grade}`;
};


const Table: FunctionComponent<Props> = ({ items, paginate, className, onChange, fetchItems }) => {
    const dispatch = useAppDispatch();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<InscriptionDto | null>(null);
    const navigate = useNavigate();

    // Manejador para abrir diálogo de eliminación
    const handleOpenDelete = useCallback((item: InscriptionDto) => {
        setSelectedItem(item);
        setDeleteOpen(true);
    }, []);

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
            await deleteInscription(selectedItem.id);
            dispatch(setSuccessMessage('Inscripción eliminada correctamente'));
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

    return (
        <div className={className}>
            <DynamicTable
                headers={[
                    { columnLabel: 'ID', fieldName: 'id', cellAlignment: 'left' },
                    { columnLabel: 'Estudiante', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        <Box className="student-cell">
                            <IconUser className="icon" size={20} />
                            <div className="student-info">
                                <div className="student-name">
                                    {row.student?.name} {row.student?.lastName || ''}
                                </div>
                                {row.student?.dni && (
                                    <div className="student-dni">
                                        <small>CI: {row.student.dni}</small>
                                    </div>
                                )}
                            </div>
                        </Box>
                    ) },
                    { columnLabel: 'Representante', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        <Box className="representative-cell">
                            <IconUsers className="icon" size={20} />
                            {row.representative ? (
                                <div className="representative-info">
                                    <div className="representative-name">
                                        {row.representative.name} {row.representative.lastName || ''}
                                    </div>
                                    {row.representative.dni && (
                                        <div className="representative-dni">
                                            <small>CI: {row.representative.dni}</small>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span>Sin representante</span>
                            )}
                        </Box>
                    ) },
                    { columnLabel: 'Grado', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        <Box className="grade-cell">
                            <IconSchool className="icon" size={20} />
                            <span>{getGradeLabel(+row.grade) || 'No especificado'}</span>
                        </Box>
                    ) },
                    { columnLabel: 'Cursos', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        <Box className="course-cell">
                            <IconBook className="icon" size={20} />
                            <span>{row.courseInscriptions?.length || 'Sin cursos'}</span>
                        </Box>
                    ) },
                    { columnLabel: 'Año Escolar', cellAlignment: 'left', onRender: (row: InscriptionDto) => (
                        <Box className="school-year-cell">
                            <IconCalendar className="icon" size={20} />
                            <span>{row.schoolYear?.code || 'Sin año escolar'}</span>
                        </Box>
                    ) },
                ]}
                rows={items} components={[
                    (row: InscriptionDto) =>
                        <Button
                            color="info"
                            onClick={() => navigate('/inscriptions/edit/' + row.id)}
                            startIcon={<IconEye />}
                        >
                            Detalle
                        </Button>,
                    (row: InscriptionDto) =>
                        <Button
                            color="primary"
                            onClick={() => navigate('/inscriptions/edit/' + row.id)}
                            startIcon={<IconEdit />}
                        >
                            Editar
                        </Button>,
                    (row: InscriptionDto) =>
                        <Button
                            color="secondary"
                            onClick={() => handleOpenDelete(row)}
                            startIcon={<IconTrash />}
                        >
                            Eliminar
                        </Button>
                ]}
                        emptyState={
                            <Box className="empty-state">
                                <Typography variant="subtitle1">No se encontraron inscripciones</Typography>
                                <Button 
                                color='primary'
                                variant='outlined'
                                startIcon={<IconPlus />}
                                onClick={() => navigate('/inscriptions/create')}
                                >
                                Agregar
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

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        gap: 16px;
    }

    .student-cell, .representative-cell, .course-cell, .school-year-cell, .grade-cell {
        display: flex;
        align-items: flex-start;
        gap: 8px;
    }

    .icon {
        color: #6c757d;
        margin-top: 2px;
    }

    .student-info, .representative-info {
        display: flex;
        flex-direction: column;
    }

    .student-name, .representative-name {
        font-weight: 500;
    }

    .student-dni, .representative-dni {
        color: rgba(0, 0, 0, 0.6);
    }
`;
