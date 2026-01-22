import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Heart, Trophy, Users, Zap } from "lucide-react";
import { HeroStatCard } from "./HeroStatCard";
import { useHeroSummary } from "../hooks/useHeroSummary";
import { use } from "react";
import { FavoriteHeroContext } from "../context/FavoriteHeroContext";

export const HeroStats = () => {
  const { data: summary, isLoading } = useHeroSummary();

  const { favoriteCount } = use(FavoriteHeroContext);

  if (isLoading || !summary) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <HeroStatCard
        title="Total Characters"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <CardContent>
          <div className="text-2xl font-bold">{summary?.totalHeroes}</div>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">
              {summary?.heroCount} Heroes
            </Badge>
            <Badge variant="destructive" className="text-xs">
              {summary?.villainCount} Villains
            </Badge>
          </div>
        </CardContent>
      </HeroStatCard>

      <HeroStatCard
        title="Favorities"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        <div
          className="text-2xl font-bold text-red-600"
          data-testid="favorite-count"
        >
          {favoriteCount}
        </div>
        <p
          className="text-xs text-muted-foreground"
          data-testid="favorite-percentage"
        >
          {((favoriteCount / summary?.totalHeroes) * 100).toFixed(2)}% of total
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Strongest"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summary?.strongestHero?.name}</div>
        <p className="text-xs text-muted-foreground">
          Strength: {summary?.strongestHero?.strength}/10
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Smartest"
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summary?.smartestHero?.name}</div>
        <p className="text-xs text-muted-foreground">
          Intelligence: {summary?.smartestHero?.intelligence}/10
        </p>
      </HeroStatCard>
    </div>
  );
};
