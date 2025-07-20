import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Heading, Button, Select, VStack, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import slides from './slides';

function PresenterView({ slides, currentSlide, setCurrentSlide }) {
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSlideSelect = (event) => {
    setCurrentSlide(parseInt(event.target.value));
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Presenter View</Heading>
      
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={2}>Slide {currentSlide + 1} of {slides.length}</Text>
          <Box p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50">
            <Text whiteSpace="pre-wrap">{slides[currentSlide][0]}</Text>
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

function AudienceView({ slides, currentSlide }) {
  return (
    <Box p={8}>
      <Heading mb={6}>Audience View</Heading>
      
      <Box>
        <Text fontWeight="bold" mb={2}>Slide {currentSlide + 1} of {slides.length}</Text>
        <Box p={6} border="1px" borderColor="gray.200" borderRadius="md" bg="white" minH="400px">
          <Text whiteSpace="pre-wrap" fontSize="lg">{slides[currentSlide][1]}</Text>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/presenter" element={<PresenterView slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />} />
        <Route path="/audience" element={<AudienceView slides={slides} currentSlide={currentSlide} />} />
        <Route path="*" element={<Navigate to="/presenter" replace />} />
      </Routes>
    </Router>
  );
}
