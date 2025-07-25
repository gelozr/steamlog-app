import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { getBadgeClass } from "@/lib/utils";
import type { Game } from "@/types/game";
import { useNavigate } from "react-router-dom";
import { fetchGames, fetchGenres } from "@/api/games";
import { Button } from "./ui/button";
import { useEchoPublic } from "@laravel/echo-react";
import { toast } from "sonner";

const enrichmentStatuses = ["pending", "in_progress", "skipped", "invalid", "failed", "done"];

type SortDirection = 'asc' | 'desc';
type SortRule = {
  column: 'name' | 'release_date';
  direction: SortDirection;
};


const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [genre, setGenre] = useState("");
  const [enrichmentStatus, setEnrichmentStatus] = useState("");
  const [sortRules, setSortRules] = useState<SortRule[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error)
  }, [])

  useEffect(() => {
    const controller = new AbortController();
    const debounceTimeout = setTimeout(() => {
      const params: Record<any, any> = {};
      params.filter = {};

      if (search) params.q = search;
      if (genre && genre !== "all") params.filter.genre = genre;
      if (enrichmentStatus && enrichmentStatus !== "all") {
        params.filter.enrichment_status = enrichmentStatus;
      }
      if (sortRules.length > 0) {
        params.sort = sortRules.map(r => `${r.column}:${r.direction}`).join(',');
      }

      fetchGames(params, controller.signal)
        .then(setGames)
        .catch(error => {
          if (!axios.isCancel(error)) {
              console.error(error);
            }
        })
    }, 200);

    return () => {
      clearTimeout(debounceTimeout);
      controller.abort();
    };
  }, [search, genre, enrichmentStatus, sortRules]);

  const toggleSort = (column: 'name' | 'release_date') => {
    setSortRules(prev => {
      const existing = prev.find(r => r.column === column);
      if (!existing) {
        return [...prev, { column, direction: 'asc' }];
      } else if (existing.direction === 'asc') {
        return prev.map(r =>
          r.column === column ? { ...r, direction: 'desc' } : r
        );
      } else {
        return prev.filter(r => r.column !== column);
      }
    });
  };

  const getSortIcon = (column: 'name' | 'release_date') => {
    const rule = sortRules.find(r => r.column === column);
    if (!rule) return null;
    return rule.direction === 'asc' ? '🔼' : '🔽';
  };

  useEchoPublic(
    `game.enriched`,
    ".game.enrichment_status",
    (e: any) => {
      setGames(prevGames =>
        prevGames.map(game => game.id === e.game.id ? e.game : game)
      );

      if (e.status == 'done') {
        toast.success(`‘${e.game.name}’ has been enriched with the latest data.`)
      }
    },
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {genres.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={enrichmentStatus} onValueChange={setEnrichmentStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {enrichmentStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort('name')}>
                Name {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort('release_date')}>
                Release Date {getSortIcon('release_date')}
              </Button>
            </TableHead>
            <TableHead>Steam App ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}
              onClick={() => navigate(`/games/${game.id}`)}
              className="cursor-pointer hover:bg-muted transition-colors"
            >
              <TableCell>{game.name}</TableCell>
              <TableCell>{game.genre}</TableCell>
              <TableCell>{game.release_date}</TableCell>
              <TableCell>{game.steam_app_id}</TableCell>
              <TableCell><Badge className={getBadgeClass(game.enrichment_status)} variant="default">{game.enrichment_status}</Badge></TableCell>
              <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap">{game.short_description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GameList;
