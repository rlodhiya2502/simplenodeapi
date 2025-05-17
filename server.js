const express = require('express');
const app = express();
const PORT = 3000;
const API_KEY = '123456'; // Change this as needed

// Middleware
app.use(express.json());

// API key check middleware
app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }
    next();
});

// In-memory data store
let items = [];
let currentId = 1;

// CREATE item
app.post('/items', (req, res) => {
    const { name, description } = req.body;
    const newItem = { id: currentId++, name, description };
    items.push(newItem);
    res.status(201).json({ message: 'Item created', item: newItem });
});

// READ all items
app.get('/items', (req, res) => {
    res.json(items);
});

// READ one item by ID
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
});

// UPDATE item
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.name = name;
    item.description = description;
    res.json({ message: 'Item updated', item });
});

// DELETE item
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ error: 'Item not found' });

    items.splice(index, 1);
    res.json({ message: 'Item deleted' });
});

// Start server
app.listen(PORT, () => {
    console.log(`In-memory CRUD API running at http://localhost:${PORT}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

