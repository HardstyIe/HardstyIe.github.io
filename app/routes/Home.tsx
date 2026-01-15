import { useEffect, useState } from "react";
import { getAllJokes, getRandomJoke } from "~/api/jokes";
import type { Joke } from '~/types/jokeType';
import AddJoke from "./jokes/AddJoke";

type ViewMode = 'idle' | 'all' | 'random' | 'add';

const Home = () => {
  const [mode, setMode] = useState<ViewMode>('idle');
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [randomJoke, setRandomJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'all') fetchAllJokes();
    if (mode === 'random') fetchRandomJoke();
  }, [mode]);

  const fetchAllJokes = async () => {
    setLoading(true);
    try {
      const data = await getAllJokes();
      setJokes(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomJoke = async () => {
    setLoading(true);
    try {
      const data = await getRandomJoke();
      setRandomJoke(data.data || data);
    } catch (err) {
      console.error(err);
      setRandomJoke(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">

      <section className="bg-gradient-to-br from-carambar-yellow via-carambar-orange to-carambar-red text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-bounce-slow inline-block text-8xl mb-6">
            <img src="/carambar.png" alt="Carambar" className="h-64 w-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Bienvenue chez Carambar Jokes !
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Découvre les meilleures blagues Carambar ! Rigole, partage, et ajoute tes propres blagues nulles 😄
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setMode('all')}
              className="bg-carambar-blue text-white font-bold text-lg px-8 py-4 rounded-full hover:scale-110 transition shadow-2xl"
            >
              📚 Blagues garanties
            </button>
            <button
              onClick={() => setMode('random')}
              className="bg-white text-carambar-red font-bold text-lg px-8 py-4 rounded-full hover:scale-110 transition shadow-2xl"
            >
              🎲 Mode random
            </button>
            <button
              onClick={() => setMode('add')}
              className="bg-carambar-red text-white font-bold text-lg px-8 py-4 rounded-full hover:scale-110 transition shadow-2xl"
            >
              ➕ Ajouter une blague
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-carambar-blue mb-12">
            Pourquoi Carambar Jokes ? 🤔
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button onClick={() => setMode('all')} 
            className="bg-gradient-to-br from-carambar-yellow to-carambar-orange rounded-xl p-8 text-center shadow-lg hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">😂</div>
              <h3 className="text-2xl font-bold text-carambar-blue mb-3">
                Blagues Garanties
              </h3>
              <p className="text-gray-700">
                Des blagues testées et approuvées par des générations de mangeurs de Carambar !
              </p>
            </button>

            <button onClick={() => setMode('random')} 
            className="bg-gradient-to-br from-carambar-orange to-carambar-red rounded-xl p-8 text-center shadow-lg hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Mode Random
              </h3>
              <p className="text-white">
                Laisse le hasard choisir ta prochaine blague ! Surprise garantie à chaque clic.
              </p>
            </button>

            <button onClick={() => setMode('add')}
             className="bg-gradient-to-br from-carambar-red to-carambar-blue rounded-xl p-8 text-center shadow-lg hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">➕</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Ajoute tes Blagues
              </h3>
              <p className="text-white">
                Tu as une blague nulle à partager ? Ajoute-la et fais rire la communauté !
              </p>
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-carambar-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-carambar-red mb-2">10+</div>
              <p className="text-xl text-carambar-blue font-semibold">Blagues Disponibles</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-carambar-orange mb-2">100%</div>
              <p className="text-xl text-carambar-blue font-semibold">Nulles mais Drôles</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-carambar-yellow mb-2">∞</div>
              <p className="text-xl text-carambar-blue font-semibold">Fous Rires</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {loading && <p className="text-center">Chargement...</p>}

        {!loading && mode === 'all' && (
          <div className="space-y-4">
            {jokes.map(j => (
              <div key={j.id} className="p-4 border rounded">
                <p className="font-semibold">{j.question}</p>
                <p>{j.answer}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && mode === 'random' && randomJoke && (
          <div className="p-4 border rounded max-w-md mx-auto">
            <p className="font-semibold">{randomJoke.question}</p>
            <p>{randomJoke.answer}</p>
            <button
              onClick={fetchRandomJoke}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Autre blague
            </button>
          </div>
        )}

        {!loading && mode === 'add' && <AddJoke />}
        {!loading && mode === 'idle' && (
          <p className="text-center text-gray-500">
            Clique sur un bouton ci-dessus pour commencer
          </p>
        )}
      </section>

    </div>
  );
};

export default Home;
