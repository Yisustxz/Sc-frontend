import { Button, Pagination } from '@mui/material'
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
import { IconEdit, IconTrash } from '@tabler/icons'
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

  return (
    <div className={className}>
      <DynamicTable
        headers={[
          { columnLabel: 'Código', fieldName: 'code', cellAlignment: 'left' },
          {
            columnLabel: 'Fecha de inicio',
            fieldName: 'startDate',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Fecha de fin',
            fieldName: 'endDate',
            cellAlignment: 'left'
          }
        ]}
        rows={items}
        components={[
          (row: SchoolarYear) => (
            <Button
              color='primary'
              onClick={() => navigate('/schoolar-year/edit/' + row.id)}
              startIcon={<IconEdit />}
            >
              Editar
            </Button>
          ),
          (row: SchoolarYear) => (
            <Button
              color='secondary'
              onClick={() => handleOpen(row.id)}
              startIcon={<IconTrash />}
            >
              Eliminar
            </Button>
          )
        ]}
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

  .paginator-container {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
`
