import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import usePaginate from './use-paginate'

const RepresentativesPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const { Representatives, paginate, setPage, fetchRepresentatives } =
    usePaginate()

  const goToCreate = useCallback(() => {
    navigate('/representatives/create')
  }, [navigate])

  return (
    <MainCard
      className={className}
      headerClass={'page-header'}
      title={
        <div className={'page-header'}>
          <Typography variant='h3' className={'title-header'}>
            Representantes
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
        items={Representatives}
        paginate={paginate}
        onChange={setPage}
        fetchItems={fetchRepresentatives}
      />
    </MainCard>
  )
}

interface Props {
  className?: string
}

export default styled(RepresentativesPage)`
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
