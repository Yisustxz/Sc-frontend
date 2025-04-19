import { FunctionComponent, useCallback, useState } from 'react'
import MainCard from 'components/cards/MainCard'
import { useNavigate } from 'react-router'
import usePaginate from './use-paginate'
import { styled } from 'styled-components'
import { Typography, Paper, Box, Divider } from '@mui/material'
import Table from './table'

const SchoolYearPage: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const { schoolYear, paginate, setPage, fetchSchoolYear } = usePaginate()

  return (
    <div className={className}>
      <MainCard className="main-container">
        <Table
          items={schoolYear}
          paginate={paginate}
          onChange={setPage}
          fetchItems={fetchSchoolYear}
        />
      </MainCard>
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(SchoolYearPage)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 0;

  .main-container {
    padding: 32px;
    border-radius: 12px;
    height: 100%;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`
