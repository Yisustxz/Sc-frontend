import { useCallback } from "react"
import MainCard from "components/cards/MainCard"
import Table from "./table"
import { useNavigate } from "react-router"
import { styled } from "styled-components"
import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material"
import {
  IconCirclePlus,
  IconSearch,
  IconDownload,
  IconFileSpreadsheet
} from "@tabler/icons"
import usePaginate from "./use-paginate"
import { TypeEmployee } from "core/employees/types"
import axios from "axios"
import { API_BASE_URL } from "config/constants"
import store from "store"
import { useAppDispatch } from "store/index"
import {
  setIsLoading,
  setErrorMessage,
  setSuccessMessage
} from "store/customizationSlice"

const EmployeesPage = ({ className }: Props) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
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
    navigate("/employees/create")
  }, [navigate])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    },
    [setSearchTerm]
  )

  const handleEmployeeTypeChange = useCallback(
    (e: SelectChangeEvent) => {
      setEmployeeType(e.target.value)
    },
    [setEmployeeType]
  )

  const handleGenerateTeachersExcel = useCallback(async () => {
    try {
      dispatch(setIsLoading(true))
      const url = `${API_BASE_URL}/excel/reports/teachers/payroll`
      const res = await axios.post(url, undefined, {
        headers: { Authorization: `Bearer ${store.getState().auth.token}` }
      })
      const files = (res.data || []) as Array<{
        fileName: string
        filePath: string
      }>
      if (!Array.isArray(files) || files.length === 0) {
        dispatch(setSuccessMessage("No se generaron nóminas de profesores"))
        return
      }
      // Descargar cada archivo generado
      for (const f of files) {
        const fileName = f.fileName
        if (!fileName) continue
        try {
          const dl = await axios.get(
            `${API_BASE_URL}/excel/download/${encodeURIComponent(fileName)}`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${store.getState().auth.token}`
              }
            }
          )
          const blob = new Blob([dl.data])
          const link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(link.href)
        } catch (e) {
          // continuar con los demás, pero notificar
          dispatch(setErrorMessage(`No se pudo descargar ${fileName}`))
        }
      }
      dispatch(
        setSuccessMessage(`Nóminas de profesores generadas (${files.length})`)
      )
    } catch (error: any) {
      dispatch(
        setErrorMessage(
          error?.response?.data?.message ||
            "Error al generar nóminas de profesores"
        )
      )
    } finally {
      dispatch(setIsLoading(false))
    }
  }, [dispatch])

  const handleGenerateWorkersExcel = useCallback(async () => {
    try {
      dispatch(setIsLoading(true))
      const url = `${API_BASE_URL}/excel/reports/workers/payroll`
      const res = await axios.post(url, undefined, {
        headers: { Authorization: `Bearer ${store.getState().auth.token}` }
      })
      // El backend puede devolver un array (grupos) o un objeto único
      const files = Array.isArray(res.data)
        ? (res.data as Array<{ fileName: string; filePath: string }>)
        : [res.data]
      if (!Array.isArray(files) || files.length === 0) {
        dispatch(setSuccessMessage("No se generó nómina de empleados/obreros"))
        return
      }

      for (const f of files) {
        const fileName = f?.fileName
        if (!fileName) {
          dispatch(setErrorMessage("Archivo devuelto sin nombre"))
          continue
        }
        try {
          const dl = await axios.get(
            `${API_BASE_URL}/excel/download/${encodeURIComponent(fileName)}`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${store.getState().auth.token}`
              }
            }
          )
          const blob = new Blob([dl.data])
          const link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(link.href)
        } catch (e) {
          dispatch(setErrorMessage(`No se pudo descargar ${fileName}`))
        }
      }
      dispatch(
        setSuccessMessage(
          `Nóminas de empleados/obreros generadas (${files.length})`
        )
      )
    } catch (error: any) {
      dispatch(
        setErrorMessage(
          error?.response?.data?.message ||
            "Error al generar nómina de empleados/obreros"
        )
      )
    } finally {
      dispatch(setIsLoading(false))
    }
  }, [dispatch])

  return (
    <MainCard
      className={className}
      headerClass={"page-header"}
      title={
        <div className={"page-header"}>
          <Typography variant="h3" className={"title-header"}>
            Empleados
          </Typography>
          <Box className={"actions-container"}>
            <TextField
              className={"search-field"}
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
              className={"filter-field"}
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
              color="secondary"
              variant="outlined"
              onClick={handleGenerateWorkersExcel}
              startIcon={<IconDownload />}
            >
              Excel nómina empleados
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={handleGenerateTeachersExcel}
              startIcon={<IconDownload />}
            >
              Excel nómina profesores
            </Button>
            <Button
              color="primary"
              variant={"outlined"}
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
