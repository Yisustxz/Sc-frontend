import { FunctionComponent, useCallback, useState } from 'react'
import MainCard from 'components/cards/MainCard'
import { useNavigate } from 'react-router'
import usePaginate from './use-paginate'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import Table from './table'

const SchoolarYearPage: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const { schoolarYear, paginate, setPage, fetchSchoolarYear } = usePaginate()
  const goToCreate = useCallback(() => {
    navigate('/schoolar-year/create')
  }, [navigate])

  return (
    <MainCard
      className={className}
      headerClass={'page-header'}
      title={
        <div className={'page-header'}>
          <Typography variant='h3' className={'title-header'}>
            Años escolares
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
        items={schoolarYear}
        paginate={paginate}
        onChange={setPage}
        fetchItems={fetchSchoolarYear}
      />
    </MainCard>
  )
}

interface Props {
  className?: string
}

export default styled(SchoolarYearPage)`
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
