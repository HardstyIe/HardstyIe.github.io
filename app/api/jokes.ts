const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllJokes = async () => {
  const res = await fetch(`${BASE_URL}/jokes`);
  if (!res.ok) throw new Error("Failed to fetch all jokes");
  return res.json();
};

export const getRandomJoke = async () => {
  const res = await fetch(`${BASE_URL}/jokes/random`);
  if (!res.ok) throw new Error("Failed to fetch random joke");
  return res.json();
};

export const getJokeById = async (id: number | string) => {
  const res = await fetch(`${BASE_URL}/jokes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch joke by id");
  return res.json();
};

export const createJoke = async (question: string, answer: string) => {
  const res = await fetch(`${BASE_URL}/jokes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer }),
  });
  if (!res.ok) throw new Error("Failed to create joke");
  return res.json();
};
