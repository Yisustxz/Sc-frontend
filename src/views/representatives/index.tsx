import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'

const RepresentativesPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [paginate, setPaginate] = useState({
    total: 11,
    page: 1,
    perPage: 10,
    pages: 2
  })

  useEffect(() => {
    // Datos dummies para representantes
    const dummyRepresentatives: Representative[] = Array.from(
      { length: 10 },
      (_, i) => ({
        representativeDni: `100${i + 1}`,
        name: `Representante ${i + 1}`,
        lastName: `Representante ${i + 1}`,
        email: `representante${i + 1}@example.com`,
        phone: `12345678${i + 1}`,
        address: `Dirección ${i + 1}`,
        createdAt: new Date().toISOString()
      })
    )
    setRepresentatives(dummyRepresentatives)
  }, [])

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
        items={representatives}
        paginate={paginate}
        onChange={(page: number) => setPaginate((prev) => ({ ...prev, page }))}
        fetchItems={() => {}}
      />
    </MainCard>
  )
}

interface Props {
  className?: string
}

interface Representative {
  representativeDni: string
  name: string
  lastName: string
  email: string
  phone: string
  address: string
  createdAt: string
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
