const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
    createTodo,
    getMyTodos,
    updateTodo,
    deleteTodo,
    toggleTodoStatus
} = require('../controllers/todoController');

router.post('/', verifyToken, createTodo);
router.get('/', verifyToken, getMyTodos);   // 👈 THIS IS MISSING
router.put('/:id', verifyToken, updateTodo);
router.delete('/:id', verifyToken, deleteTodo);
router.patch('/:id/toggle', verifyToken, toggleTodoStatus);

module.exports = router;