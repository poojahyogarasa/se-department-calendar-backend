const db = require('../config/db');

// 🔹 Create Todo
exports.createTodo = (req, res) => {
    const { title, description, due_date } = req.body;
    const userId = req.user.id;

    const query = `
        INSERT INTO todo_items (user_id, title, description, due_date, is_done)
        VALUES (?, ?, ?, ?, 0)
    `;

    db.query(query, [userId, title, description, due_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
            message: "Todo created successfully",
            todoId: result.insertId
        });
    });
};


// 🔹 Get My Todos
exports.getMyTodos = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT * FROM todo_items
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
};


// 🔹 Update Todo
exports.updateTodo = (req, res) => {
    const todoId = req.params.id;
    const { title, description, due_date } = req.body;
    const userId = req.user.id;

    const query = `
        UPDATE todo_items
        SET title = ?, description = ?, due_date = ?
        WHERE todo_id = ? AND user_id = ?
    `;

    db.query(query, [title, description, due_date, todoId, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo updated successfully" });
    });
};


// 🔹 Delete Todo
exports.deleteTodo = (req, res) => {
    const todoId = req.params.id;
    const userId = req.user.id;

    const query = `
        DELETE FROM todo_items
        WHERE todo_id = ? AND user_id = ?
    `;

    db.query(query, [todoId, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo deleted successfully" });
    });
};


// 🔹 Toggle Done / Not Done
exports.toggleTodoStatus = (req, res) => {
    const todoId = req.params.id;
    const userId = req.user.id;

    const query = `
        UPDATE todo_items
        SET is_done = IF(is_done = 0, 1, 0)
        WHERE todo_id = ? AND user_id = ?
    `;

    db.query(query, [todoId, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo status toggled successfully" });
    });
};