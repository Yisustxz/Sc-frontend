import { Button, Pagination } from '@mui/material';
import DynamicTable from 'components/DynamicTable';
import { Course } from 'core/courses/types';
import styled from 'styled-components';
// Own
import { useAppDispatch } from 'store/index';
import { setIsLoading, setSuccessMessage, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';
import { FunctionComponent, useCallback, useState } from 'react';
import { PaginateData } from 'services/types';
import { IconEdit, IconTrash } from '@tabler/icons';
import { useNavigate } from 'react-router';
import deleteCourse from 'services/courses/delete-course';
import DialogDelete from 'components/dialogDelete';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import { Box } from '@mui/material';
import { IconCalendar } from '@tabler/icons';   


const Table: FunctionComponent<Prop> = ({ items, paginate, className, onChange, fetchItems }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState<boolean>(false)
    const [subjectId, setSubjectId] = useState<string>('')

    const handleOpen = useCallback((subjectId: string) => {
        setOpen(true);
        setSubjectId(subjectId);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        setSubjectId('');
    }, []);

    const onDelete = useCallback(async (subjectId: string) => {
        try {
            dispatch(setIsLoading(true));
            await deleteCourse(subjectId!);
            //navigate('/courses');
            dispatch(setSuccessMessage(`Asignatura eliminada correctamente`));
        } catch (error) {
            if (error instanceof BackendError) {
                dispatch(setErrorMessage(error.getMessage()));
            }
        } finally {
            dispatch(setIsLoading(false));
            handleClose();
            fetchItems();
        }
    }, [dispatch, fetchItems, handleClose]);

    const getGradeLabel = (grade: number): string => {
        if (grade >= 1 && grade <= 11) {
            return gradeMapping[grade as EducationLevels] || grade.toString();
        }
        return grade.toString();
    };

    // Formato de fecha para mostrar en la tabla
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };


    const transformedItems = items.map(item => ({
        ...item,
        grade: getGradeLabel(item.grade)
    }));

    return (
        <div className={className}>
            <DynamicTable
                headers={[
                    { columnLabel: 'ID', fieldName: 'id', cellAlignment: 'left' },
                    { columnLabel: 'Nombre', fieldName: 'name', cellAlignment: 'left' },
                    { columnLabel: 'Grado por defecto', fieldName: 'grade', cellAlignment: 'left' },
                    { columnLabel: 'Fecha de creación', cellAlignment: 'left', onRender: (row: Course) => (
                        <Box className="date-cell">
                            <IconCalendar size={16} className="date-icon" />
                            <span>{formatDate(row.createdAt)}</span>
                        </Box>
                    ) },
                ]}
                rows={transformedItems} components={[
                    (row: Course) =>
                        <Button
                            color="primary"
                            onClick={() => { navigate('/courses/edit/'+row.id) }}
                            startIcon={<IconEdit />}
                        >
                            Editar
                        </Button>,
                    (row: Course) =>
                        <Button 
                            color="secondary" 
                            onClick={ () => handleOpen(row.id) }
                            startIcon={<IconTrash />}
                        >
                            Eliminar
                        </Button>
                ]}
            />
            <DialogDelete 
                handleClose={handleClose} 
                onDelete={() => { onDelete(subjectId) }} 
                open={open}
            />

            <div className={'paginator-container'}>
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

interface Prop {
    items: Course[];
    paginate: PaginateData;
    className?: string;
    onChange: (page: number) => void;
    fetchItems: () => void;
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
`;
