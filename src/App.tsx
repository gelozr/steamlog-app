import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GameListPage from './pages/GameListPage';
import GameDetailPage from './pages/GameDetailPage';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import NewGamePage from './pages/NewGamePage';
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle';

function App() {
  const { theme } = useTheme();

  return (
    <ThemeProvider>
      <div className="flex min-h-svh flex-col items-center">
        <div className="w-300 p-6 rounded shadow dark:shadow-gray-900">
          <div className="flex justify-end mb-4">
            <ModeToggle />
          </div>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/games" replace />} />
              <Route path="/games" element={<GameListPage />} />
              <Route path="/games/new" element={<NewGamePage />} />
              <Route path="/games/:id" element={<GameDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster theme={theme} />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
