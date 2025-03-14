import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import { Employees, EmployeeRole } from 'core/employees/types'

const EmployeesPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employees[]>([])
  const [paginate, setPaginate] = useState({
    total: 11,
    page: 1,
    perPage: 10,
    pages: 2
  })

  // Function to get a random role
  const getRandomRole = (): EmployeeRole => {
    const roles = Object.values(EmployeeRole)
    return roles[Math.floor(Math.random() * roles.length)]
  }

  useEffect(() => {
    // Generating dummy employees with random roles
    const dummyEmployees: Employees[] = Array.from({ length: 10 }, (_, i) => ({
      employeeDni: `200${i + 1}`,
      name: `Empleado ${i + 1}`,
      lastName: `Apellido ${i + 1}`,
      email: `empleado${i + 1}@example.com`,
      address: `Dirección ${i + 1}`,
      phone: `555-00${i + 1}`,
      role: getRandomRole() // Assigning a random role
    }))
    setEmployees(dummyEmployees)
  }, [])

  const goToCreate = useCallback(() => {
    navigate('/employees/create')
  }, [navigate])
  return (
    <MainCard
      className={className}
      headerClass={'page-header'}
      title={
        <div className={'page-header'}>
          <Typography variant='h3' className={'title-header'}>
            Empleados
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
        items={employees}
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

export default styled(EmployeesPage)`
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
