from pydantic import BaseModel, Field
from typing import Optional

class PedidoCreate(BaseModel):
    cliente: str = Field(..., min_length=1)
    produto: str = Field(..., min_length=1)
    quantidade: int = Field(..., gt=0)
    preco_unitario: float = Field(..., ge=0)

class PedidoUpdate(BaseModel):
    cliente: Optional[str] = Field(None, min_length=1)
    produto: Optional[str] = Field(None, min_length=1)
    quantidade: Optional[int] = Field(None, gt=0)
    preco_unitario: Optional[float] = Field(None, ge=0)
    status: Optional[str] = None

class PedidoResponse(BaseModel):
    id: int
    cliente: str
    produto: str
    quantidade: int
    preco_unitario: float
    valor_total: float
    status: str
