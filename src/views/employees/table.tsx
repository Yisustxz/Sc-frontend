import { Button, Pagination } from '@mui/material'
import DynamicTable from 'components/DynamicTable'
import { Employees } from 'core/employees/types'
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
import deleteEmployee from 'services/employees/delete-employee'

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
  const [employeeId, setemployeeId] = useState<number>(0)

  const handleOpen = useCallback((employeeId: number) => {
    setOpen(true)
    setemployeeId(employeeId)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setemployeeId(0)
  }, [])

  const onDelete = useCallback(
    async (employeeId: number) => {
      try {
        dispatch(setIsLoading(true))
        await deleteEmployee(employeeId)
        dispatch(setSuccessMessage(`Empleado eliminado correctamente`))
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
            fieldName: 'dni',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Nombre',
            fieldName: 'fullName',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'telefono',
            fieldName: 'phone',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Dirección',
            fieldName: 'direction',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Fecha de nacimiento',
            fieldName: 'birthDate',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Tipo de empleado',
            fieldName: 'employeeType',
            cellAlignment: 'left'
          }
        ]}
        rows={formattedItems}
        components={[
          (row: Employees) => (
            <Button
              color='primary'
              onClick={() => {
                navigate('/Employees/edit/' + row.id)
              }}
              startIcon={<IconEdit />}
            >
              Editar
            </Button>
          ),
          (row: Employees) => (
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
          onDelete(employeeId)
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
  items: Employees[]
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
