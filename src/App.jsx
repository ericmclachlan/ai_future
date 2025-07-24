import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Heading, Button, Select, VStack, HStack, Text, Spinner, Center } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import slidesPromise from './slides';

const API_BASE = 'http://localhost:3001/api';
const POLLING_INTERVAL = parseInt(import.meta.env.VITE_POLLING_INTERVAL) || 500;

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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Extract scheduled time from filename (e.g., 12.47 -> 12:47)
  let scheduledTime = '';
  if (slides && slides[currentSlide] && slides[currentSlide].filename) {
    const match = slides[currentSlide].filename.match(/(\d{2})\.(\d{2})/);
    if (match) {
      scheduledTime = `${match[1]}:${match[2]}`;
    }
  }

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
    <Box p={6} bg="transparent" width="100vw" px={0}>
      <HStack mb={4} width="100%" justifyContent="space-between">
        <HStack>
          <Heading mb={0} bg="transparent">Presenter View</Heading>
          <Text fontSize="xl" color="gray.600" ml={4}
            >Scheduled: {scheduledTime} | Actual: {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
        </HStack>
        <Text fontWeight="bold" mr={12}>Slide {currentSlide + 1} of {slides.length}</Text>
      </HStack>
      <VStack m={0} spacing={4} align="stretch">
        <HStack spacing={4} marginLeft={12}>
          <Button 
            onClick={handlePrevious} 
            isDisabled={currentSlide === 0}
            bg="var(--primary)"
            color="white"
            _hover={{ bg: "var(--primary-light)" }}
            _active={{ bg: "var(--primary-light)" }}
          >
            Previous
          </Button>
          
          <Select 
            value={currentSlide} 
            onChange={handleSlideSelect}
            width="300px"
            bg="white"
            color="black"
            borderColor="gray.300"
            _hover={{ borderColor: "var(--primary-light)" }}
            _focus={{ borderColor: "var(--primary)", boxShadow: "0 0 0 1px var(--primary)" }}
          >
            {slides.map((slide, index) => {
              const title = extractTitle(slide.presenterContent);
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
            bg="var(--primary)"
            color="white"
            _hover={{ bg: "var(--primary-light)" }}
            _active={{ bg: "var(--primary-light)" }}
          >
            Next
          </Button>
        </HStack>
        <Box p={6} mt={0}>
          <Box p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50" width="100%">
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{slides[currentSlide].presenterContent}</ReactMarkdown>
            </div>
          </Box>
        </Box>
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

    // Then poll at the configured interval
    const interval = setInterval(fetchCurrentSlide, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={4} bg="transparent" width="100vw" px={0}>
      <HStack mt={0} mb={0} width="100%" justifyContent="space-between">
        <Heading mb={0} bg="transparent">Surviving AI as a Software Engineer</Heading>
        <Text fontWeight="bold" mr={12}>Slide {currentSlide + 1} of {slides.length}</Text>
      </HStack>
      <Box mt={0}>
        <Box p={8} pr={12}>
          <Box p={8} border="1px" borderColor="gray.200" borderRadius="md" bg="white" minH="400px" width="100%">
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{slides[currentSlide].audienceContent}</ReactMarkdown>
            </div>
          </Box>
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
