import { useState, useEffect } from "react";

/**
 * Busca os primeiros 20 pokémons da PokéAPI
 * com todos os seus detalhes em paralelo.
 */
export function usePokemonList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchList = async () => {
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
        );
        if (!res.ok) throw new Error("Falha ao buscar lista de pokémons");
        const data = await res.json();

        const details = await Promise.all(
          data.results.map((p) =>
            fetch(p.url).then((r) => {
              if (!r.ok) throw new Error("Falha ao buscar detalhes");
              return r.json();
            })
          )
        );

        if (!cancelled) {
          setList(details);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      }
    };

    fetchList();
    return () => {
      cancelled = true;
    };
  }, []);

  return { list, loading, error };
}