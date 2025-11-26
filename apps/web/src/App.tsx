import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import BuyerBoxPage from './pages/BuyerBoxPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/box" element={<BuyerBoxPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
