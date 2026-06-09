import { useState, useEffect } from "react";

/**
 * Busca os detalhes completos de um pokémon pelo id,
 * incluindo dados de espécie (para breeding, genus, etc).
 */
export function usePokemonDetail(id) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setPokemon(null);
    setSpecies(null);

    const fetchDetail = async () => {
      try {
        const [pkRes, spRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
        ]);

        if (!pkRes.ok || !spRes.ok)
          throw new Error("Falha ao buscar detalhes do pokémon");

        const [pk, sp] = await Promise.all([pkRes.json(), spRes.json()]);

        if (!cancelled) {
          setPokemon(pk);
          setSpecies(sp);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { pokemon, species, loading, error };
}