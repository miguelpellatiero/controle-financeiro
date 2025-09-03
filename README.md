# 💰 Controle Financeiro Mensal

Sistema completo de controle financeiro pessoal com persistência de dados e funcionalidades avançadas.

## 🚀 Funcionalidades

### ✅ **Persistência Garantida**
- Todos os dados são salvos automaticamente no navegador
- Informações permanecem após atualizar a página
- Dados mantidos entre sessões do navegador
- Funciona offline após o primeiro carregamento

### 📊 **Gestão de Transações**
- Adicionar receitas e despesas
- Editar transações existentes
- Excluir transações com confirmação
- Organização por mês e categoria
- Cálculo automático de saldos

### 📈 **Relatórios e Análises**
- Dashboard com resumo mensal
- Relatórios detalhados por período
- Totais por categoria
- Indicadores visuais de saldo

### 💾 **Backup e Exportação**
- **Exportar como Texto**: Arquivo legível (.txt) para visualização e impressão
- **Exportar Backup**: Arquivo JSON para restaurar dados
- **Importar Dados**: Restaurar backup completo
- **Teste de Persistência**: Verificar se os dados estão sendo salvos

## 📁 Estrutura do Projeto

```
controle_financeiro_mensal/
├── index.html          # Interface principal
├── css/
│   └── styles.css      # Estilos CSS organizados
├── js/
│   └── script.js       # Lógica JavaScript modular
└── README.md          # Documentação
```

## 🔧 Como Usar

1. **Abrir o Sistema**: Abra `index.html` no navegador
2. **Adicionar Transações**: Use a aba "Nova Transação"
3. **Visualizar Dados**: Dashboard mostra resumo do mês atual
4. **Exportar Dados**: Vá em "Configurações" > "Exportar"
5. **Fazer Backup**: Use "Exportar Backup (JSON)" regularmente

## 🛡️ Segurança dos Dados

### ✅ **Dados Seguros**
- Armazenados localmente no seu navegador
- Não enviados para servidores externos
- Acesso apenas no seu dispositivo
- Backup manual controlado por você

### ⚠️ **Atenção**
- Dados podem ser perdidos se:
  - Limpar cache/cookies do navegador
  - Usar modo privado/incógnito
  - Desinstalar o navegador sem backup
  - Formatar o computador sem backup

### 💡 **Recomendações**
- Faça backup regularmente (Exportar Backup)
- Teste a persistência na primeira vez
- Mantenha uma cópia dos dados importantes

## 📱 Compatibilidade

- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile**: Navegadores móveis modernos
- ✅ **Tablets**: Interface responsiva
- ✅ **Offline**: Funciona sem internet após carregar

## 🎯 Próximas Funcionalidades

- [ ] Gráficos interativos
- [ ] Metas mensais
- [ ] Categorias personalizadas
- [ ] Notificações de gastos
- [ ] Tema escuro/claro

## 🐛 Problemas?

Se encontrar problemas:

1. **Teste a Persistência**: Use o botão "Testar Persistência" nas Configurações
2. **Verifique o Console**: F12 > Console para ver erros
3. **Faça Backup**: Exporte seus dados antes de tentar correções
4. **Limpe o Cache**: Se necessário, limpe o cache e importe o backup

---

**Desenvolvido com ❤️ para controle financeiro pessoal**