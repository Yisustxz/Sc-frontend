import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import usePaginate from './use-paginate'

const StudentsPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const { Students, paginate, setPage, fetchStudents } = usePaginate()
  const goToCreate = useCallback(() => {
    navigate('/students/create')
  }, [navigate])
  return (
    <MainCard
      className={className}
      headerClass={'page-header'}
      title={
        <div className={'page-header'}>
          <Typography variant='h3' className={'title-header'}>
            Alumnos
          </Typography>
          <Button
            color='primary'
            variant={'outlined'}
            onClick={goToCreate}
            startIcon={<IconCirclePlus />}
          >
            Crear
          </Button>
        </div>
      }
    >
      <Table
        items={Students}
        paginate={paginate}
        onChange={setPage}
        fetchItems={fetchStudents}
      />
    </MainCard>
  )
}

interface Props {
  className?: string
}

export default styled(StudentsPage)`
  width: 100%;
  display: flex;
  flex-direction: column;

  .page-header {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
`
