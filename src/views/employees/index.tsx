import { useCallback } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography, TextField, InputAdornment, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { IconCirclePlus, IconSearch } from '@tabler/icons'
import usePaginate from './use-paginate'
import { TypeEmployee } from 'core/employees/types'

const EmployeesPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const { 
    employees, 
    paginate, 
    setPage, 
    fetchEmployees,
    setSearchTerm,
    employeeType,
    setEmployeeType
  } = usePaginate()

  const goToCreate = useCallback(() => {
    navigate('/employees/create')
  }, [navigate])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleEmployeeTypeChange = useCallback((e: SelectChangeEvent) => {
    setEmployeeType(e.target.value);
  }, [setEmployeeType]);

  return (
    <MainCard
      className={className}
      headerClass={'page-header'}
      title={
        <div className={'page-header'}>
          <Typography variant='h3' className={'title-header'}>
            Empleados
          </Typography>
          <Box className={'actions-container'}>
            <TextField
              className={'search-field'}
              placeholder="Buscar por nombre, apellido o cédula"
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="1.1rem" />
                  </InputAdornment>
                ),
                size: "small"
              }}
              variant="outlined"
              size="small"
            />
            <FormControl
              className={'filter-field'}
              variant="outlined"
              size="small"
            >
              <InputLabel>Tipo</InputLabel>
              <Select
                value={employeeType}
                onChange={handleEmployeeTypeChange}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={TypeEmployee.Professor}>Profesor</MenuItem>
                <MenuItem value={TypeEmployee.Substitute}>Suplente</MenuItem>
                <MenuItem value={TypeEmployee.Worker}>Trabajador</MenuItem>
              </Select>
            </FormControl>
            <Button
              color='primary'
              variant={'outlined'}
              onClick={goToCreate}
              startIcon={<IconCirclePlus />}
            >
              Crear
            </Button>
          </Box>
        </div>
      }
    >
      <Table
        items={employees}
        paginate={paginate}
        onChange={setPage}
        fetchItems={fetchEmployees}
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

  .actions-container {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .search-field {
    width: 280px;
  }

  .filter-field {
    width: 150px;
  }
`
