import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Game } from "@/types/game";
import { Badge } from "./ui/badge";
import { getBadgeClass } from "@/lib/utils";
import type { AxiosResponse } from "axios";
import { Trash2 } from "lucide-react";
import { AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel } from "./ui/alert-dialog";
import { deleteGame } from "@/api/games";
import { useNavigate } from "react-router-dom";

type Props = {
  initialData?: Partial<Game>;
  onSubmit: (data: Partial<Game>) => Promise<AxiosResponse>;
  loading: boolean;
};

type ValidationErrors = {
  [key in keyof Partial<Game>]?: string[];
};

const GameForm = ({ initialData = {}, onSubmit, loading }: Props) => {
  const [formData, setFormData] = useState<Partial<Game>>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (initialData?.id) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await onSubmit(formData);
      if (res.status === 422) {
        setErrors(res.data.errors || {});
        toast.error("Please correct the form errors");
        return;
      }

      if (res.status >= 400) {
        throw new Error("Request failed");
      }

    } catch {
      toast.error("Failed to save game");
    }
  };

  const handleDelete = async () => {
    if (! initialData?.id) {
      return;
    }

    setDeleting(true);

    deleteGame(initialData.id)
      .then(() => {
        toast.success("Game deleted")
        setOpen(false);
        navigate('/games');
      })
      .catch(() => toast.error("Failed to delete game"))
      .finally(() => setDeleting(false));
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{initialData?.id ? "Edit Game" : "New Game"}</CardTitle>
          {initialData?.id && <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="default" className="cursor-pointer ml-4 flex items-center gap-2" onClick={() => setOpen(true)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the game from your database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline" className="cursor-pointer" disabled={deleting}>Cancel</Button>
                </AlertDialogCancel>
                {/* <AlertDialogAction asChild> */}
                  <Button variant="destructive" className="cursor-pointer" disabled={deleting} onClick={handleDelete}>{deleting ? "Deleting..." : "Confirm Delete"}</Button>
                {/* </AlertDialogAction> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="steam_app_id">Steam App ID</Label>
            <Input
              type="number"
              id="steam_app_id"
              name="steam_app_id"
              value={formData.steam_app_id ?? ""}
              onChange={handleChange}
            />
            {errors.steam_app_id && (
              <p className="text-sm text-red-500 mt-1">{errors.steam_app_id.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              name="genre"
              value={formData.genre || ""}
              onChange={handleChange}
            />
            {errors.genre && (
              <p className="text-sm text-red-500 mt-1">{errors.genre.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="release_date">Release Date</Label>
            <Input
              type="date"
              id="release_date"
              name="release_date"
              value={formData.release_date || ""}
              onChange={handleChange}
            />
            {errors.release_date && (
              <p className="text-sm text-red-500 mt-1">{errors.release_date.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              name="short_description"
              rows={4}
              value={formData.short_description || ""}
              onChange={handleChange}
            />
            {errors.short_description && (
              <p className="text-sm text-red-500 mt-1">{errors.short_description.join(", ")}</p>
            )}
          </div>

          {initialData.enrichment_status && (<div className="flex items-center">
            <Label htmlFor="enrichment_status" className="mr-3">Enrichment Status</Label>
            <Badge className={getBadgeClass(initialData.enrichment_status)} variant="default">
              {initialData.enrichment_status}
            </Badge>
          </div>)}

          <Button size="lg" type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GameForm;
