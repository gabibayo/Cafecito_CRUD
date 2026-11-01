from fastapi import APIRouter, HTTPException, status
from schemas.pedido_schema import PedidoCreate, PedidoUpdate
from controllers.pedido_controller import PedidoController

router = APIRouter(prefix="/pedidos", tags=["pedidos"])
controller = PedidoController()

@router.post("/", status_code=status.HTTP_201_CREATED)
def criar_pedido(pedido: PedidoCreate):
    try:
        return controller.criar(pedido.dict())
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.get("/")
def listar_pedidos():
    return controller.listar()

@router.get("/{id}")
def buscar_pedido(id: int):
    pedido = controller.buscar(id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return pedido

@router.put("/{id}")
def atualizar_pedido(id: int, pedido: PedidoUpdate):
    try:
        dados = {k: v for k, v in pedido.dict().items() if v is not None}
        resultado = controller.atualizar(id, dados)
        if not resultado:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
        return resultado
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.delete("/{id}")
def excluir_pedido(id: int):
    resultado = controller.excluir(id)
    if not resultado:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return {"message": "Pedido excluído com sucesso"}
