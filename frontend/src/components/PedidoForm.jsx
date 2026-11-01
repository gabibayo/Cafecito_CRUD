import { useState, useEffect } from "react";

const STATUS_OPTIONS = ["Pendente", "Em preparo", "Pronto", "Entregue", "Cancelado"];

function PedidoForm({ onAdicionar, onAtualizar, pedidoEditando, onCancelarEdicao, produtoSelecionado }) {
  const [form, setForm] = useState(
    pedidoEditando
      ? {
          cliente: pedidoEditando.cliente,
          produto: pedidoEditando.produto,
          quantidade: pedidoEditando.quantidade,
          preco_unitario: pedidoEditando.preco_unitario,
          status: pedidoEditando.status,
        }
      : {
          cliente: "",
          produto: "",
          quantidade: 1,
          preco_unitario: "",
          status: "Pendente",
        }
  );

  useEffect(() => {
    if (pedidoEditando) {
      setForm({
        cliente: pedidoEditando.cliente,
        produto: pedidoEditando.produto,
        quantidade: pedidoEditando.quantidade,
        preco_unitario: pedidoEditando.preco_unitario,
        status: pedidoEditando.status,
      });
    } else if (produtoSelecionado) {
      setForm((prev) => ({
        ...prev,
        produto: produtoSelecionado.nome,
        preco_unitario: produtoSelecionado.preco,
      }));
    }
  }, [pedidoEditando, produtoSelecionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pedidoEditando) {
      onAtualizar(pedidoEditando.id, {
        cliente: form.cliente,
        produto: form.produto,
        quantidade: Number(form.quantidade),
        preco_unitario: Number(form.preco_unitario),
        status: form.status,
      });
    } else {
      onAdicionar({
        cliente: form.cliente,
        produto: form.produto,
        quantidade: Number(form.quantidade),
        preco_unitario: Number(form.preco_unitario),
      });
    }
    if (!pedidoEditando) {
      setForm({ cliente: "", produto: "", quantidade: 1, preco_unitario: "", status: "Pendente" });
    }
  };

  return (
    <div className="card">
      <h2>{pedidoEditando ? "Editar Pedido" : "Novo Pedido"}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Cliente</label>
          <input
            type="text"
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Produto</label>
          <div className="produto-selecionado">
            <input
              type="text"
              name="produto"
              value={form.produto}
              onChange={handleChange}
              required
            />
            {produtoSelecionado && (
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => {
                  setForm({ ...form, produto: "", preco_unitario: "" });
                }}
              >
                Limpar
              </button>
            )}
          </div>
          {produtoSelecionado && (
            <p className="produto-destaque">
              Selecionado do cardápio: {produtoSelecionado.nome} -
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produtoSelecionado.preco)}
            </p>
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Quantidade</label>
            <input
              type="number"
              name="quantidade"
              min="1"
              value={form.quantidade}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Preço unitário</label>
            <input
              type="number"
              name="preco_unitario"
              min="0"
              step="0.01"
              value={form.preco_unitario}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {pedidoEditando && (
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {pedidoEditando ? "Salvar" : "Adicionar pedido"}
          </button>
          {pedidoEditando && (
            <button type="button" className="btn btn-secondary" onClick={onCancelarEdicao}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PedidoForm;
