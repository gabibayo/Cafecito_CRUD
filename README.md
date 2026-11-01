# Projeto: Sistema de Gerenciamento de Pedidos de Cafeteria

## Descrição

Aplicação web para gerenciar os pedidos de uma cafeteria, desenvolvida com **Python, FastAPI, React e JSON**. O sistema implementa um CRUD completo de pedidos, demonstrando os conceitos de Programação Orientada a Objetos (POO), criação de API REST com FastAPI e integração com interface em React.

## Tecnologias Utilizadas

### Backend
- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic
- Biblioteca nativa `json`

### Frontend
- React 18
- Vite
- JavaScript (ES6+)
- CSS puro
- Fetch API

### Persistência
- Arquivo `backend/data/pedidos.json` (biblioteca nativa `json`)

## Estrutura de Pastas

```text
cafeteria/
│
├── backend/
│   ├── main.py
│   ├── models/
│   │   └── pedido.py
│   ├── services/
│   │   └── gerenciador_pedidos.py
│   ├── schemas/
│   │   └── pedido_schema.py
│   ├── data/
│   │   └── pedidos.json
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PedidoForm.jsx
│   │   │   └── PedidoList.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

## Conceitos de POO Aplicados

### Classe `Pedido` (models/pedido.py)
- **Abstração**: Representa um pedido com todos os seus atributos e comportamentos.
- **Encapsulamento**: Utiliza atributos privados com getters/setters via `@property`, protegendo o acesso aos dados.
- **Métodos**: `calcular_total()`, `atualizar_status()`, `to_dict()`, `from_dict()` concentram regras relacionadas ao pedido.

### Classe `GerenciadorPedidos` (services/gerenciador_pedidos.py)
- **Abstração**: Gerencia toda a lógica de negócio e persistência dos pedidos.
- **Encapsulamento**: Centraliza operações CRUD e regras de validação.
- **Responsabilidade única**: Separa gerenciamento/persistência dos endpoints da API.

## Instruções de Instalação

### Backend
```bash
cd cafeteria/backend
pip install -r requirements.txt
```

### Frontend
```bash
cd cafeteria/frontend
npm install
```

## Como Executar

### Executar Backend
```bash
cd cafeteria/backend
uvicorn main:app --reload
```
A API estará disponível em: `http://localhost:8000`  
Documentação automática: `http://localhost:8000/docs`

### Executar Frontend
```bash
cd cafeteria/frontend
npm run dev
```
A aplicação estará disponível em: `http://localhost:5173`

## Endpoints da API

| Método | Endpoint | Funcionalidade |
|---|---|---|
| POST | `/pedidos` | Criar pedido (retorna 201) |
| GET | `/pedidos` | Listar todos os pedidos |
| GET | `/pedidos/{id}` | Buscar pedido por ID (retorna 404 se não existir) |
| PUT | `/pedidos/{id}` | Atualizar pedido (retorna 404 se não existir, 422 para dados inválidos) |
| DELETE | `/pedidos/{id}` | Excluir pedido (retorna 404 se não existir) |

## Armazenamento no JSON

- Os pedidos são armazenados em `backend/data/pedidos.json`
- Utiliza-se `json.load()` para leitura e `json.dump()` com `indent=4` e `ensure_ascii=False`
- Arquivo criado automaticamente se não existir, inicializado com lista vazia
- Gravação feita em arquivo temporário e substituição atômica para evitar corrupção
- IDs únicos gerados mesmo após exclusões
- Dados salvos após cada operação de criação, atualização ou exclusão
- Tratamento de erros para arquivos corrompidos (não sobrescreve silenciosamente)
