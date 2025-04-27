import { FunctionComponent, useCallback } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography, TextField, InputAdornment, Box } from '@mui/material'
import { IconCirclePlus, IconSearch } from '@tabler/icons'
import usePaginate from './use-paginate'

const StudentsPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const { students, paginate, setPage, fetchStudents, setSearchTerm } = usePaginate()
  
  const goToCreate = useCallback(() => {
    navigate('/students/create')
  }, [navigate])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  return (
    <MainCard
      className={className}
      headerClass={'page-header'}
      title={
        <div className={'page-header'}>
          <Typography variant='h3' className={'title-header'}>
            Alumnos
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
        items={students}
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

  .actions-container {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .search-field {
    width: 280px;
  }
`
