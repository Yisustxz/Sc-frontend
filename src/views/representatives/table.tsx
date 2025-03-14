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
  const [representativeDni, setRepresentativeDni] = useState<string>('')

  const handleOpen = useCallback((representativeDni: string) => {
    setOpen(true)
    setRepresentativeDni(representativeDni)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setRepresentativeDni('')
  }, [])

  const onDelete = useCallback(
    async (representativeDni: string) => {
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
            fieldName: 'representativeDni',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Nombre',
            fieldName: 'fullName',
            cellAlignment: 'left'
          },
          {
            columnLabel: 'Correo electrónico',
            fieldName: 'email',
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
          }
        ]}
        rows={formattedItems}
        components={[
          (row: Representatives) => (
            <Button
              color='primary'
              onClick={() => {
                navigate('/representatives/edit/' + row.representativeDni)
              }}
              startIcon={<IconEdit />}
            >
              Editar
            </Button>
          ),
          (row: Representatives) => (
            <Button
              color='secondary'
              onClick={() => handleOpen(row.representativeDni)}
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
          onDelete(representativeDni)
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
