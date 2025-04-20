import { FunctionComponent, useCallback } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import usePaginate from './use-paginate'

const SchoolYearsPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const { schoolYear, paginate, setPage, fetchSchoolYear } = usePaginate()
  
  const goToCreate = useCallback(() => {
    navigate('/school-years/create')
  }, [navigate])
  
  return (
    <MainCard
      className={className}
      headerClass={'page-header'}
      title={
        <div className={'page-header'}>
          <Typography variant='h3' className={'title-header'}>
            Años Escolares
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
        items={schoolYear}
        paginate={paginate}
        onChange={setPage}
        fetchItems={fetchSchoolYear}
      />
    </MainCard>
  )
}

interface Props {
  className?: string
}

export default styled(SchoolYearsPage)`
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