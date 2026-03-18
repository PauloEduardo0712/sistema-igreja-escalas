# ⛪ Sistema de Escalas — Igreja Shekinah IAD

Sistema web para gerenciamento de escalas ministeriais da Igreja Shekinah IAD.
Desenvolvido com **HTML, CSS e JavaScript puro**.

---

## 📁 Estrutura de Pastas

```
sistema-escalas-shekinah/
│
├── index.html              ← Ponto de entrada (login + app)
│
├── css/
│   ├── global.css          ← Variáveis, botões, tabelas, modais, animações
│   ├── login.css           ← Estilo exclusivo da tela de login
│   ├── admin.css           ← Header, sidebar e layout do painel admin
│   ├── voluntario.css      ← Cards e estilos do painel do voluntário
│   └── responsivo.css      ← Media queries para mobile/tablet
│
├── js/
│   ├── dados.js            ← Estado global e dados iniciais
│   ├── utils.js            ← Funções auxiliares (formatação, toast, modal)
│   ├── validacoes.js       ← Validação de campos e formulários
│   ├── conflitos.js        ← Lógica de detecção de conflitos
│   ├── login.js            ← Autenticação e redirecionamento
│   ├── admin.js            ← Dashboard admin, voluntários, disponibilidades
│   ├── escalas.js          ← CRUD de escalas e tela de conflitos
│   └── voluntario.js       ← Painel, escalas e disponibilidade do voluntário
│
└── img/
    └── logo-shekinah.svg   ← Logo vetorial da Igreja Shekinah IAD
```

---

## 🚀 Como usar

1. Abra o arquivo `index.html` em qualquer navegador moderno.
2. Faça login com as credenciais abaixo.

---

## 🔐 Credenciais de Acesso

| Perfil         | Usuário | Senha |
|----------------|---------|-------|
| Administrador  | admin   | 1234  |
| Voluntário     | joao    | 1234  |
| Voluntário     | maria   | 1234  |
| Voluntário     | carlos  | 1234  |
| Voluntário     | ana     | 1234  |
| Voluntário     | pedro   | 1234  |

---

## ✅ Funcionalidades

### Administrador
- Dashboard com cards de resumo
- Cadastrar, editar e excluir voluntários
- Criar, editar e excluir escalas
- Filtros por ministério, data e nome
- Visualização de disponibilidades
- Detecção automática de conflitos

### Voluntário
- Dashboard pessoal com suas escalas
- Visualizar escalas cadastradas
- Informar dias disponíveis e indisponíveis
- Histórico de participação

### Ministérios Suportados
- Diáconos
- EBD (Escola Bíblica Dominical)
- Intercessão
- Recepção
- Louvor
- Mídia / Data Show
- Coordenação de Lanche

---

## 🎨 Identidade Visual

Cores principais:
- **Azul escuro:** `#0a1628`
- **Azul principal:** `#1a3a6e`
- **Azul brilho:** `#2d6fe0`
- **Chama (laranja):** `#ff8c00`

---

## 📋 Requisitos

Nenhuma instalação necessária. Basta abrir o `index.html` em um navegador.

> **Nota:** Os dados são armazenados em memória (JavaScript). Ao recarregar a página, os dados voltam ao estado inicial. Para persistência, adicione localStorage no arquivo `js/dados.js`.
