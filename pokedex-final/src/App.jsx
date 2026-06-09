import { useState, useEffect, useCallback } from "react";

// ─── Type color map ────────────────────────────────────────────────────────────
const TYPE_COLORS = {
  fire: { bg: "#FF9741", light: "#FFE0C0", dark: "#CC6600" },
  water: { bg: "#4FC3F7", light: "#C0E8FF", dark: "#0077B6" },
  grass: { bg: "#63BB5A", light: "#C6F0C2", dark: "#2E7D32" },
  poison: { bg: "#9C6ADE", light: "#E8D5FF", dark: "#6A1E9A" },
  electric: { bg: "#F9CF30", light: "#FFF5C0", dark: "#B8860B" },
  psychic: { bg: "#F87060", light: "#FFD0CC", dark: "#C62828" },
  ice: { bg: "#74D7E8", light: "#C8F4FF", dark: "#006978" },
  dragon: { bg: "#7B68EE", light: "#D8D4FF", dark: "#3700B3" },
  dark: { bg: "#4E4E6A", light: "#D0CFE0", dark: "#1A1A2E" },
  fairy: { bg: "#F4A7C3", light: "#FFE4F0", dark: "#AD1457" },
  fighting: { bg: "#D56723", light: "#FFD9B8", dark: "#8B2500" },
  flying: { bg: "#8BA8EA", light: "#D8E4FF", dark: "#3A5BBF" },
  rock: { bg: "#C5A34A", light: "#F0E5C0", dark: "#7B5E00" },
  ground: { bg: "#D97C3B", light: "#FFE4C4", dark: "#8B4513" },
  bug: { bg: "#9BCB40", light: "#E4F5C0", dark: "#558B2F" },
  ghost: { bg: "#7A6EA0", light: "#DDD8F0", dark: "#4A148C" },
  steel: { bg: "#A8A8C8", light: "#E8E8F5", dark: "#455A64" },
  normal: { bg: "#AAAA88", light: "#E8E8D8", dark: "#616161" },
};

const getTypeStyle = (type) => TYPE_COLORS[type] || TYPE_COLORS.normal;

// ─── Custom hook ───────────────────────────────────────────────────────────────
function usePokemon() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchList = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0");
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
    return () => { cancelled = true; };
  }, []);

  return { list, loading, error };
}

function usePokemonDetail(id) {
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
        if (!pkRes.ok || !spRes.ok) throw new Error("Falha ao buscar detalhes do pokémon");
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
    return () => { cancelled = true; };
  }, [id]);

  return { pokemon, species, loading, error };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const padId = (n) => String(n).padStart(3, "0");
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const formatHeight = (h) => {
  const cm = h * 10;
  const inches = Math.round(cm / 2.54);
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}" (${(cm / 100).toFixed(2)} m)`;
};
const formatWeight = (w) => {
  const kg = w / 10;
  return `${(kg * 2.205).toFixed(1)} lbs (${kg.toFixed(1)} kg)`;
};

const STAT_LABELS = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

// ─── Components ────────────────────────────────────────────────────────────────

