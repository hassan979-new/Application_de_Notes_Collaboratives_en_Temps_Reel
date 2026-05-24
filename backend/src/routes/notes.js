import express from 'express';
import { 
  getNotes, 
  getNote, 
  createNote, 
  updateNote, 
  deleteNote, 
  shareNote,
  searchNotes
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Toutes les routes nécessitent une authentification

router.route('/')
  .get(getNotes)
  .post(createNote);

router.get('/search', searchNotes);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

router.post('/:id/share', shareNote);

export default router;