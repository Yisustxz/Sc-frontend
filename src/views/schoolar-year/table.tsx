import { Button, Pagination, Chip, Typography, Box } from '@mui/material'
import DynamicTable from 'components/DynamicTable'
import styled from 'styled-components'
import { useAppDispatch } from 'store/index'
import {
  setIsLoading,
  setSuccessMessage,
  setErrorMessage
} from 'store/customizationSlice'
import BackendError from 'exceptions/backend-error'
import { FunctionComponent, useCallback, useState } from 'react'
import { PaginateData } from 'services/types'
import { IconEdit, IconTrash, IconPlus, IconCalendar } from '@tabler/icons'
import { useNavigate } from 'react-router'
import DialogDelete from 'components/dialogDelete'
import { SchoolarYear } from 'core/schoolar-year/types'
import deleteSchoolarYear from 'services/schoolar-year/delete-schoolar-year'

const Table: FunctionComponent<Prop> = ({
  items,
  paginate,
  className,
  onChange,
  fetchItems
}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState<boolean>(false)
  const [yearId, setYearId] = useState<number | null>(null)

  const handleOpen = useCallback((id: number) => {
    setOpen(true)
    setYearId(id)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setYearId(null)
  }, [])

  const onDelete = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        await deleteSchoolarYear(id)
        dispatch(setSuccessMessage(`Año escolar eliminado correctamente`))
      } catch (error) {
        if (error instanceof BackendError) {
          dispatch(setErrorMessage(error.getMessage()))
        }
      } finally {
        dispatch(setIsLoading(false))
        handleClose()
        fetchItems()
      }
    },
    [dispatch, fetchItems, handleClose]
  )

  // Formato de fecha para mostrar en la tabla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className={className}>
      <Box className="table-header">
        <Typography variant="h5" className="table-title">Años escolares</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<IconPlus />}
          onClick={() => navigate('/schoolar-year/create')}
          className="add-button"
        >
          Agregar
        </Button>
      </Box>
      
      <DynamicTable
        headers={[
          { columnLabel: 'ID', fieldName: 'id', cellAlignment: 'center' },
          { columnLabel: 'Código', fieldName: 'code', cellAlignment: 'left' },
          {
            columnLabel: 'Fecha de inicio',
            cellAlignment: 'left',
            onRender: (row: SchoolarYear) => (
              <Box className="date-cell">
                <IconCalendar size={16} className="date-icon" />
                <span>{formatDate(row.startDate)}</span>
              </Box>
            )
          },
          {
            columnLabel: 'Fecha de fin',
            cellAlignment: 'left',
            onRender: (row: SchoolarYear) => (
              <Box className="date-cell">
                <IconCalendar size={16} className="date-icon" />
                <span>{formatDate(row.endDate)}</span>
              </Box>
            )
          }
        ]}
        rows={items}
        components={[
          (row: SchoolarYear) => (
            <Button
              color='primary'
              variant="outlined"
              size="small"
              onClick={() => navigate('/schoolar-year/edit/' + row.id)}
              startIcon={<IconEdit size={18} />}
              className="edit-button"
            >
              Editar
            </Button>
          ),
          (row: SchoolarYear) => (
            <Button
              color='error'
              variant="outlined"
              size="small"
              onClick={() => handleOpen(row.id)}
              startIcon={<IconTrash size={18} />}
              className="delete-button"
            >
              Eliminar
            </Button>
          )
        ]}
        emptyState={
          <Box className="empty-state">
            <Typography variant="subtitle1">No hay años escolares registrados</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<IconPlus />}
              onClick={() => navigate('/schoolar-year/create')}
              className="add-button-empty"
            >
              Agregar año escolar
            </Button>
          </Box>
        }
      />
      <DialogDelete
        handleClose={handleClose}
        onDelete={() => {
          if (yearId !== null) onDelete(yearId)
        }}
        open={open}
      />

      <div className={'paginator-container'}>
        <Pagination
          count={paginate.totalPages}
          page={paginate.page}
          variant='outlined'
          shape='rounded'
          color='primary'
          onChange={(event, page) => {
            onChange(page)
          }}
        />
      </div>
    </div>
  )
}

interface Prop {
  items: SchoolarYear[]
  paginate: PaginateData
  className?: string
  onChange: (page: number) => void
  fetchItems: () => void
}

export default styled(Table)`
  display: flex;
  flex-direction: column;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 0 4px;
  }

  .table-title {
    font-weight: 500;
    font-size: 1.3rem;
  }

  .add-button {
    text-transform: none;
    border-radius: 8px;
    padding: 8px 24px;
    font-weight: 500;
  }

  .date-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }

  .date-icon {
    color: #616161;
  }
  
  .edit-button, .delete-button {
    border-radius: 6px;
    text-transform: none;
    margin: 0 6px;
    padding: 6px 16px;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    gap: 24px;
  }

  .add-button-empty {
    text-transform: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-weight: 500;
  }

  .paginator-container {
    margin-top: 32px;
    padding: 16px 0;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
`
