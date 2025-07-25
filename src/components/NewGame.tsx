import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import GameForm from "./GameForm";
import { createGame } from "@/api/games";
import type { Game } from "@/types/game";

const NewGame = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Partial<Game>) => {
    setLoading(true);
    const res = await createGame(data as Game);

    if (res.status === 201) {
      toast.success("Game created");
      navigate("/games");
    }

    setLoading(false);
    return res;
  };

  return <GameForm onSubmit={handleSubmit} loading={loading} />;
};

export default NewGame;
