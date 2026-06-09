/**
 * Spinner de carregamento animado.
 * @param {string} color - cor do arco girando (padrão azul claro)
 */
export function LoadingSpinner({ color = "#4FC3F7" }) {
  return (
    <div style={{ textAlign: "center" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div
        style={{
          width: 44,
          height: 44,
          border: "4px solid #eee",
          borderTop: `4px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px",
        }}
      />
      <p style={{ color: "#999", fontSize: 14, margin: 0 }}>Carregando…</p>
    </div>
  );
}
