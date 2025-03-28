import { FunctionComponent, useCallback, useState } from 'react'
import MainCard from 'components/cards/MainCard'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import Table from './table'

const DUMMY_DATA = [
  { id: 1, code: '2020-2021', startDate: '2020-09-01', endDate: '2021-07-31' },
  { id: 2, code: '2021-2022', startDate: '2021-09-01', endDate: '2022-07-31' },
  { id: 3, code: '2022-2023', startDate: '2022-09-01', endDate: '2023-07-31' }
]

const SchoolarYearPage: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const paginate = { totalItems: 0, page: 1, perPage: 5, totalPages: 0 }

  const goToCreate = useCallback(() => {
    navigate('/schoolar-year/create')
  }, [navigate])

  const fetchItems = useCallback(() => {
    console.log('Fetching items...') // aquí luego llamarás al servicio real
  }, [])

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
        items={DUMMY_DATA}
        paginate={paginate}
        onChange={() => setPage(page)}
        fetchItems={fetchItems}
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
