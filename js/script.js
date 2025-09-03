// Sistema de Persistência de Dados usando localStorage
class FinancialData {
    constructor() {
        this.storageKey = 'financialData';
        this.data = this.loadData();
    }

    loadData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Garantir que todos os meses existam
                for (let month = 0; month < 12; month++) {
                    if (!parsed[month]) {
                        parsed[month] = [];
                    }
                }
                return parsed;
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
        
        // Dados padrão - array vazio para cada mês
        const defaultData = {};
        for (let month = 0; month < 12; month++) {
            defaultData[month] = [];
        }
        return defaultData;
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            localStorage.setItem(this.storageKey + '_lastUpdate', new Date().toISOString());
            this.updateDataInfo();
            
            // Verificar se os dados foram salvos corretamente
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) {
                throw new Error('Falha ao salvar no localStorage');
            }
            
            console.log('Dados salvos com sucesso no navegador');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar dados. Verifique se há espaço suficiente no navegador ou se o armazenamento local está habilitado.');
        }
    }

    addTransaction(month, transaction) {
        transaction.id = Date.now() + Math.random(); // ID único
        this.data[month].push(transaction);
        this.saveData();
    }

    updateTransaction(month, transactionId, updatedTransaction) {
        const index = this.data[month].findIndex(t => t.id === transactionId);
        if (index !== -1) {
            this.data[month][index] = { ...updatedTransaction, id: transactionId };
            this.saveData();
        }
    }

    deleteTransaction(month, transactionId) {
        this.data[month] = this.data[month].filter(t => t.id !== transactionId);
        this.saveData();
    }

    getTransactions(month) {
        return this.data[month] || [];
    }

    getAllTransactions() {
        let all = [];
        for (let month = 0; month < 12; month++) {
            all = all.concat(this.data[month]);
        }
        return all;
    }

    clearAllData() {
        for (let month = 0; month < 12; month++) {
            this.data[month] = [];
        }
        this.saveData();
    }

    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    exportDataAsText() {
        const monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        
        const categoryNames = {
            salary: 'Salário',
            freelance: 'Freelance',
            investment: 'Investimentos',
            bonus: 'Bonificação',
            housing: 'Moradia',
            food: 'Alimentação',
            transport: 'Transporte',
            health: 'Saúde',
            education: 'Educação',
            leisure: 'Lazer',
            bills: 'Contas',
            shopping: 'Compras',
            other: 'Outros'
        };

        let textData = "=== CONTROLE FINANCEIRO PESSOAL ===\n";
        textData += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n\n`;

        let totalIncome = 0;
        let totalExpenses = 0;
        let totalTransactions = 0;

        for (let month = 0; month < 12; month++) {
            const transactions = this.data[month] || [];
            if (transactions.length === 0) continue;

            textData += `\n--- ${monthNames[month].toUpperCase()} ---\n`;
            
            let monthIncome = 0;
            let monthExpenses = 0;

            // Ordenar transações por data
            transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            transactions.forEach(transaction => {
                const date = new Date(transaction.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                const category = categoryNames[transaction.category] || transaction.category;
                const amount = transaction.amount.toFixed(2).replace('.', ',');
                const type = transaction.type === 'income' ? 'RECEITA' : 'DESPESA';
                
                textData += `${formattedDate} | ${type} | ${category} | R$ ${amount} | ${transaction.description}\n`;
                
                if (transaction.type === 'income') {
                    monthIncome += transaction.amount;
                    totalIncome += transaction.amount;
                } else {
                    monthExpenses += transaction.amount;
                    totalExpenses += transaction.amount;
                }
                totalTransactions++;
            });

            const monthBalance = monthIncome - monthExpenses;
            textData += `\nResumo do mês:\n`;
            textData += `  Receitas: R$ ${monthIncome.toFixed(2).replace('.', ',')}\n`;
            textData += `  Despesas: R$ ${monthExpenses.toFixed(2).replace('.', ',')}\n`;
            textData += `  Saldo: R$ ${monthBalance.toFixed(2).replace('.', ',')} ${monthBalance >= 0 ? '✓' : '⚠'}\n`;
            textData += `  Total de transações: ${transactions.length}\n`;
            textData += "-".repeat(50) + "\n";
        }

        const totalBalance = totalIncome - totalExpenses;
        textData += `\n=== RESUMO GERAL ===\n`;
        textData += `Total de Receitas: R$ ${totalIncome.toFixed(2).replace('.', ',')}\n`;
        textData += `Total de Despesas: R$ ${totalExpenses.toFixed(2).replace('.', ',')}\n`;
        textData += `Saldo Total: R$ ${totalBalance.toFixed(2).replace('.', ',')} ${totalBalance >= 0 ? '✓' : '⚠'}\n`;
        textData += `Total de Transações: ${totalTransactions}\n`;

        return textData;
    }

    importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            // Validar estrutura básica
            if (typeof imported === 'object') {
                this.data = imported;
                // Garantir que todos os meses existam
                for (let month = 0; month < 12; month++) {
                    if (!this.data[month]) {
                        this.data[month] = [];
                    }
                }
                this.saveData();
                return true;
            }
        } catch (error) {
            console.error('Erro ao importar dados:', error);
        }
        return false;
    }

    updateDataInfo() {
        const totalTransactions = this.getAllTransactions().length;
        const lastUpdate = localStorage.getItem(this.storageKey + '_lastUpdate');
        
        if (document.getElementById('total-transactions')) {
            document.getElementById('total-transactions').textContent = totalTransactions;
        }
        
        if (document.getElementById('last-update')) {
            if (lastUpdate) {
                const date = new Date(lastUpdate);
                document.getElementById('last-update').textContent = date.toLocaleString('pt-BR');
            } else {
                document.getElementById('last-update').textContent = 'Nunca';
            }
        }
        
        // Verificar status dos dados
        if (document.getElementById('data-status')) {
            try {
                const saved = localStorage.getItem(this.storageKey);
                if (saved && JSON.parse(saved)) {
                    document.getElementById('data-status').textContent = 'Sim ✓';
                    document.getElementById('data-status').style.color = 'var(--success)';
                } else {
                    document.getElementById('data-status').textContent = 'Não ✗';
                    document.getElementById('data-status').style.color = 'var(--danger)';
                }
            } catch (error) {
                document.getElementById('data-status').textContent = 'Erro ⚠';
                document.getElementById('data-status').style.color = 'var(--warning)';
            }
        }
        
        // Calcular tamanho dos dados
        if (document.getElementById('data-size')) {
            try {
                const dataString = localStorage.getItem(this.storageKey);
                if (dataString) {
                    const sizeInBytes = new Blob([dataString]).size;
                    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
                    document.getElementById('data-size').textContent = `${sizeInKB} KB`;
                } else {
                    document.getElementById('data-size').textContent = '0 KB';
                }
            } catch (error) {
                document.getElementById('data-size').textContent = 'Erro';
            }
        }
    }
}

// Instância global dos dados
const financialData = new FinancialData();

// Variáveis globais
let currentMonth = new Date().getMonth();
let editingTransactionId = null;

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const categoryNames = {
    salary: 'Salário',
    freelance: 'Freelance',
    investment: 'Investimentos',
    bonus: 'Bonificação',
    housing: 'Moradia',
    food: 'Alimentação',
    transport: 'Transporte',
    health: 'Saúde',
    education: 'Educação',
    leisure: 'Lazer',
    bills: 'Contas',
    shopping: 'Compras',
    other: 'Outros'
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar data atual
    const today = new Date();
    document.getElementById('date').valueAsDate = today;
    
    // Event listeners
    setupEventListeners();
    
    // Atualizar interface
    updateMonthDisplay();
    financialData.updateDataInfo();
    
    // Mostrar seção dashboard inicialmente
    showSection('dashboard');
});

// Configuração dos event listeners
function setupEventListeners() {
    // Event listeners para os botões de mês
    document.querySelectorAll('.month-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentMonth = parseInt(this.dataset.month);
            updateMonthDisplay();
        });
    });
    
    // Event listener para o formulário
    document.getElementById('transaction-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        
        if (!description || !amount || !type || !category || !date) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        const transaction = {
            description,
            amount,
            type,
            category,
            date
        };

        if (editingTransactionId) {
            // Editando transação existente
            financialData.updateTransaction(currentMonth, editingTransactionId, transaction);
            cancelEdit();
            alert('Transação atualizada com sucesso!');
        } else {
            // Adicionando nova transação
            financialData.addTransaction(currentMonth, transaction);
            alert('Transação adicionada com sucesso!');
        }
        
        // Limpar formulário
        this.reset();
        document.getElementById('date').valueAsDate = new Date();
        
        // Atualizar interface
        updateMonthDisplay();
        loadTransactions();
    });
}

// Atualização da exibição do mês
function updateMonthDisplay() {
    document.getElementById('current-month').textContent = monthNames[currentMonth];
    document.getElementById('current-month2').textContent = monthNames[currentMonth];
    
    // Ativar botão do mês atual
    document.querySelectorAll('.month-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.month-btn[data-month="${currentMonth}"]`).classList.add('active');
    
    // Carregar dados do mês selecionado
    loadMonthData(currentMonth);
    loadTransactions();
}

