import { Routes, Route } from 'react-router-dom';
import QuoteWizard from './pages/quote';
import Guide from './pages/Guide';

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuoteWizard />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="*" element={<QuoteWizard />} />
    </Routes>
  );
}

export default App;
