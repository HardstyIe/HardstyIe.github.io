import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/AppLayout.tsx", [
    index("routes/Home.tsx"),                     // /
    route("random", "./routes/RandomJoke.tsx"),   // /random
    route("jokes", "./routes/AllJokes.tsx"),      // /jokes
    route("jokes/add", "./routes/jokes/AddJoke.tsx"), // /jokes/add
    route("jokes/:id", "./routes/jokes/JokeById.tsx"), // /jokes/:id]
  ])
] satisfies RouteConfig;
