interface Props {
  title?: string;
  description?: string;
}

export const CustomJumbotron = ({ title, description }: Props) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        {title || "Superhero Database"}
      </h1>
      <p className="text-gray-600">
        {description || "Discover and manage your favorite superheroes"}
      </p>
    </div>
  );
};
