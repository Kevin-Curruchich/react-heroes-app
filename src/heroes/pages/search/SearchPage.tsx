import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import CustomBreadcrumbs from "@/components/custom/CustomBreadcrumbs";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { useQuery } from "@tanstack/react-query";
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";
import { useSearchParams } from "react-router";

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const name = searchParams.get("q") ?? undefined;
  const selectedStrength = searchParams.get("strength") ?? undefined;

  const { data: heroesSearched, isLoading } = useQuery({
    queryKey: ["search-heroes", { name, selectedStrength }],
    queryFn: () =>
      searchHeroesAction({ name: name, strength: selectedStrength }),
    staleTime: 1000 * 60 * 5,
  });

  if (!isLoading && heroesSearched?.length === 0)
    return (
      <>
        <p>Loading...</p>
      </>
    );

  return (
    <>
      <CustomJumbotron
        title="Search Heroes"
        description="Help users find their favorite superheroes quickly and easily"
      />

      <CustomBreadcrumbs currentPage="Search Heroes" />

      <HeroStats />

      <SearchControls />

      <HeroGrid heroes={heroesSearched || []} />
    </>
  );
};

export default SearchPage;
