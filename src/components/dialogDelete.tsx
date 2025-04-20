import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography
} from '@mui/material'
import styled from 'styled-components'
import { IconAlertTriangle, IconTrash } from '@tabler/icons'
// Own
import { FunctionComponent } from 'react'

const DialogDelete: FunctionComponent<Prop> = ({
  open,
  handleClose,
  className,
  onDelete
}) => {
  return (
    <div className={className}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-delete-title'
        aria-describedby='alert-delete-description'
        PaperProps={{
          className: 'dialog-paper'
        }}
      >
        <DialogTitle id='alert-delete-title' className="dialog-title">
          <Box className="title-container">
            <IconAlertTriangle className="warning-icon" size={24} />
            <Typography variant="h5">Confirmación</Typography>
          </Box>
        </DialogTitle>
        <DialogContent className="dialog-content">
          <DialogContentText id='alert-delete-description' className="dialog-text">
            ¿Está seguro de querer borrar este elemento?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button 
            onClick={handleClose} 
            color='secondary' 
            variant='outlined'
            className="cancel-button"
          >
            Cancelar
          </Button>
          <Button
            onClick={onDelete}
            color='error'
            variant='outlined'
            startIcon={<IconTrash size={18} />}
            className="delete-button"
          >
            Borrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

interface Prop {
  open: boolean
  handleClose: () => void
  className?: string
  onDelete: () => void
}

export default styled(DialogDelete)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .dialog-paper {
    border-radius: 12px;
    min-width: 400px;
    padding: 8px;
  }

  .dialog-title {
    padding: 16px 24px 0;
  }

  .title-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .warning-icon {
    color: #f44336;
  }

  .dialog-content {
    padding: 20px 24px;
  }

  .dialog-text {
    margin: 0;
    color: #616161;
    font-size: 16px;
  }

  .dialog-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 8px 24px 20px;
  }

  .cancel-button, .delete-button {
    text-transform: none;
    border-radius: 8px;
    padding: 6px 16px;
    font-weight: 500;
    min-width: 100px;
  }

  .delete-button {
    box-shadow: none;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(244, 67, 54, 0.2);
    }
  }
`
