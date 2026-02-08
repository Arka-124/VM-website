const express = require('express');
const cors = require('cors');
const submenuData = require('./data/menuData'); // ✅ Imported data

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Import routes
const searchRoutes = require('./routes/search');

// Use routes
app.use('/api/search', searchRoutes);
// API endpoint
app.get('/api/menu', (req, res) => {
  console.log("Menu data API hit");
  res.json(submenuData);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('🚗 VM Automobiles Backend is up and running!');
});
