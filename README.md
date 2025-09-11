# 💰 Sistema de Controle Financeiro Pessoal

Um sistema web completo e moderno para gerenciamento de finanças pessoais, com arquitetura limpa separando HTML, CSS e JavaScript.

## ✨ Funcionalidades

- 📊 **Dashboard Interativo** - Visualização clara de receitas, despesas e saldo
- 💸 **Gerenciamento de Transações** - Adicionar, editar e excluir transações
- 📅 **Organização por Mês** - Controle mensal independente
- 📈 **Relatórios Detalhados** - Gráficos e análises por categoria
- 🧮 **Calculadora Integrada** - Para cálculos rápidos
- 🌙 **Tema Claro/Escuro** - Interface adaptável
- 📱 **Design Responsivo** - Funciona em todos os dispositivos
- 💾 **Armazenamento Local** - Dados salvos no navegador
- 📤 **Importar/Exportar** - Backup e restauração de dados

## 🚀 Demonstração

![Sistema em funcionamento](https://via.placeholder.com/800x400?text=Demo+do+Sistema)

## 📁 Estrutura do Projeto

```
controle-financeiro/
│
├── index.html              # Arquivo HTML principal
├── css/
│   └── styles.css         # Estilos personalizados
├── js/
│   └── script.js          # Lógica da aplicação
├── GUIA_FRAMEWORKS.md     # Guia de integração de frameworks
└── README.md              # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

### Frameworks e Bibliotecas
- **Bootstrap 5.3.0** - Framework CSS responsivo
- **Font Awesome 6.4.0** - Biblioteca de ícones
- **Chart.js** - Gráficos interativos
- **CSS Custom Properties** - Variáveis CSS para temas

### Técnicas Implementadas
- **Vanilla JavaScript** - JavaScript puro sem dependências pesadas
- **LocalStorage API** - Persistência de dados no navegador
- **CSS Grid & Flexbox** - Layout responsivo moderno
- **Progressive Web App (PWA) Ready** - Preparado para conversão em PWA

## 🚦 Como Usar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para carregar frameworks via CDN)

### Instalação
1. **Clone ou baixe os arquivos** para uma pasta local
2. **Abra o arquivo `index.html`** em seu navegador
3. **Comece a usar** - não requer servidor web

### Uso Básico
1. **Selecione o mês** desejado
2. **Adicione transações** clicando em "Nova"
3. **Visualize o dashboard** com resumo financeiro
4. **Gere relatórios** para análises detalhadas
5. **Use a calculadora** para cálculos rápidos

## 📊 Funcionalidades Detalhadas

### Dashboard
- **Cards de resumo** com receitas, despesas e saldo
- **Atualização automática** ao modificar dados
- **Indicador visual** para saldo negativo
- **Navegação por meses** intuitiva

### Gerenciamento de Transações
- **Formulário completo** com validação
- **Categorias predefinidas** organizadas
- **Edição inline** de transações existentes
- **Exclusão com confirmação** de segurança

### Relatórios
- **Gráficos de barras** por categoria
- **Tabelas detalhadas** de todas as transações
- **Resumos mensais** com totais
- **Exportação** para texto ou JSON

### Calculadora
- **Interface touch-friendly** para mobile
- **Operações básicas** (+, -, ×, ÷, %)
- **Histórico de operações** visível
- **Transferência direta** para formulário de transações

## 🎨 Personalização

### Temas
O sistema inclui suporte completo a temas claro/escuro:

```css
:root {
    --primary: #2c3e50;
    --success: #2ecc71;
    --danger: #e74c3c;
    /* ... mais variáveis */
}

.dark-mode {
    --background: #1a1a1a;
    --card-bg: #2d2d2d;
    --text: #f0f0f0;
    /* ... variáveis do tema escuro */
}
```

### Adicionando Categorias
Edite o arquivo `js/script.js` na seção `categoryNames`:

```javascript
const categoryNames = {
    salary: 'Salário',
    freelance: 'Freelance',
    // Adicione novas categorias aqui
    crypto: 'Criptomoedas',
    gifts: 'Presentes'
};
```

### Modificando Estilos
Todos os estilos estão organizados por seções no `css/styles.css`:

- **Variáveis CSS** - Cores e tamanhos
- **Reset e Globais** - Configurações base
- **Componentes** - Cards, botões, formulários
- **Layout** - Grid, navegação, responsividade

## 🔧 Integração de Frameworks

### Adicionando jQuery para Animações
```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```

```javascript
function showSection(sectionId) {
    $('.section.active').fadeOut(200, function() {
        $(this).removeClass('active');
        $(`#${sectionId}`).fadeIn(200).addClass('active');
    });
}
```

### SweetAlert2 para Alertas Bonitos
```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
```

### Moment.js para Datas
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
```

👉 **Consulte o [GUIA_FRAMEWORKS.md](GUIA_FRAMEWORKS.md)** para instruções detalhadas

## 📱 Responsividade

O sistema foi projetado com **mobile-first** em mente:

- **Breakpoints Bootstrap** - xs, sm, md, lg, xl
- **Touch-friendly** - Botões e áreas de toque adequadas
- **Navegação bottom** - Barra inferior para mobile
- **Swipe gestures** - Preparado para gestos (com bibliotecas)

### Testes de Compatibilidade
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+

## 💾 Armazenamento de Dados

### LocalStorage
```javascript
// Estrutura dos dados
{
  "0": [    // Janeiro
    {
      "id": 1634567890123.456,
      "description": "Salário",
      "amount": 5000.00,
      "type": "income",
      "category": "salary",
      "date": "2024-01-15"
    }
  ],
  "1": [],  // Fevereiro
  // ... outros meses
}
```

### Backup e Restauração
- **Exportação JSON** - Backup completo dos dados
- **Exportação Texto** - Relatório formatado
- **Importação** - Restauração de backups JSON
- **Limpeza** - Reset completo com confirmação

## 🔒 Segurança e Privacidade

- **Dados locais** - Nenhuma informação enviada para servidores
- **Sem cookies** - Usa apenas localStorage
- **Sem tracking** - Não coleta dados do usuário
- **Código aberto** - Transparência total

## 🐛 Resolução de Problemas

### Dados não salvam
1. Verifique se o JavaScript está habilitado
2. Confirme se há espaço no localStorage (limite ~5-10MB)
3. Teste em modo privado/incógnito

### Layout quebrado
1. Verifique a conexão com internet (CDNs)
2. Limpe o cache do navegador
3. Teste em navegador atualizado

### Gráficos não aparecem
1. Confirme carregamento do Chart.js
2. Adicione dados em categorias de despesas
3. Verifique console para erros

## 🚀 Próximas Funcionalidades

- [ ] **PWA completo** - Instalação como app
- [ ] **Sincronização na nuvem** - Google Drive, Dropbox
- [ ] **Metas financeiras** - Objetivos e acompanhamento
- [ ] **Múltiplas moedas** - Suporte internacional
- [ ] **Importação CSV** - Dados de bancos
- [ ] **Notificações** - Lembretes e alertas
- [ ] **Análise preditiva** - Tendências e projeções

## 🤝 Contribuição

### Como Contribuir
1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Faça commit** (`git commit -am 'Adiciona nova funcionalidade'`)
4. **Push para branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### Padrões de Código
- **Indentação**: 4 espaços
- **Nomes**: camelCase para JavaScript, kebab-case para CSS
- **Comentários**: JSDoc para funções importantes
- **Commits**: Mensagens claras e descritivas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 👨‍💻 Autor

Criado com ❤️ para ajudar no controle financeiro pessoal.

## 📞 Suporte

- **Issues**: Use o sistema de issues do GitHub
- **Discussões**: Para perguntas e sugestões
- **Wiki**: Documentação adicional

---

⭐ **Gostou do projeto? Deixe uma estrela!** ⭐