function TypeBadge({ type, small }) {
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

function PokemonCard({ pokemon, onClick }) {
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
      {/* Pokéball decoration */}
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

function StatBar({ name, value }) {
  const max = 255;
  const pct = Math.min(100, (value / max) * 100);
  const color =
    value >= 90 ? "#4CAF50" : value >= 60 ? "#FF9800" : "#F44336";

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10, gap: 8 }}>
      <span style={{ width: 58, fontSize: 12, fontWeight: 700, color: "#555", textAlign: "right", flexShrink: 0 }}>
        {STAT_LABELS[name] || name}
      </span>
      <span style={{ width: 30, fontSize: 13, fontWeight: 800, color: "#222", textAlign: "right", flexShrink: 0 }}>
        {value}
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          borderRadius: 8,
          background: "#eee",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 8,
            background: color,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px 0",
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        color: active ? "#222" : "#999",
        borderBottom: active ? "2px solid #222" : "2px solid transparent",
        transition: "all 0.2s",
        marginRight: 24,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function DetailView({ id, onBack }) {
  const { pokemon, species, loading, error } = usePokemonDetail(id);
  const [tab, setTab] = useState("about");

  const primaryType = pokemon?.types?.[0]?.type?.name || "normal";
  const typeStyle = getTypeStyle(primaryType);

  const sprite =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default;

  const speciesNameEn = species?.genera?.find((g) => g.language.name === "en")?.genus || "";

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <LoadingSpinner color={typeStyle.bg} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Header hero */}
      <div
        style={{
          background: `linear-gradient(160deg, ${typeStyle.bg} 0%, ${typeStyle.dark} 100%)`,
          borderRadius: "0 0 32px 32px",
          padding: "20px 24px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Pokéball bg */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "36px solid rgba(255,255,255,0.1)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <button
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,0.25)",
              border: "none",
              borderRadius: 12,
              padding: "8px 14px",
              cursor: "pointer",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              backdropFilter: "blur(4px)",
            }}
          >
            ← Voltar
          </button>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: 700 }}>
            #{padId(pokemon.id)}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div style={{ flex: 1, paddingBottom: 24 }}>
            <h1 style={{ margin: "0 0 8px", color: "#fff", fontSize: "clamp(24px, 5vw, 34px)", fontWeight: 900, lineHeight: 1.1 }}>
              {capitalize(pokemon.name)}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
          </div>
          {sprite && (
            <img
              src={sprite}
              alt={pokemon.name}
              style={{
                width: "clamp(140px, 30vw, 200px)",
                height: "clamp(140px, 30vw, 200px)",
                objectFit: "contain",
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 24px", borderBottom: "1px solid #f0f0f0", marginTop: 4 }}>
        <TabButton label="Sobre" active={tab === "about"} onClick={() => setTab("about")} />
        <TabButton label="Stats" active={tab === "stats"} onClick={() => setTab("stats")} />
        <TabButton label="Movimentos" active={tab === "moves"} onClick={() => setTab("moves")} />
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px" }}>
        {tab === "about" && (
          <div>
            <InfoRow label="Espécie" value={speciesNameEn || "—"} />
            <InfoRow label="Altura" value={formatHeight(pokemon.height)} />
            <InfoRow label="Peso" value={formatWeight(pokemon.weight)} />
            <InfoRow
              label="Habilidades"
              value={pokemon.abilities.map((a) => capitalize(a.ability.name.replace("-", " "))).join(", ")}
            />

            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "20px 0 12px", color: "#222" }}>Criação</h3>
            {species && (
              <>
                <InfoRow
                  label="Gênero"
                  value={
                    species.gender_rate === -1
                      ? "Sem gênero"
                      : `♂ ${(((8 - species.gender_rate) / 8) * 100).toFixed(1)}%   ♀ ${((species.gender_rate / 8) * 100).toFixed(1)}%`
                  }
                />
                <InfoRow
                  label="Grupos de Ovo"
                  value={species.egg_groups.map((e) => capitalize(e.name)).join(", ")}
                />
              </>
            )}
          </div>
        )}

        {tab === "stats" && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 16px", color: "#222" }}>Stats Base</h3>
            {pokemon.stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
            <StatBar
              name="total"
              value={pokemon.stats.reduce((a, s) => a + s.base_stat, 0)}
            />
          </div>
        )}

        {tab === "moves" && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px", color: "#222" }}>
              Movimentos ({pokemon.moves.slice(0, 20).length} de {pokemon.moves.length})
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {pokemon.moves.slice(0, 40).map((m) => (
                <span
                  key={m.move.name}
                  style={{
                    background: typeStyle.light,
                    color: typeStyle.dark,
                    border: `1px solid ${typeStyle.bg}40`,
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {m.move.name.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "10px 0",
        borderBottom: "1px solid #f5f5f5",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span style={{ width: 90, color: "#999", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#222", fontSize: 13, fontWeight: 600, flex: 1 }}>{value}</span>
    </div>
  );
}

function LoadingSpinner({ color = "#4FC3F7" }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 44,
          height: 44,
          border: `4px solid #eee`,
          borderTop: `4px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px",
        }}
      />
      <p style={{ color: "#999", fontSize: 14 }}>Carregando…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div style={{ textAlign: "center", padding: 32 }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>😵</div>
      <p style={{ color: "#E53935", fontWeight: 700, fontSize: 15 }}>Algo deu errado</p>
      <p style={{ color: "#999", fontSize: 13 }}>{message}</p>
    </div>
  );
}

function Sidebar({ list, loading, error, selected, onSelect }) {
  return (
    <div
      style={{
        width: "clamp(260px, 28vw, 340px)",
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "28px 20px 16px",
          borderBottom: "1px solid #f5f5f5",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF5252 50%, #fff 50%)",
              border: "3px solid #222",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: -0.5, color: "#1a1a2e" }}>
            Pokédex
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "#aaa", fontWeight: 500 }}>
          Primeira geração — 20 pokémons
        </p>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 24px" }}>
        {loading && (
          <div style={{ paddingTop: 40 }}>
            <LoadingSpinner />
          </div>
        )}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10,
            }}
          >
            {list.map((pk) => (
              <div
                key={pk.id}
                style={{
                  outline: selected === pk.id ? "3px solid #1a1a2e" : "none",
                  borderRadius: 18,
                  transition: "outline 0.15s",
                }}
              >
                <PokemonCard pokemon={pk} onClick={onSelect} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const { list, loading, error } = usePokemon();
  const [selectedId, setSelectedId] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "detail"

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setMobileView("detail");
  }, []);

  const handleBack = useCallback(() => {
    setMobileView("list");
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif",
        background: "#F7F8FC",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #bbb; }
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

        /* Desktop layout */
        .poke-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar { display: flex !important; }
        .detail-pane {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .empty-state { display: flex; }

        /* Mobile overrides */
        @media (max-width: 700px) {
          .poke-shell { display: block; height: auto; overflow: visible; }
          .sidebar {
            display: ${`var(--sidebar-mobile-display)`} !important;
            width: 100% !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid #f0f0f0;
          }
          .detail-pane {
            display: ${`var(--detail-mobile-display)`} !important;
            min-height: 100vh;
          }
          .empty-state { display: none !important; }
        }
      `}</style>

      <div
        className="poke-shell"
        style={{
          "--sidebar-mobile-display": mobileView === "list" ? "flex" : "none",
          "--detail-mobile-display": mobileView === "detail" ? "flex" : "none",
        }}
      >
        {/* Sidebar */}
        <div className="sidebar" style={{ display: "flex" }}>
          <Sidebar
            list={list}
            loading={loading}
            error={error}
            selected={selectedId}
            onSelect={handleSelect}
          />
        </div>

        {/* Detail pane */}
        <div className="detail-pane" style={{ background: "#F7F8FC" }}>
          {selectedId ? (
            <DetailView id={selectedId} onBack={handleBack} />
          ) : (
            <div
              className="empty-state"
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
                color: "#bbb",
                minHeight: "100vh",
              }}
            >
              <div style={{ fontSize: 64 }}>⚡</div>
              <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Selecione um Pokémon</p>
              <p style={{ fontSize: 13, margin: 0 }}>Clique em um card para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}