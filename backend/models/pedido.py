class Pedido:
    def __init__(self, id, cliente, produto, quantidade, preco_unitario, status="Pendente"):
        self._id = id
        self._cliente = cliente
        self._produto = produto
        self._quantidade = quantidade
        self._preco_unitario = preco_unitario
        self._status = status
        self._valor_total = self.calcular_total()
    
    @property
    def id(self):
        return self._id
    
    @property
    def cliente(self):
        return self._cliente
    
    @cliente.setter
    def cliente(self, valor):
        self._cliente = valor
    
    @property
    def produto(self):
        return self._produto
    
    @produto.setter
    def produto(self, valor):
        self._produto = valor
    
    @property
    def quantidade(self):
        return self._quantidade
    
    @quantidade.setter
    def quantidade(self, valor):
        self._quantidade = valor
        self._valor_total = self.calcular_total()
    
    @property
    def preco_unitario(self):
        return self._preco_unitario
    
    @preco_unitario.setter
    def preco_unitario(self, valor):
        self._preco_unitario = valor
        self._valor_total = self.calcular_total()
    
    @property
    def valor_total(self):
        return self._valor_total
    
    @property
    def status(self):
        return self._status
    
    @status.setter
    def status(self, valor):
        self._status = valor
    
    def calcular_total(self):
        return round(float(self._quantidade) * float(self._preco_unitario), 2)
    
    def atualizar_status(self, novo_status):
        self._status = novo_status
    
    def to_dict(self):
        return {
            "id": self._id,
            "cliente": self._cliente,
            "produto": self._produto,
            "quantidade": self._quantidade,
            "preco_unitario": self._preco_unitario,
            "valor_total": self._valor_total,
            "status": self._status
        }
    
    @staticmethod
    def from_dict(dados):
        pedido = Pedido(
            dados["id"],
            dados["cliente"],
            dados["produto"],
            dados["quantidade"],
            dados["preco_unitario"],
            dados.get("status", "Pendente")
        )
        # Ensure valor_total matches
        pedido._valor_total = round(float(dados.get("valor_total", pedido.calcular_total())), 2)
        return pedido
