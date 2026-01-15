import { HashRouter, Route, Routes } from "react-router";
import AllJokes from "./routes/AllJokes";
import AppLayout from "./routes/AppLayout";
import Home from "./routes/Home";
import AddJoke from "./routes/jokes/AddJoke";
import JokeById from "./routes/jokes/JokeById";
import RandomJoke from "./routes/RandomJoke";

export default function Main() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="random" element={<RandomJoke />} />
          <Route path="jokes" element={<AllJokes />} />
          <Route path="jokes/add" element={<AddJoke />} />
          <Route path="jokes/:id" element={<JokeById />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
