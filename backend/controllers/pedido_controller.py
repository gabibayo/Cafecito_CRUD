from services.gerenciador_pedidos import GerenciadorPedidos

class PedidoController:
    def __init__(self):
        self.gerenciador = GerenciadorPedidos()
        self.STATUS_PERMITIDOS = ["Pendente", "Em preparo", "Pronto", "Entregue", "Cancelado"]
    
    def criar(self, dados):
        try:
            return self.gerenciador.criar_pedido(dados)
        except ValueError as e:
            raise e
    
    def listar(self):
        return self.gerenciador.listar_pedidos()
    
    def buscar(self, id):
        pedido = self.gerenciador.buscar_pedido(id)
        if not pedido:
            return None
        return pedido.to_dict()
    
    def atualizar(self, id, dados):
        if 'status' in dados and dados['status'] not in self.STATUS_PERMITIDOS:
            raise ValueError("Status inválido")
        try:
            return self.gerenciador.atualizar_pedido(id, dados)
        except ValueError as e:
            raise e
    
    def excluir(self, id):
        return self.gerenciador.excluir_pedido(id)
