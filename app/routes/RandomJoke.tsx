import { getRandomJoke } from "app/api/jokes";
import { useCallback, useEffect, useState } from "react";
import type { Joke } from '~/types/jokeType';

const useRandomJoke = () => {
  const [randomJoke, setRandomJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(true);

  // useCallback to avoid redefining the function on each render
  const fetchRandomJoke = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRandomJoke();
      setRandomJoke(data.data || data);
    } catch (err) {
      console.error("Fetch error:", err);
      setRandomJoke(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomJoke(); // fetch initial
  }, [fetchRandomJoke]);

  return { randomJoke, loading, fetchRandomJoke };
};

const RandomJoke = () => {
  const { randomJoke, loading, fetchRandomJoke } = useRandomJoke();

  if (loading) {
    return <div>Loading...</div>;
  } 
  if (!randomJoke) {
    return <div>No joke found.</div>;
  }
  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Random Joke</h1>
      <div className="mb-2 p-4 border border-gray-700 rounded">
        <p className="text-lg font-semibold">{randomJoke.question}</p>
        <p className="text-md">{randomJoke.answer}</p>
      </div>
      <button
        onClick={fetchRandomJoke}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Autre blague
      </button>
    </div>
  );
}

export default RandomJoke
