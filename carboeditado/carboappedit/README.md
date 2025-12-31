# 📦 CARBOAPP - Sistema de Gestão Logística e Delivery

> **Versão:** 2.0.0 (Ready for Scale)  
> **Arquitetura:** Frontend Monolítico Modular com Mock Backend em Memória.  
> **Stack:** React 19, TypeScript, Vite, TailwindCSS, Recharts, Framer Motion.

---

## 🏗️ Arquitetura do Sistema

Este projeto foi desenhado para ser **auto-contido**, **performático** e **visualmente robusto**. Ele simula um ecossistema completo de delivery (Cliente, Vendedor, Entregador, Admin) rodando inteiramente no navegador.

### 1. Núcleo Lógico (`services/carboSystem.ts`)
O sistema não utiliza um backend externo tradicional nesta versão. Toda a lógica de negócios, banco de dados e regras de transição de estado residem no **CarboSystem**, um serviço *Singleton* que implementa:
- **Padrão Observer:** Para reatividade em tempo real entre componentes.
- **Banco de Dados em Memória:** Arrays e Objetos atuam como tabelas relacionais.
- **Máquina de Estado:** Controla fluxos de pedidos (Novo -> Preparando -> Entrega -> Finalizado).

### 2. Roteamento Contextual (`App.tsx`)
Diferente de SPAs tradicionais, o CarboApp utiliza um **Roteamento Baseado em Papel (Role-Based Rendering)**.
- O estado `userRole` define qual "Módulo" (Admin, Vendor, Client, Delivery) é carregado.
- Isso garante isolamento total de contextos e segurança visual.

### 3. Design System (`UIComponents.tsx` & `index.css`)
- **Estilo:** Glassmorphism Profundo (iOS/MacOS inspired) + Identidade Escura/Laranja.
- **Regras:**
  - Não usar sombras puras pretas (usar sombras coloridas/ambiente).
  - Bordas translúcidas em todos os cartões.
  - Animações fluidas via `framer-motion` para todas as transições de estado.

---

## 📂 Estrutura de Pastas

```bash
/
├── src/
│   ├── components/      # Componentes UI Reutilizáveis (Cards, Buttons, Inputs)
│   │   ├── UIComponents.tsx  # Biblioteca de Componentes Base (Atomic Design)
│   │   ├── Layout.tsx        # HUD Global e Navegação
│   │   └── ...
│   ├── pages/           # Módulos de Página (Agrupados por Contexto)
│   │   ├── Admin.tsx    # Painel Administrativo Completo
│   │   ├── Vendor.tsx   # Painel do Vendedor (Loja)
│   │   ├── Client.tsx   # App do Cliente (Marketplace)
│   │   ├── Delivery.tsx # App do Entregador (Logística)
│   │   └── ...
│   ├── services/        # Lógica de Negócios e Integrações
│   │   ├── carboSystem.ts # ENGINE DO SISTEMA (Não remover!)
│   │   └── geminiService.ts # Integração AI
│   └── types.ts         # Definições de Tipagem (Source of Truth)
└── ...
```

---

## 🤖 Guia para IA e Copilot

Se você é uma IA (GitHub Copilot, GPT, Claude) mantendo este código, siga estas **Diretrizes Supremas**:

1.  **Preservação Visual:** O CSS e as classes Tailwind atuais foram calibrados milimetricamente. **NÃO ALTERE** espaçamentos, cores ou sombras a menos que explicitamente solicitado.
2.  **Lógica Centralizada:** Nunca crie lógica de estado local complexa dentro de componentes de página (`pages/*.tsx`). Toda regra de negócio (criar pedido, mudar status, calcular taxa) DEVE passar pelo `carboSystem.ts`.
3.  **Imutabilidade de Fluxo:** Os fluxos de pedido (Kanban) e validação de tokens são críticos. Não simplifique ou remova etapas de segurança.
4.  **Nomenclatura:** Mantenha os nomes em Inglês para código (variáveis, funções) e Português para UI (textos, labels), salvo exceções legadas.

---

## 🚀 Como Rodar

1.  **Instalar Dependências:**
    ```bash
    npm install
    ```

2.  **Configurar Ambiente:**
    Crie um arquivo `.env` na raiz com sua chave da Gemini API (opcional para features de AI):
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    ```

3.  **Executar:**
    ```bash
    npm run dev
    ```

---

**© 2025 CarboApp Project.** Sistema proprietário de gestão logística.
