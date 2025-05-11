import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { StudentOfCourse } from 'core/evaluations/types';

interface Props {
  open: boolean;
  onClose: () => void;
  selectedStudent: StudentOfCourse | null;
}

const StudentDetailsDialog: React.FC<Props> = ({ open, onClose, selectedStudent }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="student-details-dialog-title"
    maxWidth="xs"
  >
    <DialogTitle id="student-details-dialog-title">
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Detalles del Estudiante
      </Typography>
    </DialogTitle>
    <DialogContent dividers sx={{ maxWidth: 320, mx: 'auto' }}>
      {selectedStudent && (
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', fontWeight: 500 }}>
            <strong>Nombre:</strong> {selectedStudent.name} {selectedStudent.lastName}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', mt: 1 }}>
            <strong>Cédula de Identidad:</strong> {selectedStudent.dni}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', mt: 1 }}>
            <strong>ID:</strong> {selectedStudent.id}
          </Typography>
        </Box>
      )}
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onClose}
        variant="outlined"
        color="primary"
        size="small"
      >
        Cerrar
      </Button>
    </DialogActions>
  </Dialog>
);

export default StudentDetailsDialog;
