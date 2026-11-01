from fastapi import APIRouter
from . import pedidos

router = APIRouter()
router.include_router(pedidos.router)

@router.get("/")
def root():
    return {"message": "API Cafeteria"}
