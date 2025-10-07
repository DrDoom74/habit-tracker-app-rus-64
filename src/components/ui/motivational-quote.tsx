import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart } from "lucide-react";
import { getRandomQuote, Quote } from "@/data/quotes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const FAVORITES_KEY = "favorite-quotes";

export function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote>(getRandomQuote());
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading favorites:", e);
      }
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Quote[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setIsRefreshing(false);
    }, 300);
  };

  const isFavorite = favorites.some(fav => fav.text === quote.text);

  const toggleFavorite = () => {
    if (isFavorite) {
      saveFavorites(favorites.filter(fav => fav.text !== quote.text));
    } else {
      saveFavorites([...favorites, quote]);
    }
  };

  const removeFavorite = (quoteToRemove: Quote) => {
    saveFavorites(favorites.filter(fav => fav.text !== quoteToRemove.text));
  };

  return (
    <Card className="overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <blockquote className={`text-lg font-medium leading-relaxed transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
              "{quote.text}"
            </blockquote>
            <p className="text-sm text-muted-foreground text-right">— {quote.author}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-8 w-8"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="h-8 w-8"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs px-2">
                  {favorites.length}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Избранные цитаты</DialogTitle>
                  <DialogDescription>
                    Ваша коллекция вдохновляющих цитат
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                  {favorites.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      У вас пока нет избранных цитат
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {favorites.map((fav, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm leading-relaxed mb-2">"{fav.text}"</p>
                              <p className="text-xs text-muted-foreground text-right">— {fav.author}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFavorite(fav)}
                              className="h-8 w-8 flex-shrink-0"
                            >
                              <Heart className="h-4 w-4 fill-destructive text-destructive" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
