import { getJokeById } from "app/api/jokes";
import { useEffect, useState } from "react";
import { useParams } from 'react-router';
import type { Joke } from '~/types/jokeType';

const useJokeById = () => {
  const { id } = useParams<{ id: string }>();
  const [JokeById, setJokeById] = useState<Joke|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchJokeById = async () => {
      try {
        const data = await getJokeById(id);
        setJokeById(data.data || data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJokeById();
  }, [id]);

  return { JokeById, loading };
};

const JokeById = () => {
  const { JokeById, loading } = useJokeById();

  if (loading) {
    return <div>Loading...</div>;
  } 
  if (!JokeById) {
    return <div>No joke found.</div>;
  }
  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Joke By Id</h1>
      <div className="mb-2 p-4 border border-gray-700 rounded">
        <p className="text-lg font-semibold">{JokeById.question}</p>
        <p className="text-md">{JokeById.answer}</p>
      </div>
    </div>
  );
}

export default JokeById
