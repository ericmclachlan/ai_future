// Dynamic slide loader
const slideModules = import.meta.glob('./slides/*.md', { as: 'raw' });

async function loadSlides() {
  const slideFiles = Object.keys(slideModules);
  
  // Group files by slide number and type
  const slideGroups = {};
  
  for (const file of slideFiles) {
    const match = file.match(/\.\/slides\/(\d+\.\d+)\s*-\s*(.+?)\s*-\s*(presenter|audience)\.md$/);
    if (match) {
      const [, number, title, type] = match;
      if (!slideGroups[number]) {
        slideGroups[number] = { number, title, presenter: '', audience: '' };
      }
      slideGroups[number][type] = file;
    }
  }
  
  // Sort by slide number and load content
  const sortedSlides = Object.values(slideGroups)
    .sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
  
  const slides = [];
  
  for (const slide of sortedSlides) {
    const presenterContent = await slideModules[slide.presenter]();
    const audienceContent = await slideModules[slide.audience]();
    // Use the presenter filename for scheduled time
    slides.push({
      presenterContent,
      audienceContent,
      filename: slide.presenter
    });
  }
  
  return slides;
}

// Export a promise that resolves to the slides
export default loadSlides(); 
