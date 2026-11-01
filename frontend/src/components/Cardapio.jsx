import { cardapio } from "../data/cardapio";

function Cardapio({ onSelecionar, produtosSelecionados }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const isSelecionado = (id) =>
    produtosSelecionados.some((p) => p.id === id);

  return (
    <div className="card">
      <h2>☕ Cardápio da Cafeteria</h2>
      <div className="cardapio-grid">
        {cardapio.map((item) => {
          const selecionado = isSelecionado(item.id);
          return (
            <div
              key={item.id}
              className={`cardapio-item ${selecionado ? "selecionado" : ""}`}
              onClick={() => onSelecionar(item)}
            >
              <div className="cardapio-info">
                <h3>{item.nome}</h3>
                <p className="cardapio-desc">{item.descricao}</p>
                <span className="cardapio-categoria">{item.categoria}</span>
              </div>
              <div className="cardapio-preco">{formatCurrency(item.preco)}</div>
              {selecionado && <span className="cardapio-check">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Cardapio;
