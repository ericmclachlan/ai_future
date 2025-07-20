import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Heading, Button, Select, VStack, HStack, Text, Spinner, Center } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import slidesPromise from './slides';

const API_BASE = 'http://localhost:3001/api';

// Helper function to extract title from markdown content
function extractTitle(markdownContent) {
  const lines = markdownContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.replace('# ', '').trim();
    }
  }
  return 'Untitled Slide';
}

function LoadingView() {
  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Spinner size="xl" />
        <Text>Loading slides...</Text>
      </VStack>
    </Center>
  );
}

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
            <div className="markdown-body">
              <ReactMarkdown>{slides[currentSlide][0]}</ReactMarkdown>
            </div>
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
            width="300px"
          >
            {slides.map((slide, index) => {
              const title = extractTitle(slide[0]); // Use presenter content for title
              return (
                <option key={index} value={index}>
                  {index + 1}. {title}
                </option>
              );
            })}
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
          <div className="markdown-body">
            <ReactMarkdown>{slides[currentSlide][1]}</ReactMarkdown>
          </div>
        </Box>
      </Box>
    </Box>
  );
}

function AppWithSlides() {
  const [slides, setSlides] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    slidesPromise.then(loadedSlides => {
      setSlides(loadedSlides);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load slides:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingView />;
  }

  if (!slides) {
    return (
      <Center h="100vh">
        <Text color="red.500">Failed to load slides</Text>
      </Center>
    );
  }

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

export default AppWithSlides;
