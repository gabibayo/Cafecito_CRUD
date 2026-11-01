function PedidoList({ pedidos, onEditar, onExcluir }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="card">
      <h2>Lista de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p className="empty">Nenhum pedido cadastrado</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.produto}</td>
                  <td>{pedido.quantidade}</td>
                  <td>{formatCurrency(pedido.valor_total)}</td>
                  <td>
                    <span className={`status status-${pedido.status.replace(/\s+/g, "-").toLowerCase()}`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn btn-edit" onClick={() => onEditar(pedido)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => {
                        if (window.confirm("Deseja realmente excluir este pedido?")) {
                          onExcluir(pedido.id);
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PedidoList;
