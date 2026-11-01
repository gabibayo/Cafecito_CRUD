import { useState, useEffect } from "react";
import "./App.css";
import PedidoForm from "./components/PedidoForm";
import PedidoList from "./components/PedidoList";
import Cardapio from "./components/Cardapio";
import { listarPedidos, criarPedido, atualizarPedido, excluirPedido } from "./services/api";

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [clienteMultiplo, setClienteMultiplo] = useState("");
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const carregarPedidos = async () => {
    try {
      const data = await listarPedidos();
      setPedidos(data);
    } catch (error) {
      mostrarMensagem("erro", error.message);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const mostrarMensagem = (tipo, texto) => {
    setMensagem({ tipo, texto });
    setTimeout(() => {
      setMensagem({ tipo: "", texto: "" });
    }, 3000);
  };

  const handleAdicionarMultiplos = async () => {
    if (produtosSelecionados.length === 0) {
      mostrarMensagem("erro", "Selecione ao menos um produto do cardápio");
      return;
    }
    if (!clienteMultiplo.trim()) {
      mostrarMensagem("erro", "Informe o cliente para os pedidos");
      return;
    }
    try {
      for (const produto of produtosSelecionados) {
        const qtd = quantidades[produto.id] || 1;
        await criarPedido({
          cliente: clienteMultiplo.trim(),
          produto: produto.nome,
          quantidade: qtd,
          preco_unitario: produto.preco,
        });
      }
      await carregarPedidos();
      setProdutosSelecionados([]);
      setQuantidades({});
      setClienteMultiplo("");
      mostrarMensagem("sucesso", `${produtosSelecionados.length} pedido(s) cadastrado(s)!`);
    } catch (error) {
      mostrarMensagem("erro", error.message);
    }
  };

  const handleAtualizar = async (id, dados) => {
    try {
      await atualizarPedido(id, dados);
      await carregarPedidos();
      setPedidoEditando(null);
      mostrarMensagem("sucesso", "Pedido atualizado com sucesso!");
    } catch (error) {
      mostrarMensagem("erro", error.message);
    }
  };

  const handleExcluir = async (id) => {
    try {
      await excluirPedido(id);
      await carregarPedidos();
      mostrarMensagem("sucesso", "Pedido excluído com sucesso!");
    } catch (error) {
      mostrarMensagem("erro", error.message);
    }
  };

  const handleEditar = (pedido) => {
    setPedidoEditando(pedido);
    setProdutosSelecionados([]);
  };

  const handleCancelarEdicao = () => {
    setPedidoEditando(null);
  };

  const handleSelecionarProduto = (item) => {
    setPedidoEditando(null);
    const jaSelecionado = produtosSelecionados.some((p) => p.id === item.id);
    if (jaSelecionado) {
      setProdutosSelecionados(produtosSelecionados.filter((p) => p.id !== item.id));
      setQuantidades((prev) => {
        const novo = { ...prev };
        delete novo[item.id];
        return novo;
      });
    } else {
      setProdutosSelecionados([...produtosSelecionados, item]);
      setQuantidades((prev) => ({ ...prev, [item.id]: 1 }));
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>☕ Cafecito</h1>
      </header>

      {mensagem.texto && (
        <div className={`mensagem mensagem-${mensagem.tipo}`}>{mensagem.texto}</div>
      )}

      <main className="main">
        <Cardapio
          onSelecionar={handleSelecionarProduto}
          produtosSelecionados={produtosSelecionados}
        />

        {produtosSelecionados.length > 0 && (
          <div className="card cardapio-selecao">
            <h3>Produtos selecionados ({produtosSelecionados.length})</h3>
            <div className="produtos-selecionados-lista">
              {produtosSelecionados.map((p) => {
                const qtd = quantidades[p.id] || 1;
                return (
                  <div key={p.id} className="produto-selecionado-item">
                    <span>{p.nome}</span>
                    <span className="preco">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(p.preco)}
                    </span>
                    <div className="quantidade-controle">
                      <label htmlFor={`qtd-${p.id}`}>Qtd:</label>
                      <input
                        id={`qtd-${p.id}`}
                        type="number"
                        min="1"
                        value={qtd}
                        onChange={(e) =>
                          setQuantidades((prev) => ({
                            ...prev,
                            [p.id]: Math.max(1, Number(e.target.value) || 1),
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="form-group">
              <label>Cliente para todos os pedidos</label>
              <input
                type="text"
                value={clienteMultiplo}
                onChange={(e) => setClienteMultiplo(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <button
              className="btn btn-primary btn-largo"
              onClick={handleAdicionarMultiplos}
            >
              Adicionar todos como pedidos
            </button>
          </div>
        )}

        {pedidoEditando && (
          <PedidoForm
            onAdicionar={handleAdicionarMultiplos}
            onAtualizar={handleAtualizar}
            pedidoEditando={pedidoEditando}
            onCancelarEdicao={handleCancelarEdicao}
          />
        )}

        <PedidoList
          pedidos={pedidos}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      </main>
    </div>
  );
}

export default App;
