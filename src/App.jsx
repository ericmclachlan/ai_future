import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Heading, Button, Select, VStack, HStack, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import slides from './slides';

const API_BASE = 'http://localhost:3001/api';

function PresenterView({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateSlideOnServer = async (newSlideIndex) => {
    try {
      await fetch(`${API_BASE}/current-slide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentSlide: newSlideIndex }),
      });
      setCurrentSlide(newSlideIndex);
    } catch (error) {
      console.error('Failed to update slide on server:', error);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      updateSlideOnServer(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      updateSlideOnServer(currentSlide - 1);
    }
  };

  const handleSlideSelect = (event) => {
    updateSlideOnServer(parseInt(event.target.value));
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Presenter View</Heading>
      
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={2}>Slide {currentSlide + 1} of {slides.length}</Text>
          <Box p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50">
            <ReactMarkdown>{slides[currentSlide][0]}</ReactMarkdown>
          </Box>
        </Box>

        <HStack spacing={4}>
          <Button 
            onClick={handlePrevious} 
            isDisabled={currentSlide === 0}
            colorScheme="blue"
          >
            Previous
          </Button>
          
          <Select 
            value={currentSlide} 
            onChange={handleSlideSelect}
            width="200px"
          >
            {slides.map((_, index) => (
              <option key={index} value={index}>
                Slide {index + 1}
              </option>
            ))}
          </Select>
          
          <Button 
            onClick={handleNext} 
            isDisabled={currentSlide === slides.length - 1}
            colorScheme="blue"
          >
            Next
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

function AudienceView({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchCurrentSlide = async () => {
      try {
        const response = await fetch(`${API_BASE}/current-slide`);
        const data = await response.json();
        setCurrentSlide(data.currentSlide);
      } catch (error) {
        console.error('Failed to fetch current slide:', error);
      }
    };

    // Fetch immediately
    fetchCurrentSlide();

    // Then poll every second
    const interval = setInterval(fetchCurrentSlide, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={8}>
      <Heading mb={6}>Audience View</Heading>
      
      <Box>
        <Text fontWeight="bold" mb={2}>Slide {currentSlide + 1} of {slides.length}</Text>
        <Box p={6} border="1px" borderColor="gray.200" borderRadius="md" bg="white" minH="400px">
          <ReactMarkdown>{slides[currentSlide][1]}</ReactMarkdown>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/presenter" element={<PresenterView slides={slides} />} />
        <Route path="/audience" element={<AudienceView slides={slides} />} />
        <Route path="*" element={<Navigate to="/presenter" replace />} />
      </Routes>
    </Router>
  );
}
