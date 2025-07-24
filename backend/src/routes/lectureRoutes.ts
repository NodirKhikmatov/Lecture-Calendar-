import { Router } from 'express';
import { LectureController } from '../controllers/lectureController';

const router = Router();

// GET /api/lectures - Get all lectures (with optional date range filtering)
router.get('/', LectureController.getAllLectures);

// GET /api/lectures/:id - Get lecture by ID
router.get('/:id', LectureController.getLectureById);

// POST /api/lectures - Create new lecture
router.post('/', LectureController.createLecture);

// PUT /api/lectures/:id - Update lecture
router.put('/:id', LectureController.updateLecture);

// DELETE /api/lectures/:id - Delete lecture
router.delete('/:id', LectureController.deleteLecture);

export default router;