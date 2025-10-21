import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField
} from '@mui/material'
import { useAppDispatch } from 'store'
import {
  setErrorMessage,
  setIsLoading,
  setSuccessMessage
} from 'store/customizationSlice'
import updateContract from 'services/contracts/update-contract'
import { Employees, TypeEmployee } from 'core/employees/types'

type ContractType = 'worker' | 'professor'

type Props = {
  dni: string
  contract: any
  onSaved?: (contract: any) => void
  onCancel?: () => void
}

const EditContract = ({ dni, contract, onSaved, onCancel }: Props) => {
  const dispatch = useAppDispatch()
  const employee: Employees | undefined = contract?.employee
  const initialType: ContractType =
    employee?.employeeType === TypeEmployee.Worker ? 'worker' : 'professor'
  const [contractType] = useState<ContractType>(initialType)
  const [values, setValues] = useState({
    dni: String(contract?.dni ?? dni ?? ''),
    position: String(contract?.position ?? ''),
    // worker only
    qualification: String(contract?.qualification ?? ''),
    grade: String(contract?.grade ?? ''),
    level: String(contract?.level ?? ''),
    workingHours: String(contract?.workingHours ?? ''),
    hoursWorked: String(contract?.hoursWorked ?? ''),
    hourlyCost: String(contract?.hourlyCost ?? ''),
    // worker
    yearsOfServiceAvec: contract?.yearsOfServiceAvec ?? 0,
    yearsOfServiceExternal: contract?.yearsOfServiceExternal ?? 0,
    yearsOfServiceOtherAvec: contract?.yearsOfServiceOtherAvec ?? 0,
    // professor
    yearsOfService: contract?.yearsOfService ?? 0,
    monthlySalary: String(contract?.monthlySalary ?? ''),
    totalSalary: String(contract?.totalSalary ?? ''),
    nightBonus: String(contract?.nightBonus ?? ''),
    transport: Boolean(contract?.transport ?? false),
    antique: String(contract?.antique ?? ''),
    bonusAcademic: String(contract?.bonusAcademic ?? ''),
    nroOfChildren: contract?.nroOfChildren ?? 0,
    bonusCompensatory: String(contract?.bonusCompensatory ?? ''),
    bonusForChildren: String(contract?.bonusForChildren ?? ''),
    geography: String(contract?.geography ?? ''),
    homeCareAssistance: String(contract?.homeCareAssistance ?? ''),
    bonusDisability: String(contract?.bonusDisability ?? ''),
    // professor only
    category: String(contract?.category ?? ''),
    hierarchy: String(contract?.hierarchy ?? ''),
    teachingExercise: String(contract?.teachingExercise ?? ''),
    postgraduate: String(contract?.postgraduate ?? '')
  })

  // Debug logs removed

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const onToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setValues((prev) => ({ ...prev, [name]: checked }))
  }, [])

  const isValid = useMemo(() => {
    const base = Boolean(
      values.dni &&
        values.position &&
        values.level &&
        values.workingHours &&
        values.hourlyCost &&
        values.monthlySalary &&
        values.totalSalary
    )
    if (contractType === 'worker') {
      return base && values.hoursWorked !== '' && values.antique !== ''
    } else {
      return base && values.category !== '' && values.hierarchy !== ''
    }
  }, [values, contractType])

  const onSubmit = useCallback(async () => {
    try {
      dispatch(setIsLoading(true))
      const payload: any = {
        dni: values.dni,
        position: values.position,
        level: values.level,
        workingHours: values.workingHours,
        hoursWorked: values.hoursWorked,
        hourlyCost: values.hourlyCost,
        monthlySalary: values.monthlySalary,
        transport: values.transport,
        antique: values.antique,
        nroOfChildren: values.nroOfChildren,
        bonusForChildren: values.bonusForChildren,
        geography: values.geography,
        homeCareAssistance: values.homeCareAssistance,
        bonusDisability: values.bonusDisability,
        totalSalary: values.totalSalary
      }
      let saved
      if (contractType === 'worker') {
        Object.assign(payload, {
          qualification: values.qualification,
          grade: values.grade,
          nightBonus: values.nightBonus,
          bonusAcademic: values.bonusAcademic,
          bonusCompensatory: values.bonusCompensatory,
          yearsOfServiceAvec: Number(values.yearsOfServiceAvec) || 0,
          yearsOfServiceExternal: Number(values.yearsOfServiceExternal) || 0,
          yearsOfServiceOtherAvec: Number(values.yearsOfServiceOtherAvec) || 0
        })
      } else {
        Object.assign(payload, {
          category: values.category,
          hierarchy: values.hierarchy,
          teachingExercise: values.teachingExercise,
          postgraduate: values.postgraduate,
          yearsOfService: Number(values.yearsOfService) || 0
        })
      }
      saved = await updateContract(contract.uuid, payload)
      dispatch(setSuccessMessage('Contrato actualizado correctamente'))
      onSaved?.(saved)
    } catch (err: any) {
      dispatch(
        setErrorMessage(
          err?.response?.data?.message || 'Error al actualizar el contrato'
        )
      )
    } finally {
      dispatch(setIsLoading(false))
    }
  }, [dispatch, onSaved, contract.uuid, values, contractType])

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tipo de contrato</InputLabel>
            <Select label='Tipo de contrato' value={contractType} disabled>
              <MenuItem value={'worker'}>Worker</MenuItem>
              <MenuItem value={'professor'}>Professor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='DNI'
            name='dni'
            value={values.dni}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Cargo'
            name='position'
            value={values.position}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        {contractType === 'worker' && (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                label='Calificación'
                name='qualification'
                value={values.qualification}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label='Grado'
                name='grade'
                value={values.grade}
                onChange={onChange}
                fullWidth
              />
            </Grid>
          </>
        )}
        {contractType === 'professor' && (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                label='Categoría'
                name='category'
                value={values.category}
                onChange={onChange}
                fullWidth
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} md={4}>
          <TextField
            label='Nivel'
            name='level'
            value={values.level}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Horas de Jornada'
            name='workingHours'
            value={values.workingHours}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Horas Trabajadas'
            name='hoursWorked'
            value={values.hoursWorked}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Costo por Hora'
            name='hourlyCost'
            value={values.hourlyCost}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        {contractType === 'worker' ? (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                type='number'
                label='Años de Servicio AVEC'
                name='yearsOfServiceAvec'
                value={values.yearsOfServiceAvec}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type='number'
                label='Años de Servicio Externo'
                name='yearsOfServiceExternal'
                value={values.yearsOfServiceExternal}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type='number'
                label='Años de Servicio Otros AVEC'
                name='yearsOfServiceOtherAvec'
                value={values.yearsOfServiceOtherAvec}
                onChange={onChange}
                fullWidth
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                type='number'
                label='Años de Servicio'
                name='yearsOfService'
                value={values.yearsOfService}
                onChange={onChange}
                fullWidth
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} md={4}>
          <TextField
            label='Salario Mensual'
            name='monthlySalary'
            value={values.monthlySalary}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Salario Total'
            name='totalSalary'
            value={values.totalSalary}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        {contractType === 'worker' && (
          <Grid item xs={12} md={4}>
            <TextField
              label='Bono Nocturno'
              name='nightBonus'
              value={values.nightBonus}
              onChange={onChange}
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={values.transport}
                onChange={onToggle}
                name='transport'
              />
            }
            label='Transporte'
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Antigüedad'
            name='antique'
            value={values.antique}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        {contractType === 'worker' && (
          <Grid item xs={12} md={4}>
            <TextField
              label='Bono Académico'
              name='bonusAcademic'
              value={values.bonusAcademic}
              onChange={onChange}
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={12} md={4}>
          <TextField
            type='number'
            label='Nro. de Hijos'
            name='nroOfChildren'
            value={values.nroOfChildren}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        {contractType === 'worker' && (
          <Grid item xs={12} md={4}>
            <TextField
              label='Bono Compensatorio'
              name='bonusCompensatory'
              value={values.bonusCompensatory}
              onChange={onChange}
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={12} md={4}>
          <TextField
            label='Bono por Hijos'
            name='bonusForChildren'
            value={values.bonusForChildren}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Geografía'
            name='geography'
            value={values.geography}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Asistencia Domiciliaria'
            name='homeCareAssistance'
            value={values.homeCareAssistance}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label='Bono Discapacidad'
            name='bonusDisability'
            value={values.bonusDisability}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        {contractType === 'professor' && (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                label='Jerarquía'
                name='hierarchy'
                value={values.hierarchy}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label='Ejercicio Docente'
                name='teachingExercise'
                value={values.teachingExercise}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label='Postgrado'
                name='postgraduate'
                value={values.postgraduate}
                onChange={onChange}
                fullWidth
              />
            </Grid>
          </>
        )}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
        <Button variant='outlined' color='secondary' onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={onSubmit}
          disabled={!isValid}
        >
          Guardar cambios
        </Button>
      </Box>
    </Box>
  )
}

export default EditContract
