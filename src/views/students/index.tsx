import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import { Students } from 'core/students/types'

const StudentsPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Students[]>([])
  const [paginate, setPaginate] = useState({
    total: 11,
    page: 1,
    perPage: 10,
    pages: 2
  })

  useEffect(() => {
    // Generating dummy students
    const dummyStudents: Students[] = Array.from({ length: 10 }, (_, i) => ({
      studentDni: `200${i + 1}`,
      name: `Alumno ${i + 1}`,
      lastName: `Apellido ${i + 1}`,
      phone: `555-00${i + 1}`,
      address: `Dirección ${i + 1}`,
      birthdate: `200${i + 1}-0${i + 1}-0${i + 1}`
    }))
    setStudents(dummyStudents)
  }, [])

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
        items={students}
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
