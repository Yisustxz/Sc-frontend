import { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useAppDispatch } from 'store'
import {
  setErrorMessage,
  setIsLoading,
  setSuccessMessage
} from 'store/customizationSlice'
import createContract from 'services/contracts/create-contract'

type Props = {
  dni: string
  onCreated?: (contract: any) => void
}

const CreateContract = ({ dni, onCreated }: Props) => {
  const dispatch = useAppDispatch()
  const [values, setValues] = useState({
    dni: dni || '',
    position: '',
    qualification: '',
    grade: '',
    level: '',
    workingHours: '',
    hoursWorked: '',
    hourlyCost: '',
    yearsOfServiceAvec: 0 as number | string,
    yearsOfServiceExternal: 0 as number | string,
    yearsOfServiceOtherAvec: 0 as number | string,
    monthlySalary: '',
    nightBonus: '',
    transport: false,
    antique: '',
    bonusAcademic: '',
    nroOfChildren: 0 as number | string,
    bonusCompensatory: '',
    bonusForChildren: '',
    geography: '',
    homeCareAssistance: '',
    bonusDisability: ''
  })

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
    return values.dni && values.position && values.level
  }, [values])

  const onSubmit = useCallback(async () => {
    try {
      dispatch(setIsLoading(true))
      const payload = { ...values, dni }
      const saved = await createContract(payload)
      dispatch(setSuccessMessage('Contrato creado correctamente'))
      onCreated?.(saved)
    } catch (err: any) {
      dispatch(
        setErrorMessage(
          err?.response?.data?.message || 'Error al crear el contrato'
        )
      )
    } finally {
      dispatch(setIsLoading(false))
    }
  }, [dispatch, onCreated, dni, values])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Crear contrato {dni ? `(DNI: ${dni})` : ''}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label='DNI'
            name='dni'
            value={values.dni}
            onChange={onChange}
            fullWidth
            disabled={!!dni}
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
            label='Bono Nocturno'
            name='nightBonus'
            value={values.nightBonus}
            onChange={onChange}
            fullWidth
          />
        </Grid>
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
        <Grid item xs={12} md={4}>
          <TextField
            label='Bono Académico'
            name='bonusAcademic'
            value={values.bonusAcademic}
            onChange={onChange}
            fullWidth
          />
        </Grid>
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
        <Grid item xs={12} md={4}>
          <TextField
            label='Bono Compensatorio'
            name='bonusCompensatory'
            value={values.bonusCompensatory}
            onChange={onChange}
            fullWidth
          />
        </Grid>
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
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={onSubmit}
          disabled={!isValid}
        >
          Guardar contrato
        </Button>
      </Box>
    </Box>
  )
}

export default CreateContract
