import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/category.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot be longer than 500 characters')
];

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (require authentication)
router.use(protect);
router.post('/', categoryValidation, createCategory);
router.patch('/:id', categoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

export default router;
