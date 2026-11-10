import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import FoodMap from './pages/FoodMap';
import MealPlanner from './pages/MealPlanner';
import FoodScanner from './pages/FoodScanner';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          
          {/* Food Map routes */}
          <Route path="/peta" element={<FoodMap />} />
          <Route path="/peta-makanan" element={<FoodMap />} />

          {/* Meal Planner routes */}
          <Route path="/rekomendasi" element={<MealPlanner />} />
          <Route path="/planner" element={<MealPlanner />} />

          {/* Food Scanner routes */}
          <Route path="/scan" element={<FoodScanner />} />
          <Route path="/scan-makanan" element={<FoodScanner />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