// Carregamento dos dados do mês
function loadMonthData(month) {
    const transactions = financialData.getTransactions(month);
    
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });
    
    const balance = income - expenses;
    
    // Atualizar os totais
    document.getElementById('income-total').textContent = income.toFixed(2).replace('.', ',');
    document.getElementById('expenses-total').textContent = expenses.toFixed(2).replace('.', ',');
    document.getElementById('balance-total').textContent = balance.toFixed(2).replace('.', ',');
    
    // Alterar cor do saldo se for negativo
    const balanceCard = document.querySelector('.card.balance');
    if (balance < 0) {
        balanceCard.classList.add('negative');
    } else {
        balanceCard.classList.remove('negative');
    }
}

// Carregamento das transações
function loadTransactions() {
    const transactions = financialData.getTransactions(currentMonth);
    const tbody = document.getElementById('transactions-body');
    const table = document.getElementById('transactions-table');
    const noTransactions = document.getElementById('no-transactions');
    
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        table.style.display = 'none';
        noTransactions.style.display = 'block';
        return;
    }
    
    table.style.display = 'table';
    noTransactions.style.display = 'none';
    
    // Ordenar transações por data (mais recente primeiro)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dateObj = new Date(transaction.date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        
        row.classList.add(transaction.type === 'income' ? 'income-row' : 'expense-row');
        
        const formattedAmount = transaction.amount.toFixed(2).replace('.', ',');
        const categoryDisplay = categoryNames[transaction.category] || transaction.category;
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.description}</td>
            <td>${categoryDisplay}</td>
            <td style="color: ${transaction.type === 'income' ? 'var(--success)' : 'var(--danger)'};">R$ ${formattedAmount}</td>
            <td class="actions">
                <button class="btn btn-primary btn-sm" onclick="editTransaction(${transaction.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${transaction.id})">Excluir</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Edição de transação
