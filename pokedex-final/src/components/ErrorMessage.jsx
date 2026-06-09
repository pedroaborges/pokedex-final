/**
 * Exibe uma mensagem de erro amigável com ícone.
 * @param {string} message - texto do erro
 */
export function ErrorMessage({ message }) {
  return (
    <div style={{ textAlign: "center", padding: 32 }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>😵</div>
      <p style={{ color: "#E53935", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>
        Algo deu errado
      </p>
      <p style={{ color: "#999", fontSize: 13, margin: 0 }}>{message}</p>
    </div>
  );
}