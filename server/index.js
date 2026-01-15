import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Link, Outlet, useParams, HashRouter, Routes, Route } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect, useCallback } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const BASE_URL = "https://carambar-api-pepi.onrender.com/api/v1";
const getAllJokes = async () => {
  const res = await fetch(`${BASE_URL}/jokes`);
  if (!res.ok) throw new Error("Failed to fetch all jokes");
  return res.json();
};
const getRandomJoke = async () => {
  const res = await fetch(`${BASE_URL}/jokes/random`);
  if (!res.ok) throw new Error("Failed to fetch random joke");
  return res.json();
};
const getJokeById = async (id) => {
  const res = await fetch(`${BASE_URL}/jokes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch joke by id");
  return res.json();
};
const createJoke = async (question, answer) => {
  const res = await fetch(`${BASE_URL}/jokes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer })
  });
  if (!res.ok) throw new Error("Failed to create joke");
  return res.json();
};
const useAllJokes = () => {
  const [allJokes, setAllJokes] = useState([]);
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
  return {
    allJokes,
    loading
  };
};
const AllJokes = () => {
  const {
    allJokes,
    loading
  } = useAllJokes();
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      children: "Loading..."
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col items-center",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-2xl font-bold mb-4",
      children: "All Jokes"
    }), /* @__PURE__ */ jsx("ul", {
      children: allJokes.map((joke) => /* @__PURE__ */ jsxs(Link, {
        to: `/jokes/${joke.id}`,
        className: "block mb-2 p-4 border border-gray-700 rounded hover:bg-gray-800 transition",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-lg font-semibold",
          children: joke.question
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-gray-400",
          children: "Voir la blague"
        })]
      }, joke.id))
    })]
  });
};
const AllJokes$1 = UNSAFE_withComponentProps(AllJokes);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AllJokes$1
}, Symbol.toStringTag, { value: "Module" }));
const Footer = () => {
  return /* @__PURE__ */ jsx("footer", { className: "bg-carambar-blue text-white mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4 text-carambar-yellow", children: "🍬 Carambar Jokes" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300", children: "Les meilleures blagues Carambar, toujours prêtes à vous faire sourire ! Projet réalisé dans le cadre de la formation CDA." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4 text-carambar-yellow", children: "Liens Rapides" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/", className: "text-gray-300 hover:text-carambar-yellow transition", children: "Accueil" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/random", className: "text-gray-300 hover:text-carambar-yellow transition", children: "Blague Random" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/jokes", className: "text-gray-300 hover:text-carambar-yellow transition", children: "Toutes les Blagues" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/jokes/add", className: "text-gray-300 hover:text-carambar-yellow transition", children: "Ajouter une Blague" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4 text-carambar-yellow", children: "API & Docs" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://carambar-api-pepi.onrender.com/api-docs",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-gray-300 hover:text-carambar-yellow transition",
              children: "📚 Documentation Swagger"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://carambar-api-pepi.onrender.com/health",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-gray-300 hover:text-carambar-yellow transition",
              children: "❤️ Health Check"
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Carambar Jokes API - Projet CDA"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2", children: "Fait avec 💙 et beaucoup de blagues nulles" })
    ] })
  ] }) });
};
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return /* @__PURE__ */ jsxs("nav", { className: "bg-gradient-to-r from-carambar-yellow via-carambar-orange to-carambar-red shadow-lg sticky top-0 z-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center space-x-2 hover:scale-105 transition-transform", children: [
        /* @__PURE__ */ jsx("img", { src: "/carambar.png", alt: "Carambar", className: "h-12 w-auto" }),
        /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-white drop-shadow-lg", children: "Carambar Jokes" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex space-x-6 items-center", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/random",
            className: "text-white text-xl font-semibold hover:text-carambar-blue hover:scale-110 transition-all duration-200 flex items-center h-full",
            children: "🎲 Blague Random"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/jokes",
            className: "text-white text-xl font-semibold hover:text-carambar-blue hover:scale-110 transition-all duration-200 flex items-center h-full",
            children: "📚 Toutes les Blagues"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/jokes/add",
            className: "bg-white text-xl text-carambar-red font-bold px-4 py-2 rounded-full hover:bg-carambar-red hover:text-white transition-all duration-200 shadow-md flex items-center h-full",
            children: "➕ Ajouter"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsMenuOpen(!isMenuOpen),
          className: "text-white text-3xl focus:outline-none",
          children: isMenuOpen ? "✕" : "☰"
        }
      ) })
    ] }),
    isMenuOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden mt-2 pb-4 space-y-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/random",
          onClick: () => setIsMenuOpen(false),
          className: "block text-center text-white font-semibold bg-carambar-blue bg-opacity-30 px-4 py-3 rounded-lg hover:bg-opacity-50 transition",
          children: "🎲 Blague Random"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/jokes",
          onClick: () => setIsMenuOpen(false),
          className: "block text-center text-white font-semibold bg-carambar-blue bg-opacity-30 px-4 py-3 rounded-lg hover:bg-opacity-50 transition",
          children: "📚 Toutes les Blagues"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/jokes/add",
          onClick: () => setIsMenuOpen(false),
          className: "block bg-white text-carambar-red font-bold px-4 py-3 rounded-lg text-center hover:bg-carambar-red hover:text-white transition shadow-md",
          children: "➕ Ajouter une Blague"
        }
      )
    ] })
  ] });
};
const AppLayout = () => {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen flex flex-col",
    children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Footer, {})]
  });
};
const AppLayout$1 = UNSAFE_withComponentProps(AppLayout);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AppLayout$1
}, Symbol.toStringTag, { value: "Module" }));
const AddJoke = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await createJoke(question, answer);
      setSuccess(true);
      setQuestion("");
      setAnswer("");
    } catch (err) {
      setError(err.message || "Failed to add joke");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded shadow",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-2xl font-bold mb-4",
      children: "Ajouter une blague"
    }), success && /* @__PURE__ */ jsx("p", {
      className: "text-green-600 mb-2",
      children: "Blague ajouté"
    }), error && /* @__PURE__ */ jsx("p", {
      className: "text-red-600 mb-2",
      children: error
    }), /* @__PURE__ */ jsxs("form", {
      onSubmit: handleSubmit,
      className: "space-y-4",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("label", {
          className: "block font-semibold mb-1",
          children: "Question"
        }), /* @__PURE__ */ jsx("input", {
          type: "text",
          value: question,
          onChange: (e) => setQuestion(e.target.value),
          className: "w-full p-2 border border-gray-400 rounded",
          required: true
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("label", {
          className: "block font-semibold mb-1",
          children: "Réponse"
        }), /* @__PURE__ */ jsx("input", {
          type: "text",
          value: answer,
          onChange: (e) => setAnswer(e.target.value),
          className: "w-full p-2 border border-gray-400 rounded",
          required: true
        })]
      }), /* @__PURE__ */ jsx("button", {
        type: "submit",
        disabled: loading,
        className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50",
        children: loading ? "Ajout en cours..." : "Ajouter une blague"
      })]
    })]
  });
};
const AddJoke$1 = UNSAFE_withComponentProps(AddJoke);
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AddJoke$1
}, Symbol.toStringTag, { value: "Module" }));
const Home = () => {
  const [mode, setMode] = useState("idle");
  const [jokes, setJokes] = useState([]);
  const [randomJoke, setRandomJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (mode === "all") fetchAllJokes();
    if (mode === "random") fetchRandomJoke();
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
  return /* @__PURE__ */ jsxs("div", {
    className: "flex-1",
    children: [/* @__PURE__ */ jsx("section", {
      className: "bg-gradient-to-br from-carambar-yellow via-carambar-orange to-carambar-red text-white py-20",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto px-4 text-center",
        children: [/* @__PURE__ */ jsx("div", {
          className: "animate-bounce-slow inline-block text-8xl mb-6",
          children: /* @__PURE__ */ jsx("img", {
            src: "/carambar.png",
            alt: "Carambar",
            className: "h-64 w-auto"
          })
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg",
          children: "Bienvenue chez Carambar Jokes !"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xl md:text-2xl mb-8 max-w-2xl mx-auto",
          children: "Découvre les meilleures blagues Carambar ! Rigole, partage, et ajoute tes propres blagues nulles 😄"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col sm:flex-row gap-4 justify-center",
          children: [/* @__PURE__ */ jsx("button", {
            onClick: () => setMode("all"),
            className: "bg-carambar-blue text-white font-bold text-lg px-8 py-4 rounded-full hover:scale-110 transition shadow-2xl",
            children: "📚 Blagues garanties"
          }), /* @__PURE__ */ jsx("button", {
            onClick: () => setMode("random"),
            className: "bg-white text-carambar-red font-bold text-lg px-8 py-4 rounded-full hover:scale-110 transition shadow-2xl",
            children: "🎲 Mode random"
          }), /* @__PURE__ */ jsx("button", {
            onClick: () => setMode("add"),
            className: "bg-carambar-red text-white font-bold text-lg px-8 py-4 rounded-full hover:scale-110 transition shadow-2xl",
            children: "➕ Ajouter une blague"
          })]
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "py-16 bg-white",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto px-4",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-4xl font-bold text-center text-carambar-blue mb-12",
          children: "Pourquoi Carambar Jokes ? 🤔"
        }), /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-3 gap-8",
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => setMode("all"),
            className: "bg-gradient-to-br from-carambar-yellow to-carambar-orange rounded-xl p-8 text-center shadow-lg hover:scale-105 transition-transform",
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-6xl mb-4",
              children: "😂"
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-2xl font-bold text-carambar-blue mb-3",
              children: "Blagues Garanties"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-gray-700",
              children: "Des blagues testées et approuvées par des générations de mangeurs de Carambar !"
            })]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => setMode("random"),
            className: "bg-gradient-to-br from-carambar-orange to-carambar-red rounded-xl p-8 text-center shadow-lg hover:scale-105 transition-transform",
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-6xl mb-4",
              children: "🎲"
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-2xl font-bold text-white mb-3",
              children: "Mode Random"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-white",
              children: "Laisse le hasard choisir ta prochaine blague ! Surprise garantie à chaque clic."
            })]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => setMode("add"),
            className: "bg-gradient-to-br from-carambar-red to-carambar-blue rounded-xl p-8 text-center shadow-lg hover:scale-105 transition-transform",
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-6xl mb-4",
              children: "➕"
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-2xl font-bold text-white mb-3",
              children: "Ajoute tes Blagues"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-white",
              children: "Tu as une blague nulle à partager ? Ajoute-la et fais rire la communauté !"
            })]
          })]
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "py-16 bg-carambar-light",
      children: /* @__PURE__ */ jsx("div", {
        className: "container mx-auto px-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-3 gap-8 text-center",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-5xl font-bold text-carambar-red mb-2",
              children: "10+"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xl text-carambar-blue font-semibold",
              children: "Blagues Disponibles"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-5xl font-bold text-carambar-orange mb-2",
              children: "100%"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xl text-carambar-blue font-semibold",
              children: "Nulles mais Drôles"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-5xl font-bold text-carambar-yellow mb-2",
              children: "∞"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xl text-carambar-blue font-semibold",
              children: "Fous Rires"
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsxs("section", {
      className: "container mx-auto px-4 py-12",
      children: [loading && /* @__PURE__ */ jsx("p", {
        className: "text-center",
        children: "Chargement..."
      }), !loading && mode === "all" && /* @__PURE__ */ jsx("div", {
        className: "space-y-4",
        children: jokes.map((j) => /* @__PURE__ */ jsxs("div", {
          className: "p-4 border rounded",
          children: [/* @__PURE__ */ jsx("p", {
            className: "font-semibold",
            children: j.question
          }), /* @__PURE__ */ jsx("p", {
            children: j.answer
          })]
        }, j.id))
      }), !loading && mode === "random" && randomJoke && /* @__PURE__ */ jsxs("div", {
        className: "p-4 border rounded max-w-md mx-auto",
        children: [/* @__PURE__ */ jsx("p", {
          className: "font-semibold",
          children: randomJoke.question
        }), /* @__PURE__ */ jsx("p", {
          children: randomJoke.answer
        }), /* @__PURE__ */ jsx("button", {
          onClick: fetchRandomJoke,
          className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition",
          children: "Autre blague"
        })]
      }), !loading && mode === "add" && /* @__PURE__ */ jsx(AddJoke$1, {}), !loading && mode === "idle" && /* @__PURE__ */ jsx("p", {
        className: "text-center text-gray-500",
        children: "Clique sur un bouton ci-dessus pour commencer"
      })]
    })]
  });
};
const Home$1 = UNSAFE_withComponentProps(Home);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home$1
}, Symbol.toStringTag, { value: "Module" }));
const useJokeById = () => {
  const {
    id
  } = useParams();
  const [JokeById2, setJokeById] = useState(null);
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
  return {
    JokeById: JokeById2,
    loading
  };
};
const JokeById = () => {
  const {
    JokeById: JokeById2,
    loading
  } = useJokeById();
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      children: "Loading..."
    });
  }
  if (!JokeById2) {
    return /* @__PURE__ */ jsx("div", {
      children: "No joke found."
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col items-center",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-2xl font-bold mb-4",
      children: "Joke By Id"
    }), /* @__PURE__ */ jsxs("div", {
      className: "mb-2 p-4 border border-gray-700 rounded",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-lg font-semibold",
        children: JokeById2.question
      }), /* @__PURE__ */ jsx("p", {
        className: "text-md",
        children: JokeById2.answer
      })]
    })]
  });
};
const JokeById$1 = UNSAFE_withComponentProps(JokeById);
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: JokeById$1
}, Symbol.toStringTag, { value: "Module" }));
const useRandomJoke = () => {
  const [randomJoke, setRandomJoke] = useState(null);
  const [loading, setLoading] = useState(true);
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
    fetchRandomJoke();
  }, [fetchRandomJoke]);
  return {
    randomJoke,
    loading,
    fetchRandomJoke
  };
};
const RandomJoke = () => {
  const {
    randomJoke,
    loading,
    fetchRandomJoke
  } = useRandomJoke();
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      children: "Loading..."
    });
  }
  if (!randomJoke) {
    return /* @__PURE__ */ jsx("div", {
      children: "No joke found."
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col items-center",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-2xl font-bold mb-4",
      children: "Random Joke"
    }), /* @__PURE__ */ jsxs("div", {
      className: "mb-2 p-4 border border-gray-700 rounded",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-lg font-semibold",
        children: randomJoke.question
      }), /* @__PURE__ */ jsx("p", {
        className: "text-md",
        children: randomJoke.answer
      })]
    }), /* @__PURE__ */ jsx("button", {
      onClick: fetchRandomJoke,
      className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition",
      children: "Autre blague"
    })]
  });
};
const RandomJoke$1 = UNSAFE_withComponentProps(RandomJoke);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RandomJoke$1
}, Symbol.toStringTag, { value: "Module" }));
const root = UNSAFE_withComponentProps(function Main() {
  return /* @__PURE__ */ jsx(HashRouter, {
    children: /* @__PURE__ */ jsx(Routes, {
      children: /* @__PURE__ */ jsxs(Route, {
        path: "/",
        element: /* @__PURE__ */ jsx(AppLayout$1, {}),
        children: [/* @__PURE__ */ jsx(Route, {
          index: true,
          element: /* @__PURE__ */ jsx(Home$1, {})
        }), /* @__PURE__ */ jsx(Route, {
          path: "random",
          element: /* @__PURE__ */ jsx(RandomJoke$1, {})
        }), /* @__PURE__ */ jsx(Route, {
          path: "jokes",
          element: /* @__PURE__ */ jsx(AllJokes$1, {})
        }), /* @__PURE__ */ jsx(Route, {
          path: "jokes/add",
          element: /* @__PURE__ */ jsx(AddJoke$1, {})
        }), /* @__PURE__ */ jsx(Route, {
          path: "jokes/:id",
          element: /* @__PURE__ */ jsx(JokeById$1, {})
        })]
      })
    })
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/carambar-frontassets/entry.client-DfWjoxhu.js", "imports": ["/carambar-frontassets/chunk-EPOLDU6W-BaXdsAFi.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/carambar-frontassets/root-CeMqJSbV.js", "imports": ["/carambar-frontassets/chunk-EPOLDU6W-BaXdsAFi.js", "/carambar-frontassets/AllJokes-BRyn_xOI.js", "/carambar-frontassets/AppLayout-GLdHB5VZ.js", "/carambar-frontassets/Home-Cwv1JDjw.js", "/carambar-frontassets/AddJoke-BdtvLAta.js", "/carambar-frontassets/JokeById-_nXDz50M.js", "/carambar-frontassets/RandomJoke-DchrbxHT.js", "/carambar-frontassets/jokes-DyKBDSR3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/AppLayout": { "id": "routes/AppLayout", "parentId": "root", "path": "/", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/carambar-frontassets/AppLayout-GLdHB5VZ.js", "imports": ["/carambar-frontassets/chunk-EPOLDU6W-BaXdsAFi.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Home": { "id": "routes/Home", "parentId": "routes/AppLayout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/carambar-frontassets/Home-Cwv1JDjw.js", "imports": ["/carambar-frontassets/chunk-EPOLDU6W-BaXdsAFi.js", "/carambar-frontassets/jokes-DyKBDSR3.js", "/carambar-frontassets/AddJoke-BdtvLAta.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/RandomJoke": { "id": "routes/RandomJoke", "parentId": "routes/AppLayout", "path": "random", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/carambar-frontassets/RandomJoke-DchrbxHT.js", "imports": ["/carambar-frontassets/chunk-EPOLDU6W-BaXdsAFi.js", "/carambar-frontassets/jokes-DyKBDSR3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/AllJokes": { "id": "routes/AllJokes", "parentId": "routes/AppLayout", "path": "jokes", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/carambar-frontassets/AllJokes-BRyn_xOI.js", "imports": ["/carambar-frontassets/chunk-EPOLDU6W-BaXdsAFi.js", "/carambar-frontassets/jokes-DyKBDSR3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/jokes/AddJoke": { "id": "routes/jokes/AddJoke", "parentId": "routes/AppLayout", "path": "jokes/add", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/carambar-frontassets/AddJoke-BdtvLAta.js", "imports": ["/carambar-frontassets/chunk-EPOLDU6W-BaXdsAFi.js", "/carambar-frontassets/jokes-DyKBDSR3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/jokes/JokeById": { "id": "routes/jokes/JokeById", "parentId": "routes/AppLayout", "path": "jokes/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/carambar-frontassets/JokeById-_nXDz50M.js", "imports": ["/carambar-frontassets/chunk-EPOLDU6W-BaXdsAFi.js", "/carambar-frontassets/jokes-DyKBDSR3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/carambar-frontassets/manifest-da3e8062.js", "version": "da3e8062", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/carambar-front";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/AppLayout": {
    id: "routes/AppLayout",
    parentId: "root",
    path: "/",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/Home": {
    id: "routes/Home",
    parentId: "routes/AppLayout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/RandomJoke": {
    id: "routes/RandomJoke",
    parentId: "routes/AppLayout",
    path: "random",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/AllJokes": {
    id: "routes/AllJokes",
    parentId: "routes/AppLayout",
    path: "jokes",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/jokes/AddJoke": {
    id: "routes/jokes/AddJoke",
    parentId: "routes/AppLayout",
    path: "jokes/add",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/jokes/JokeById": {
    id: "routes/jokes/JokeById",
    parentId: "routes/AppLayout",
    path: "jokes/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
