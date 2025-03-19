import { Button, Pagination } from '@mui/material';
import DynamicTable from 'components/DynamicTable';
import { User } from 'core/users/types';
import styled from 'styled-components';
// Own
import { useAppDispatch } from 'store/index';
import { setIsLoading, setSuccessMessage, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';
import { FunctionComponent, useCallback, useState } from 'react';
import { PaginateData } from 'services/types';
import { IconEdit, IconTrash } from '@tabler/icons';
import { useNavigate } from 'react-router';
import deleteUser from 'services/users/delete-user';
import DialogDelete from 'components/dialogDelete';

const Table: FunctionComponent<Prop> = ({ items, paginate, className, onChange, fetchItems }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState<boolean>(false)
    const [id, setUserDni] = useState<string>('')

    const handleOpen = useCallback((id: string) => {
        setOpen(true);
        setUserDni(id);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        setUserDni('');
    }, []);

    const onDelete = useCallback(async (id: string) => {
        try {
            dispatch(setIsLoading(true));
          //  await deleteUser(id!);
            //navigate('/Users');
            dispatch(setSuccessMessage(`Usuario eliminado correctamente`));
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

    return (
        <div className={className}>
            <DynamicTable
                headers={[
                    { columnLabel: 'Id', fieldName: 'id', cellAlignment: 'left' },
                    { columnLabel: 'Nombre', fieldName: 'name', cellAlignment: 'left' },
                    { columnLabel: 'Correo electrónico', fieldName: 'email', cellAlignment: 'left' },
                    { columnLabel: 'Rol', fieldName: 'role', cellAlignment: 'left' },
                ]}
                rows={items} components={[
                    (row: User) =>
                        <Button
                            color="primary"
                            onClick={() => { navigate('/users/edit/' + row.id) }}
                            startIcon={<IconEdit />}
                        >
                            Editar
                        </Button>,
                    (row: User) =>
                        <Button
                            color="secondary"
                            onClick={() => handleOpen(row.id)}
                            startIcon={<IconTrash />}
                        >
                            Eliminar
                        </Button>
                ]}
            />
            <DialogDelete
                handleClose={handleClose}
                onDelete={() => { onDelete(id) }}
                open={open}
            />

            <div className={'paginator-container'}>
                <Pagination
                    count={paginate.pages}
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
    items: User[];
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
