# 💰 Controle de Gastos (Full Stack)

Sistema de gerenciamento financeiro familiar desenvolvido como Teste Técnico.
O projeto permite o cadastro de pessoas, categorias e lançamento de receitas/despesas, oferecendo um dashboard com cálculos automáticos de saldo.

## 🛠️ Tecnologias Utilizadas

**Backend:**
* C# (.NET 10.0)
* ASP.NET Core Web API
* Entity Framework Core (InMemory Database)
* Swagger (Documentação da API)

**Frontend:**
* React (Vite)
* TypeScript
* Axios (Integração API)
* CSS Modules

## ✨ Funcionalidades

* ✅ **Dashboard Financeiro:** Visualização em tempo real de Entradas, Saídas e Saldo Geral.
* ✅ **Cadastro de Pessoas:** Gerenciamento de membros da família com visualização de saldo individual.
* ✅ **Lançamentos:** Cruzamento de dados (Quem gastou + Onde gastou + Valor).
* ✅ **Regras de Negócio:**
    * Menores de 18 anos não podem lançar Receitas.
    * Exclusão em Cascata (Ao apagar uma pessoa, suas transações são removidas via Backend).

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* .NET SDK 10.0
* Node.js (v24 ou superior)

### 1️⃣ Rodando o Backend (API)
Abra o terminal na pasta raiz e digite:

    cd ControleGastos
    dotnet run

# A API rodará em: https://localhost:7032 (ou porta similar)

### 2️⃣ Rodando o Frontend (Web)
Abra um novo terminal na pasta raiz e digite:

    cd ControleGastos/web
    npm install
    npm run dev

# O site abrirá em: http://localhost:5173

---
Desenvolvido por **Leonardo Reali**