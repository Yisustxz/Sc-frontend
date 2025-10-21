import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography, Card, Button } from '@mui/material'
import { styled } from 'styled-components'
import { useParams } from 'react-router'
import getEmployee from 'services/employees/get-employee'
import getAllEmployees from 'services/employees/get-all-employees'
import { Employees } from 'core/employees/types'
import CreateContract from './CreateContract'
import EditContract from './EditContract'
import { API_BASE_URL } from 'config/constants'
import store from 'store'
// Delete contract UI removed per request; keeping only edit functionality

const contractFields = [
  { key: 'dni', label: 'DNI' },
  { key: 'position', label: 'Cargo' },
  { key: 'qualification', label: 'Calificación' },
  { key: 'grade', label: 'Grado' },
  { key: 'level', label: 'Nivel' },
  { key: 'workingHours', label: 'Horas de Jornada' },
  { key: 'hoursWorked', label: 'Horas Trabajadas' },
  { key: 'hourlyCost', label: 'Costo por Hora' },
  { key: 'yearsOfServiceAvec', label: 'Años de Servicio AVEC' },
  { key: 'yearsOfServiceExternal', label: 'Años de Servicio Externo' },
  { key: 'yearsOfServiceOtherAvec', label: 'Años de Servicio Otros AVEC' },
  { key: 'monthlySalary', label: 'Salario Mensual' },
  { key: 'nightBonus', label: 'Bono Nocturno' },
  { key: 'transport', label: 'Transporte' },
  { key: 'antique', label: 'Antigüedad' },
  { key: 'bonusAcademic', label: 'Bono Académico' },
  { key: 'nroOfChildren', label: 'Nro. de Hijos' },
  { key: 'bonusCompensatory', label: 'Bono Compensatorio' },
  { key: 'bonusForChildren', label: 'Bono por Hijos' },
  { key: 'geography', label: 'Geografía' },
  { key: 'homeCareAssistance', label: 'Asistencia Domiciliaria' },
  { key: 'bonusDisability', label: 'Bono Discapacidad' },
  { key: 'totalSalary', label: 'Salario Total' }
]
const ContractsPage = ({ className }: { className?: string }) => {
  const { dni } = useParams<{ dni: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState<Employees | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  // delete flow removed
  useEffect(() => {
    if (!dni) return
    // Resetear el empleado para evitar mostrar un nombre anterior mientras carga el nuevo
    setEmployee(null)
    setLoading(true)
    axios
      .get(`${API_BASE_URL}/contracts/${dni}`, {
        headers: { Authorization: `Bearer ${store.getState().auth.token}` }
      })
      .then((res) => {
        setData(res.data)
        setNotFound(false)
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setNotFound(true)
        }
        setData(null)
      })
      .finally(() => setLoading(false))
  }, [dni])
  // Cargar nombre/apellido por DNI para header (útil cuando no hay contrato)
  useEffect(() => {
    if (!dni) return
    let active = true
    ;(async () => {
      try {
        const list = await getAllEmployees({ dni })
        if (active) {
          const exact = Array.isArray(list)
            ? list.find((e) => String(e.dni) === String(dni)) || null
            : null
          setEmployee(exact)
        }
      } catch {
        if (active) setEmployee(null)
      }
    })()
    return () => {
      active = false
    }
  }, [dni])
  // Cargar datos de la persona (nombre/apellido) usando el id del empleado
  useEffect(() => {
    const employeeId = data?.employee?.id

    if (!employeeId) return
    let active = true
    ;(async () => {
      try {
        const emp = await getEmployee(employeeId)
        if (active) {
          setEmployee(emp)
        }
      } catch (e) {
        if (active) setEmployee(null)
      }
    })()
    return () => {
      active = false
    }
  }, [data?.employee?.id])

  if (loading) return <Typography>Cargando datos de nómina...</Typography>
  if (notFound || !data) {
    return (
      <div className={className}>
        <div className='page-header'>
          <Typography variant='h3' className='title-header'>
            Crear contrato de{' '}
            {employee ? `${employee.name} ${employee.lastName}` : ''}{' '}
          </Typography>
        </div>
        <CreateContract
          dni={dni || ''}
          onCreated={() => {
            // Refrescar datos tras crear
            setNotFound(false)
            setLoading(true)
            axios
              .get(`${API_BASE_URL}/contracts/${dni}`, {
                headers: {
                  Authorization: `Bearer ${store.getState().auth.token}`
                }
              })
              .then((res) => setData(res.data))
              .finally(() => setLoading(false))
          }}
        />
      </div>
    )
  }

  const refetch = () => {
    if (!dni) return
    setLoading(true)
    axios
      .get(`${API_BASE_URL}/contracts/${dni}`, {
        headers: { Authorization: `Bearer ${store.getState().auth.token}` }
      })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }
  // delete flow removed

  const knownKeys = new Set(contractFields.map((f) => f.key))
  const skipKeys = new Set(['uuid', 'employee'])
  const formatLabel = (key: string) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
  const items = [
    ...contractFields.map((field) => ({
      label: field.label,
      value: String(data[field.key] ?? '')
    })),
    ...Object.keys(data)
      .filter((k) => !knownKeys.has(k) && !skipKeys.has(k))
      .map((k) => ({ label: formatLabel(k), value: String(data[k] ?? '') })),
    ...(data.employee
      ? [
          { label: 'ID Empleado', value: String(data.employee.id ?? '') },
          {
            label: 'Tipo de Empleado',
            value: String(data.employee.employeeType ?? '')
          }
        ]
      : [])
  ]
  const rows = []
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3))
  }
  return (
    <div key={dni} className={className}>
      <div className='page-header'>
        <Typography variant='h3' className='title-header'>
          {(() => {
            const empName = data?.employee?.name || employee?.name
            const empLast = data?.employee?.lastName || employee?.lastName
            return empName || empLast
              ? `Nómina de ${empName ?? ''} ${empLast ?? ''}`.trim()
              : 'Nómina del empleado'
          })()}{' '}
        </Typography>
        <div className='actions'>
          {!isEditing ? (
            <>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => setIsEditing(true)}
                disabled={!data?.uuid}
              >
                Editar contrato
              </Button>
            </>
          ) : (
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setIsEditing(false)}
            >
              Cancelar edición
            </Button>
          )}
        </div>
      </div>
      {isEditing ? (
        <EditContract
          dni={dni || ''}
          contract={data}
          onSaved={(updated) => {
            setIsEditing(false)
            setData(updated)
            // optional: refetch to ensure consistency
            refetch()
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Box sx={{ p: 3 }}>
          {rows.map((row, idx) => (
            <div key={idx} className='row-container'>
              {row.map((item, j) => (
                <Card key={j} className='contract-card'>
                  <Typography variant='subtitle2'>{item.label}</Typography>
                  <Typography>{item.value}</Typography>
                </Card>
              ))}
            </div>
          ))}
        </Box>
      )}
      {/* Delete dialog removed */}
    </div>
  )
}

export default styled(ContractsPage)`
  width: 100%;
  display: flex;
  flex-direction: column;

  .page-header {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: 24px;
  }

  .title-header {
    font-weight: 600;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .row-container {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  .contract-card {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
  }
`
