import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GameForm from "./GameForm";
import { fetchGameById, updateGame } from "@/api/games";
import type { Game } from "@/types/game";
import { useEchoPublic } from "@laravel/echo-react";

const EditGame = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchGameById(id)
      .then(setGame)
      .catch(() => toast.error("Failed to load game"));
  }, [id]);

  const handleSubmit = async (data: Partial<Game>) => {
    setLoading(true);
    const res = await updateGame(id as string, data as Game);

    if (res.status === 200) {
      toast.success("Game updated");
      setGame(res.data.data);
      // navigate("/games");
    }

    setLoading(false);
    return res;
  };

  useEchoPublic(
    `game.enriched`,
    ".game.enrichment_status",
    (e: any) => {
      setGame(prevGame => prevGame ? { ...e.game } : null);

      if (e.id == id && e.status == 'done') {
        toast.success(`Game data successfully enriched.`)
      }
    },
  );

  if (!game) return <p className="p-6">Loading…</p>;

  return <GameForm initialData={game} onSubmit={handleSubmit} loading={loading} />;
};

export default EditGame;
