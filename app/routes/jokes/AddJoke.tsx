import { createJoke } from "app/api/jokes";
import { useState } from "react";

const AddJoke = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await createJoke(question, answer);
      setSuccess(true);
      setQuestion("");
      setAnswer("");
    } catch (err: any) {
      setError(err.message || "Failed to add joke");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ajouter une blague</h1>

      {success && <p className="text-green-600 mb-2">Blague ajouté</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Réponse</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter une blague"}
        </button>
      </form>
    </div>
  );
};

export default AddJoke;
