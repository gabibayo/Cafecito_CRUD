import json
import os
import tempfile
from models.pedido import Pedido

class GerenciadorPedidos:
    STATUS_PERMITIDOS = ["Pendente", "Em preparo", "Pronto", "Entregue", "Cancelado"]
    
    def __init__(self, arquivo="data/pedidos.json"):
        self.arquivo = arquivo
        self.pedidos = []
        self.carregar_pedidos()
    
    def carregar_pedidos(self):
        try:
            if not os.path.exists(self.arquivo):
                os.makedirs(os.path.dirname(self.arquivo), exist_ok=True)
                self.salvar_pedidos([])
                self.pedidos = []
                return
            
            with open(self.arquivo, 'r', encoding='utf-8') as f:
                conteudo = f.read()
                if not conteudo.strip():
                    self.pedidos = []
                    return
                dados = json.loads(conteudo)
                self.pedidos = [Pedido.from_dict(p) for p in dados]
        except (json.JSONDecodeError, IOError):
            # Don't overwrite if corrupted; keep empty list but try to be safe
            self.pedidos = []
        except Exception:
            self.pedidos = []
    
    def salvar_pedidos(self, lista_pedidos=None):
        if lista_pedidos is None:
            lista_pedidos = [p.to_dict() for p in self.pedidos]
        os.makedirs(os.path.dirname(self.arquivo), exist_ok=True)
        # Write to temp file then replace
        dir_name = os.path.dirname(os.path.abspath(self.arquivo)) or '.'
        fd, tmp_path = tempfile.mkstemp(dir=dir_name, prefix='pedidos_', suffix='.json')
        try:
            with os.fdopen(fd, 'w', encoding='utf-8') as f:
                json.dump(lista_pedidos, f, indent=4, ensure_ascii=False)
            os.replace(tmp_path, self.arquivo)
        except Exception:
            try:
                os.close(fd)
            except:
                pass
            try:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
            except:
                pass
            raise
    
    def _gerar_novo_id(self):
        if not self.pedidos:
            return 1
        return max(p.id for p in self.pedidos) + 1
    
    def criar_pedido(self, dados):
        novo_id = self._gerar_novo_id()
        cliente = dados.get('cliente', '').strip()
        produto = dados.get('produto', '').strip()
        quantidade = int(dados.get('quantidade', 0))
        preco_unitario = float(dados.get('preco_unitario', 0.0))
        status = dados.get('status', 'Pendente')
        
        if not cliente or not produto:
            raise ValueError("Cliente e produto não podem estar vazios")
        if quantidade <= 0:
            raise ValueError("Quantidade deve ser maior que zero")
        if preco_unitario < 0:
            raise ValueError("Preço unitário não pode ser negativo")
        if status not in self.STATUS_PERMITIDOS:
            raise ValueError("Status inválido")
        
        pedido = Pedido(novo_id, cliente, produto, quantidade, preco_unitario, status)
        self.pedidos.append(pedido)
        self.salvar_pedidos()
        return pedido.to_dict()
    
    def listar_pedidos(self):
        return [p.to_dict() for p in self.pedidos]
    
    def buscar_pedido(self, id):
        for p in self.pedidos:
            if p.id == int(id):
                return p
        return None
    
    def atualizar_pedido(self, id, dados):
        pedido = self.buscar_pedido(id)
        if not pedido:
            return None
        
        if 'cliente' in dados:
            cliente = str(dados['cliente']).strip()
            if not cliente:
                raise ValueError("Cliente não pode estar vazio")
            pedido.cliente = cliente
        
        if 'produto' in dados:
            produto = str(dados['produto']).strip()
            if not produto:
                raise ValueError("Produto não pode estar vazio")
            pedido.produto = produto
        
        if 'quantidade' in dados:
            quantidade = int(dados['quantidade'])
            if quantidade <= 0:
                raise ValueError("Quantidade deve ser maior que zero")
            pedido.quantidade = quantidade
        
        if 'preco_unitario' in dados:
            preco_unitario = float(dados['preco_unitario'])
            if preco_unitario < 0:
                raise ValueError("Preço unitário não pode ser negativo")
            pedido.preco_unitario = preco_unitario
        
        if 'status' in dados:
            status = dados['status']
            if status not in self.STATUS_PERMITIDOS:
                raise ValueError("Status inválido")
            pedido.status = status
        
        # Recalcular total if changed
        pedido._valor_total = pedido.calcular_total()
        self.salvar_pedidos()
        return pedido.to_dict()
    
    def excluir_pedido(self, id):
        pedido = self.buscar_pedido(id)
        if not pedido:
            return False
        self.pedidos = [p for p in self.pedidos if p.id != int(id)]
        self.salvar_pedidos()
        return True
