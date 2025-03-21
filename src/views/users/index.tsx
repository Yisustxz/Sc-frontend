/* import { FunctionComponent, useCallback, useState } from 'react'
import MainCard from 'components/cards/MainCard'
import Table from './table'
import usePaginate from './use-paginate'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import { Button, Typography } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons'
import { User } from 'core/users/types'

const UsersPage: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const [paginate, setPaginate] = useState({
    total: 11,
    page: 1,
    perPage: 10,
    pages: 2
  })
  //const { users, paginate, setPage, fetchUsers } = usePaginate();
  const [users, setUsers] = useState<User[]>([])

  const goToCreate = useCallback(() => {
    navigate('/users/create')
  }, [navigate])

  return (
    <MainCard
      className={className}
      headerClass={'page-header'}
      title={
        <div className={'page-header'}>
          <Typography variant='h3' className={'title-header'}>
            Usuarios
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
        items={users}
        paginate={paginate}
        onChange={(page: number) => setPaginate((prev) => ({ ...prev, page }))}
        //onChange={setPage}
        //fetchItems={fetchUsers}/>
        fetchItems={() => {}}
      />
    </MainCard>
  )
}

interface Props {
  className?: string
}

export default styled(UsersPage)`
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
 */
