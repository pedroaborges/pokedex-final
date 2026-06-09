import { getTypeStyle } from "../utils/typeColors";

/**
 * Badge colorido que representa o tipo do pokémon.
 * @param {string} type  - nome do tipo (ex: "fire", "water")
 * @param {boolean} small - versão reduzida para uso nos cards da lista
 */
export function TypeBadge({ type, small = false }) {
  const style = getTypeStyle(type);

  return (
    <span
      style={{
        background: style.bg,
        color: "#fff",
        borderRadius: 20,
        padding: small ? "2px 8px" : "3px 12px",
        fontSize: small ? 10 : 12,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "capitalize",
        display: "inline-block",
        marginRight: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }}
    >
      {type}
    </span>
  );
}