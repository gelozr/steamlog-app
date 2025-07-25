import GameList from '@/components/GameList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function GameListPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/games/new");
  };

  return (
    <div>
      <div className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <Button size="lg" onClick={handleClick} className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            New Game
          </Button>
        </div>
      </div>
      <GameList />
    </div>
  );
}
export default GameListPage;
