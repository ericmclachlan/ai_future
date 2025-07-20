import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Store current slide index in memory
let currentSlideIndex = 0;

// GET endpoint to retrieve current slide index
app.get('/api/current-slide', (req, res) => {
  res.json({ currentSlide: currentSlideIndex });
});

// POST endpoint to set current slide index
app.post('/api/current-slide', (req, res) => {
  const { currentSlide } = req.body;
  if (typeof currentSlide === 'number' && currentSlide >= 0) {
    currentSlideIndex = currentSlide;
    res.json({ success: true, currentSlide: currentSlideIndex });
  } else {
    res.status(400).json({ error: 'Invalid slide index' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 