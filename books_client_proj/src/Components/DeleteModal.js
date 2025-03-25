import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Button } from "react-bootstrap";

const DeleteBookModal = ({ isOpen, onConfirm, onCancel, bookTitle }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>Подтверждение удаления</DialogTitle>
      <DialogContent>
        <p>Вы уверены, что хотите удалить книгу <strong>{bookTitle}</strong>?</p>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onCancel}>Отмена</Button>
        <Button variant="danger" onClick={onConfirm}>Удалить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBookModal;
