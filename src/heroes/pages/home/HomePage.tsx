"use client";

import { use, useMemo, useState } from "react";

import { useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Heart } from "lucide-react";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import CustomPagination from "@/components/custom/CustomPagination";
import CustomBreadcrumbs from "@/components/custom/CustomBreadcrumbs";

import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { usePaginationHero } from "@/heroes/hooks/usePaginationHero";
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext";

interface Hero {
  id: string;
  name: string;
  alias: string;
  powers: string[];
  description: string;
  strength: number;
  team: string;
  image: string;
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoriteCount, favorites } = use(FavoriteHeroContext);

  const activeTab = searchParams.get("tab") ?? "all";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "5";
  const category = searchParams.get("category") ?? "all";

  const selectedTab = useMemo(() => {
    const validTabs = ["all", "favorites", "heroes", "villains"];

    return validTabs.includes(activeTab) ? activeTab : "all";
  }, [activeTab]);

  const { data: heroesResponse, isLoading } = usePaginationHero(
    +page,
    +limit,
    category
  );

  const { data: summary } = useHeroSummary();

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHero, setNewHero] = useState<Omit<Hero, "id">>({
    name: "",
    alias: "",
    powers: [],
    description: "",
    strength: 5,
    team: "",
    image: "/placeholder.svg?height=200&width=200",
  });

  const filteredHeroes = heroes.filter(
    (hero) =>
      hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.powers.some((power) =>
        power.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      hero.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddHero = () => {
    if (newHero.name && newHero.alias) {
      const hero: Hero = {
        ...newHero,
        id: Date.now().toString(),
        powers: newHero.powers.length > 0 ? newHero.powers : ["Unknown Power"],
      };
      setHeroes([...heroes, hero]);
      setNewHero({
        name: "",
        alias: "",
        powers: [],
        description: "",
        strength: 5,
        team: "",
        image: "/placeholder.svg?height=200&width=200",
      });
      setIsDialogOpen(false);
    }
  };

  const handlePowerInput = (powerString: string) => {
    const powers = powerString
      .split(",")
      .map((power) => power.trim())
      .filter((power) => power.length > 0);
    setNewHero({ ...newHero, powers });
  };

  return (
    <>
      <CustomJumbotron
        title="Hero Management Dashboard"
        description="Search, add, and explore your favorite superheroes"
      />

      <CustomBreadcrumbs
        currentPage="Home"
        breadcrumbs={[
          {
            label: "home 1",
            to: "/",
          },
          {
            label: "home 2",
            to: "/home2",
          },
        ]}
      />

      <HeroStats />

      {/* Search and Add Hero Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search heroes by name, alias, powers, or team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Hero
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Hero</DialogTitle>
              <DialogDescription>
                Create a new superhero profile with their details and abilities.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Real Name</Label>
                <Input
                  id="name"
                  value={newHero.name}
                  onChange={(e) =>
                    setNewHero({ ...newHero, name: e.target.value })
                  }
                  placeholder="e.g., Peter Parker"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alias">Hero Alias</Label>
                <Input
                  id="alias"
                  value={newHero.alias}
                  onChange={(e) =>
                    setNewHero({ ...newHero, alias: e.target.value })
                  }
                  placeholder="e.g., Spider-Man"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="powers">Powers (comma-separated)</Label>
                <Input
                  id="powers"
                  value={newHero.powers.join(", ")}
                  onChange={(e) => handlePowerInput(e.target.value)}
                  placeholder="e.g., Super Strength, Flight, Heat Vision"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team">Team</Label>
                <Select
                  value={newHero.team}
                  onValueChange={(value) =>
                    setNewHero({ ...newHero, team: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Justice League">
                      Justice League
                    </SelectItem>
                    <SelectItem value="Avengers">Avengers</SelectItem>
                    <SelectItem value="X-Men">X-Men</SelectItem>
                    <SelectItem value="Fantastic Four">
                      Fantastic Four
                    </SelectItem>
                    <SelectItem value="Teen Titans">Teen Titans</SelectItem>
                    <SelectItem value="Solo">Solo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="strength">Strength Level (1-10)</Label>
                <Input
                  id="strength"
                  type="number"
                  min="1"
                  max="10"
                  value={newHero.strength}
                  onChange={(e) =>
                    setNewHero({
                      ...newHero,
                      strength: Number.parseInt(e.target.value) || 5,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newHero.description}
                  onChange={(e) =>
                    setNewHero({ ...newHero, description: e.target.value })
                  }
                  placeholder="Brief description of the hero..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddHero}>Add Hero</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading heroes...</div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredHeroes.length} of {heroesResponse?.total} heroes
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="all"
                onClick={() =>
                  setSearchParams((prev) => {
                    prev.set("tab", "all");
                    prev.set("category", "all");
                    prev.set("page", "1");
                    return prev;
                  })
                }
              >
                All Characters ({summary?.totalHeroes ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="flex items-center gap-2"
                onClick={() =>
                  setSearchParams((prev) => {
                    prev.set("tab", "favorites");
                    return prev;
                  })
                }
              >
                <Heart className="h-4 w-4" />
                Favorites ({favoriteCount})
              </TabsTrigger>
              <TabsTrigger
                value="heroes"
                onClick={() =>
                  setSearchParams((prev) => {
                    prev.set("tab", "heroes");
                    prev.set("category", "hero");
                    prev.set("page", "1");
                    return prev;
                  })
                }
              >
                Heroes ({summary?.heroCount ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="villains"
                onClick={() =>
                  setSearchParams((prev) => {
                    prev.set("tab", "villains");
                    prev.set("category", "villain");
                    prev.set("page", "1");
                    return prev;
                  })
                }
              >
                Villains ({summary?.villainCount ?? 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <HeroGrid heroes={heroesResponse?.heroes ?? []} />
            </TabsContent>
            <TabsContent value="favorites">
              {" "}
              <HeroGrid heroes={favorites ?? []} />
            </TabsContent>
            <TabsContent value="heroes">
              {" "}
              <HeroGrid heroes={heroesResponse?.heroes ?? []} />
            </TabsContent>
            <TabsContent value="villains">
              {" "}
              <HeroGrid heroes={heroesResponse?.heroes ?? []} />
            </TabsContent>
          </Tabs>

          {selectedTab !== "favorites" && (
            <CustomPagination totalPages={heroesResponse?.pages ?? 0} />
          )}

          {/* No Results */}
          {heroesResponse?.total === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No heroes found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or add a new hero to the
                database.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
