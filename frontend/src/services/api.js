const API_URL = "http://localhost:8000/pedidos";

export async function listarPedidos() {
  const response = await fetch(`${API_URL}/`);
  if (!response.ok) {
    throw new Error("Erro ao buscar ");
  }
  return response.json();
}

export async function criarPedido(dados) {
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Erro ao criar pedido");
  }
  return response.json();
}

export async function buscarPedido(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar pedido");
  }
  return response.json();
}

export async function atualizarPedido(id, dados) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Erro ao atualizar pedido");
  }
  return response.json();
}

export async function excluirPedido(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Erro ao excluir pedido");
  }
  return response.json();
}
