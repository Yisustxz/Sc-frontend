import { Button, Pagination } from '@mui/material'
import DynamicTable from 'components/DynamicTable'
import { Students } from 'core/students/types'
import styled from 'styled-components'
// Own
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
  const [studentDni, setstudentDni] = useState<string>('')

  const handleOpen = useCallback((studentDni: string) => {
    setOpen(true)
    setstudentDni(studentDni)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setstudentDni('')
  }, [])

  const onDelete = useCallback(
    async (studentDni: string) => {
      try {
        dispatch(setIsLoading(true))
        dispatch(setSuccessMessage(`Representante eliminado correctamente`))
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

  const formattedItems = items.map((item) => ({
    ...item,
    fullName: `${item.name} ${item.lastName}`
  }))

  return (
    <div className={className}>
      <DynamicTable
        headers={[
          {
            columnLabel: 'Cedula',
            fieldName: 'studentDni',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Nombre',
            fieldName: 'fullName',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Teléfono',
            fieldName: 'phone',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Dirección',
            fieldName: 'address',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Fecha de nacimiento',
            fieldName: 'birthdate',
            cellAlignment: 'left'
          }
        ]}
        rows={formattedItems}
        components={[
          (row: Students) => (
            <Button
              color='primary'
              onClick={() => {
                navigate('/students/edit/' + row.studentDni)
              }}
              startIcon={<IconEdit />}
            >
              Editar
            </Button>
          ),
          (row: Students) => (
            <Button
              color='secondary'
              onClick={() => handleOpen(row.studentDni)}
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
          onDelete(studentDni)
        }}
        open={open}
      />

      <div className={'paginator-container'}>
        <Pagination
          count={paginate.pages}
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
  items: Students[]
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
