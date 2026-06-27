# Hive Engine API Developer Portal

Um portal interativo e completo para documentação das APIs do Hive Engine, construído com HTML, CSS e JavaScript puro para hospedagem no GitHub Pages.

## 🚀 Características

- **Documentação Completa**: Cobertura abrangente de três APIs principais (SMT API, JSON-RPC API, History API)
- **Interface Responsiva**: Design moderno que funciona em desktop, tablet e mobile
- **Modo Escuro**: Toggle de tema com persistência de preferência
- **Busca em Tempo Real**: Filtre endpoints rapidamente enquanto digita
- **Exemplos de Código**: Snippets prontos para copiar com syntax highlighting
- **Navegação Suave**: Links internos com scroll suave
- **Sem Dependências Externas**: Apenas HTML, CSS e JavaScript puro

## 📁 Estrutura do Projeto

```
hive_engine_api_portal/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos globais
├── js/
│   └── script.js          # Funcionalidades interativas
├── assets/
│   └── placeholder.svg    # Logo do Hive Engine
└── README.md              # Este arquivo
```

## 🌐 Hospedagem no GitHub Pages

### Passo 1: Criar um Repositório GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em "New" para criar um novo repositório
3. Nomeie como `hive-engine-api-portal`
4. Deixe como público
5. Clique em "Create repository"

### Passo 2: Fazer Upload dos Arquivos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/hive-engine-api-portal.git
cd hive-engine-api-portal

# Copie todos os arquivos do projeto para esta pasta
# (index.html, css/, js/, assets/, README.md)

# Adicione os arquivos ao Git
git add .

# Faça commit
git commit -m "Initial commit: Hive Engine API Portal"

# Envie para o GitHub
git push -u origin main
```

### Passo 3: Ativar GitHub Pages

1. Acesse o repositório no GitHub
2. Vá para **Settings** > **Pages**
3. Em "Source", selecione **main** branch
4. Clique em "Save"
5. Aguarde alguns minutos e acesse `https://seu-usuario.github.io/hive-engine-api-portal`

## 🎨 Personalização

### Cores

Edite as variáveis CSS em `css/styles.css`:

```css
:root {
    --primary: #1e3a8a;           /* Deep Indigo */
    --secondary: #f97316;         /* Warm Orange */
    --background: #fafaf9;        /* Off-White */
    /* ... outras cores ... */
}
```

### Fontes

As fontes IBM Plex são carregadas do Google Fonts. Para usar outras fontes, edite `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Sua+Fonte&display=swap" rel="stylesheet">
```

### Conteúdo

Edite `index.html` para adicionar ou modificar:
- Endpoints da API
- Descrições
- Exemplos de código
- Seções

## 🔍 Funcionalidades JavaScript

### Busca de Endpoints

Filtre endpoints em tempo real digitando na barra de busca. A busca é case-insensitive e funciona em toda a documentação.

### Modo Escuro

Clique no ícone de lua/sol no header para alternar entre modo claro e escuro. A preferência é salva no localStorage.

### Copiar Código

Clique no botão "Copiar" em qualquer bloco de código para copiar para a área de transferência.

### Atalhos de Teclado

- **Ctrl/Cmd + K**: Foca na barra de busca
- **Escape**: Limpa a busca

## 📱 Responsividade

O portal é totalmente responsivo:
- **Desktop**: Layout com sidebar lateral
- **Tablet**: Sidebar colapsada, grid adaptativo
- **Mobile**: Layout em coluna única, menu otimizado

## 🔧 Desenvolvimento Local

Para testar localmente:

```bash
# Abra o arquivo index.html em um navegador
# Ou use um servidor local:

# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Acesse http://localhost:8000
```

## 📚 APIs Documentadas

### SMT API
- Endpoints de Estado e Configuração
- Endpoints de Feed e Discussões
- Endpoints de Conta e Conteúdo

### JSON-RPC API
- Blockchain
- Contratos

### History API
- Account History

## 🎯 Próximas Melhorias

- [ ] Adicionar mais endpoints
- [ ] Integrar testador de API interativo
- [ ] Adicionar autenticação de exemplos
- [ ] Criar guias de integração
- [ ] Adicionar tutoriais em vídeo

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar conforme necessário.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir melhorias
- Adicionar novos endpoints
- Melhorar a documentação

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório GitHub.

---

**Desenvolvido com ❤️ para a comunidade Hive Engine**
