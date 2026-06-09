import { getTypeStyle } from "../utils/typeColors";
import { padId, capitalize } from "../utils/helpers";
import { TypeBadge } from "./TypeBadge";

/**
 * Card de pokémon exibido na lista lateral.
 * Cor de fundo baseada no tipo primário.
 *
 * @param {object} pokemon - dados do pokémon vindos da PokéAPI
 * @param {function} onClick - callback ao clicar, recebe o id do pokémon
 */
export function PokemonCard({ pokemon, onClick }) {
  const primaryType = pokemon.types[0].type.name;
  const typeStyle = getTypeStyle(primaryType);
  const sprite =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  return (
    <div
      onClick={() => onClick(pokemon.id)}
      style={{
        background: `linear-gradient(135deg, ${typeStyle.bg} 0%, ${typeStyle.dark} 100%)`,
        borderRadius: 16,
        padding: "14px 14px 10px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.18s, box-shadow 0.18s",
        boxShadow: "0 4px 14px rgba(0,0,0,0.13)",
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.13)";
      }}
    >
      {/* Decoração Pokébola */}
      <div
        style={{
          position: "absolute",
          right: -18,
          bottom: -18,
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: "18px solid rgba(255,255,255,0.12)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: "10px solid rgba(255,255,255,0.08)",
          pointerEvents: "none",
        }}
      />

      <div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>
          #{padId(pokemon.id)}
        </div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.2, marginBottom: 6 }}>
          {capitalize(pokemon.name)}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} small />
          ))}
        </div>
      </div>

      {sprite && (
        <img
          src={sprite}
          alt={pokemon.name}
          style={{
            position: "absolute",
            right: 4,
            bottom: 0,
            width: 72,
            height: 72,
            objectFit: "contain",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
          }}
        />
      )}
    </div>
  );
}