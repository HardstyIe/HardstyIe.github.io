import { useEffect, useState } from "react";
import { Link } from 'react-router';
import type { Joke } from '~/types/jokeType';
import { getAllJokes } from "../api/jokes";

const useAllJokes = () => {
  const [allJokes, setAllJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllJokes = async () => {
      try {
        const data = await getAllJokes();
        setAllJokes(data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllJokes();
  }, []);

  return { allJokes, loading };
};

const AllJokes = () => {
  const { allJokes, loading } = useAllJokes();

  if (loading) {
    return <div>Loading...</div>;
  } 
  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">All Jokes</h1>
      <ul>
        {allJokes.map((joke) => (
          <Link
            key={joke.id}
            to={`/jokes/${joke.id}`}
            className="block mb-2 p-4 border border-gray-700 rounded hover:bg-gray-800 transition"
          >
            <p className="text-lg font-semibold">{joke.question}</p>
            <p className="text-sm text-gray-400">Voir la blague</p>
          </Link>
))}
      </ul>
    </div>
  );
}

export default AllJokes