function editTransaction(id) {
    const transactions = financialData.getTransactions(currentMonth);
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
        alert('Transação não encontrada.');
        return;
    }
    
    // Preencher formulário com dados da transação
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('category').value = transaction.category;
    document.getElementById('date').value = transaction.date;
    
    // Configurar modo de edição
    editingTransactionId = id;
    document.getElementById('submit-btn').textContent = 'Atualizar Transação';
    document.getElementById('cancel-edit').style.display = 'inline-block';
    
    // Ir para a seção de adicionar transação
    showSection('add-transaction');
}

// Cancelar edição
function cancelEdit() {
    editingTransactionId = null;
    document.getElementById('submit-btn').textContent = 'Adicionar Transação';
    document.getElementById('cancel-edit').style.display = 'none';
    document.getElementById('transaction-form').reset();
    document.getElementById('date').valueAsDate = new Date();
}

// Exclusão de transação
function deleteTransaction(id) {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
        return;
    }
    
    financialData.deleteTransaction(currentMonth, id);
    updateMonthDisplay();
    loadTransactions();
    alert('Transação excluída com sucesso!');
}

// Navegação entre seções
function showSection(sectionId) {
    // Esconder todas as seções
    const sections = ['dashboard', 'transactions', 'add-transaction', 'reports', 'settings'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Atualizar navegação ativa
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Carregar dados específicos da seção
    if (sectionId === 'transactions') {
        loadTransactions();
    } else if (sectionId === 'settings') {
        financialData.updateDataInfo();
    }
}

// Geração de relatórios
function generateReport() {
    const reportMonth = document.getElementById('report-month').value;
    if (!reportMonth) {
        alert('Por favor, selecione um mês para o relatório.');
        return;
    }
    
    const [year, month] = reportMonth.split('-');
    const monthIndex = parseInt(month) - 1;
    const transactions = financialData.getTransactions(monthIndex);
    
    let income = 0;
    let expenses = 0;
    const incomeByCategory = {};
    const expensesByCategory = {};
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += transaction.amount;
            incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
        } else {
            expenses += transaction.amount;
            expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        }
    });
    
    const balance = income - expenses;
    
    let reportHTML = `
        <div class="data-info">
            <h4>📊 Relatório de ${monthNames[monthIndex]} ${year}</h4>
            <p><strong>Total de Receitas:</strong> R$ ${income.toFixed(2).replace('.', ',')}</p>
            <p><strong>Total de Despesas:</strong> R$ ${expenses.toFixed(2).replace('.', ',')}</p>
            <p><strong>Saldo:</strong> <span style="color: ${balance >= 0 ? 'var(--success)' : 'var(--danger)'}">R$ ${balance.toFixed(2).replace('.', ',')}</span></p>
            <p><strong>Total de Transações:</strong> ${transactions.length}</p>
        </div>
    `;
    
    if (Object.keys(incomeByCategory).length > 0) {
        reportHTML += '<h4>Receitas por Categoria:</h4><ul>';
        Object.entries(incomeByCategory).forEach(([category, amount]) => {
            reportHTML += `<li>${categoryNames[category] || category}: R$ ${amount.toFixed(2).replace('.', ',')}</li>`;
        });
        reportHTML += '</ul>';
    }
    
    if (Object.keys(expensesByCategory).length > 0) {
        reportHTML += '<h4>Despesas por Categoria:</h4><ul>';
        Object.entries(expensesByCategory).forEach(([category, amount]) => {
            reportHTML += `<li>${categoryNames[category] || category}: R$ ${amount.toFixed(2).replace('.', ',')}</li>`;
        });
        reportHTML += '</ul>';
    }
    
    document.getElementById('report-content').innerHTML = reportHTML;
}

