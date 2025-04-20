import { Button, Pagination, Box, Typography } from '@mui/material'
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
import { SchoolYear } from 'core/school-year/types'
import deleteSchoolYear from 'services/school-year/delete-school-year'

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
        await deleteSchoolYear(id)
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
      <DynamicTable
        headers={[
          { columnLabel: 'ID', fieldName: 'id', cellAlignment: 'center' },
          { columnLabel: 'Código', fieldName: 'code', cellAlignment: 'left' },
          {
            columnLabel: 'Fecha de inicio',
            cellAlignment: 'left',
            onRender: (row: SchoolYear) => (
              <Box className="date-cell">
                <IconCalendar size={16} className="date-icon" />
                <span>{formatDate(row.startDate)}</span>
              </Box>
            )
          },
          {
            columnLabel: 'Fecha de fin',
            cellAlignment: 'left',
            onRender: (row: SchoolYear) => (
              <Box className="date-cell">
                <IconCalendar size={16} className="date-icon" />
                <span>{formatDate(row.endDate)}</span>
              </Box>
            )
          }
        ]}
        rows={items}
        components={[
          (row: SchoolYear) => (
            <Button
              color='primary'
              onClick={() => navigate('/school-years/edit/' + row.id)}
              startIcon={<IconEdit />}
            >
              Editar
            </Button>
          ),
          (row: SchoolYear) => (
            <Button
              color='secondary'
              onClick={() => handleOpen(row.id)}
              startIcon={<IconTrash />}
            >
              Eliminar
            </Button>
          )
        ]}
        emptyState={
          <Box className="empty-state">
            <Typography variant="subtitle1">No hay años escolares registrados</Typography>
            <Button 
              color='primary'
              variant='outlined'
              startIcon={<IconPlus />}
              onClick={() => navigate('/school-years/create')}
            >
              Agregar
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
  items: SchoolYear[]
  paginate: PaginateData
  className?: string
  onChange: (page: number) => void
  fetchItems: () => void
}

export default styled(Table)`
  display: flex;
  flex-direction: column;

  .date-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .date-icon {
    color: #757575;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    gap: 16px;
  }

  .paginator-container {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
`
