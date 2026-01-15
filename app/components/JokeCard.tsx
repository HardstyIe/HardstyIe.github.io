import { useState } from 'react';
import { Link } from 'react-router';
import type { Joke } from '~/types/jokeType';

interface JokeCardProps {
  joke: Joke;
  showAnswer?: boolean;
}

const JokeCard = ({ joke, showAnswer = false }: JokeCardProps) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  return (
    <div
      className="relative w-full min-h-[200px] perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front - Question */}
        <div
          className={`absolute w-full h-full backface-hidden bg-gradient-to-br from-carambar-yellow to-carambar-orange rounded-xl shadow-lg p-6 border-4 border-white ${
            isFlipped ? 'invisible' : 'visible'
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">❓</span>
                <span className="bg-white text-carambar-red font-bold px-3 py-1 rounded-full text-sm">
                  #{joke.id}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-carambar-blue leading-relaxed">
                {joke.question}
              </p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-carambar-red font-semibold animate-pulse">
                👆 Clique pour voir la réponse !
              </p>
            </div>
          </div>
        </div>

        {/* Back - Answer */}
        <div
          className={`absolute w-full h-full backface-hidden bg-gradient-to-br from-carambar-red to-carambar-blue rounded-xl shadow-lg p-6 border-4 border-white rotate-y-180 ${
            isFlipped ? 'visible' : 'invisible'
          }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">😂</span>
                <Link
                  to={`/jokes/${joke.id}`}
                  className="bg-white text-carambar-blue hover:bg-carambar-yellow font-bold px-3 py-1 rounded-full text-sm transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  Voir détails
                </Link>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                {joke.answer}
              </p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-carambar-yellow font-semibold">
                👆 Clique pour voir la question !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JokeCard;