// Exportação de dados
function exportData() {
    // Exportar como texto legível
    const textData = financialData.exportDataAsText();
    const blob = new Blob([textData], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `controle_financeiro_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Dados exportados como arquivo de texto com sucesso!');
}

// Exportação de dados como JSON (para backup)
function exportDataJSON() {
    const data = financialData.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `controle_financeiro_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Backup dos dados exportado com sucesso!');
}

// Importação de dados
function importData() {
    document.getElementById('import-input').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const success = financialData.importData(e.target.result);
            if (success) {
                alert('Dados importados com sucesso!');
                updateMonthDisplay();
                loadTransactions();
                financialData.updateDataInfo();
            } else {
                alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
            }
        } catch (error) {
            alert('Erro ao ler o arquivo.');
        }
    };
    reader.readAsText(file);
}

// Limpeza de dados
function clearAllData() {
    if (!confirm('ATENÇÃO: Esta ação irá apagar TODOS os seus dados financeiros permanentemente. Esta ação não pode ser desfeita.\n\nTem certeza que deseja continuar?')) {
        return;
    }
    
    if (!confirm('Última confirmação: Todos os dados serão perdidos. Continuar?')) {
        return;
    }
    
    financialData.clearAllData();
    updateMonthDisplay();
    loadTransactions();
    financialData.updateDataInfo();
    alert('Todos os dados foram removidos.');
}

// Testar persistência dos dados
function testDataPersistence() {
    try {
        // Testar se localStorage está disponível
        const testKey = 'test_persistence';
        const testValue = 'test_data_' + Date.now();
        
        localStorage.setItem(testKey, testValue);
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        if (retrieved === testValue) {
            alert('✅ TESTE DE PERSISTÊNCIA PASSOU!\n\n' +
                  'Seus dados estão sendo salvos corretamente no navegador.\n' +
                  'Eles permanecerão disponíveis mesmo após:\n' +
                  '• Atualizar a página (F5)\n' +
                  '• Fechar e reabrir o navegador\n' +
                  '• Reiniciar o computador\n\n' +
                  'Os dados ficam salvos até você:\n' +
                  '• Limpar o cache do navegador\n' +
                  '• Usar modo privado/anônimo\n' +
                  '• Excluir manualmente');
        } else {
            throw new Error('Dados não foram recuperados corretamente');
        }
    } catch (error) {
        alert('❌ TESTE DE PERSISTÊNCIA FALHOU!\n\n' +
              'Problemas detectados:\n' +
              '• localStorage pode estar desabilitado\n' +
              '• Modo privado/anônimo ativo\n' +
              '• Espaço de armazenamento insuficiente\n' +
              '• Configurações do navegador restritivas\n\n' +
              'Seus dados podem não ser salvos permanentemente.\n' +
              'Erro: ' + error.message);
    }
}