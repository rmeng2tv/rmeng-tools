import { Routes, Route } from 'react-router-dom';
import QuoteWizard from './pages/quote';
import Guide from './pages/Guide';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import About from './pages/legal/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuoteWizard />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<QuoteWizard />} />
    </Routes>
  );
}

export default App;
