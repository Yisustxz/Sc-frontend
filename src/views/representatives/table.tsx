import { Button, Pagination } from '@mui/material'
import DynamicTable from 'components/DynamicTable'
import { Representatives } from 'core/representatives/types'
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
import deleteRepresentative from 'services/representatives/delete-representatives'

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
  const [representativeId, setRepresentativeId] = useState<number>(0)

  const handleOpen = useCallback((id: number) => {
    setOpen(true)
    setRepresentativeId(id)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setRepresentativeId(0)
  }, [])

  const onDelete = useCallback(
    async (representativeid: number) => {
      try {
        dispatch(setIsLoading(true))
        await deleteRepresentative(representativeid)
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
  const formattedItems = items
    .map((item) => ({
      id: item.id,
      dni: item.dni,
      phone: item.phone,
      direction: item.direction,
      birthDate: item.birthDate,
      fullName: `${item.name ?? ''} ${item.lastName ?? ''}`
    }))
    .filter(
      (item) =>
        item.dni ||
        item.phone ||
        item.direction ||
        item.birthDate ||
        item.fullName.trim()
    )
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
            columnLabel: 'Telefono',
            fieldName: 'phone',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Dirección',
            fieldName: 'direction',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Fecha de Nacimiento',
            fieldName: 'birthDate',
            cellAlignment: 'left'
          }
        ]}
        rows={formattedItems}
        components={[
          (row: Representatives) => (
            <Button
              color='primary'
              onClick={() => {
                navigate('/representatives/edit/' + row.id)
              }}
              startIcon={<IconEdit />}
            >
              Editar
            </Button>
          ),
          (row: Representatives) => (
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
          onDelete(representativeId)
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
  items: Representatives[]
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
