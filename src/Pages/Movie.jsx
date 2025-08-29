import { Card } from "../Components/Movie-Card";
export const Movie = () => {
  const movies = [
    { title: "GOT", image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Kingdom of Apes", image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Civil War",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Dune", image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "IF",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
    { title: "Sheriff",image: "https://cdn.europosters.eu/image/350/posters/game-of-thrones-season-1-key-art-i161816.jpg" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {movies.map((m, i) => (
        <Card key={i} image={m.image} title={m.title} />
      ))}
    </div>
  );
};

