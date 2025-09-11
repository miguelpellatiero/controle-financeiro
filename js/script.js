/**
 * ==========================================
 * SISTEMA DE CONTROLE FINANCEIRO PESSOAL
 * Arquivo JavaScript Principal
 * ==========================================
 */

// ==========================================
// CLASSE DE PERSISTÊNCIA DE DADOS
// ==========================================
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
            textData += ` Receitas: R$ ${monthIncome.toFixed(2).replace('.', ',')}\n`;
            textData += ` Despesas: R$ ${monthExpenses.toFixed(2).replace('.', ',')}\n`;
            textData += ` Saldo: R$ ${monthBalance.toFixed(2).replace('.', ',')} ${monthBalance >= 0 ? '✓' : '⚠'}\n`;
            textData += ` Total de transações: ${transactions.length}\n`;
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
    }
}

// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================
const financialData = new FinancialData();
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

// ==========================================
// FUNÇÕES DE INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar data atual
    const today = new Date();
    document.getElementById('date').valueAsDate = today;
   
    // Configurar componentes
    updateMonthButtons();
    setupNavigation();
    setupEventListeners();
    setupTheme();
    setupCalculator();
   
    // Atualizar interface
    updateMonthDisplay();
    financialData.updateDataInfo();
   
    // Configurar o botão flutuante da calculadora
    document.getElementById('calculator-fab').addEventListener('click', function() {
        showSection('calculator-section');
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
    });
});

// ==========================================
// CONFIGURAÇÃO DA CALCULADORA
// ==========================================
function setupCalculator() {
    const display = document.getElementById('calc-display');
    const history = document.getElementById('calc-history');
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetScreen = false;
    
    // Event listeners para os botões
    document.querySelectorAll('.calc-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (button.hasAttribute('data-number')) {
                appendNumber(button.getAttribute('data-number'));
            } else if (button.hasAttribute('data-operator')) {
                chooseOperation(button.getAttribute('data-operator'));
            } else if (button.hasAttribute('data-action')) {
                executeAction(button.getAttribute('data-action'));
            }
            updateDisplay();
        });
    });
    
    function appendNumber(number) {
        if (currentInput === '0' || shouldResetScreen) {
            if (number === '.') {
                currentInput = '0.';
            } else {
                currentInput = number;
            }
            shouldResetScreen = false;
        } else {
            if (number === '.' && currentInput.includes('.')) return;
            currentInput += number;
        }
    }
    
    function chooseOperation(op) {
        if (op === 'backspace') {
            if (currentInput.length === 1) {
                currentInput = '0';
            } else {
                currentInput = currentInput.slice(0, -1);
            }
            return;
        }
        
        if (currentInput === '0') return;
        
        if (previousInput !== '') {
            compute();
        }
        
        if (op === '%') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            return;
        }
        
        operation = op;
        previousInput = currentInput;
        shouldResetScreen = true;
    }
    
    function compute() {
        let computation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    computation = 0;
                    alert('Não é possível dividir por zero');
                } else {
                    computation = prev / current;
                }
                break;
            default:
                return;
        }
        
        history.textContent = `${previousInput} ${operation} ${currentInput} =`;
        currentInput = computation.toString();
        operation = null;
        shouldResetScreen = true;
    }
    
    function executeAction(action) {
        if (action === 'clear') {
            resetCalculator();
        } else if (action === 'calculate') {
            compute();
        } else if (action === 'transfer') {
            // Transferir resultado para o campo de valor
            document.getElementById('amount').value = currentInput;
            showSection('add-transaction');
           
            document.querySelectorAll('.nav-item').forEach(item => {
                if (item.getAttribute('data-section') === 'add-transaction') {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
        updateDisplay();
    }
    
    function resetCalculator() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        shouldResetScreen = false;
        history.textContent = '';
    }
    
    function updateDisplay() {
        display.textContent = currentInput;
    }
    
    // Inicializar a calculadora
    resetCalculator();
    updateDisplay();
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Formulário de transações
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
       
        const transaction = { description, amount, type, category, date };
        
        if (editingTransactionId) {
            financialData.updateTransaction(currentMonth, editingTransactionId, transaction);
            cancelEdit();
            alert('Transação atualizada com sucesso!');
        } else {
            financialData.addTransaction(currentMonth, transaction);
            alert('Transação adicionada com sucesso!');
        }
       
        this.reset();
        document.getElementById('date').valueAsDate = new Date();
        updateMonthDisplay();
        loadTransactions();
        showSection('transactions');
    });
    
    // Botões de ação
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
    document.getElementById('export-text-btn').addEventListener('click', exportData);
    document.getElementById('export-json-btn').addEventListener('click', exportDataJSON);
    document.getElementById('import-btn').addEventListener('click', importData);
    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
    document.getElementById('import-input').addEventListener('change', handleImport);
    document.getElementById('cancel-edit').addEventListener('click', cancelEdit);
}

// ==========================================
// NAVEGAÇÃO
// ==========================================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
   
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
           
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
           
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
   
    document.getElementById(sectionId).classList.add('active');
   
    if (sectionId === 'dashboard' || sectionId === 'transactions') {
        updateMonthDisplay();
        if (sectionId === 'transactions') {
            loadTransactions();
        }
    }
}

// ==========================================
// GERENCIAMENTO DE MESES
// ==========================================
function updateMonthButtons() {
    const monthButtonsContainer = document.getElementById('month-buttons');
    monthButtonsContainer.innerHTML = '';
   
    monthNames.forEach((name, index) => {
        const col = document.createElement('div');
        col.className = 'col-4 col-md-2';
        
        const button = document.createElement('button');
        button.className = 'month-btn' + (index === currentMonth ? ' active' : '');
        button.textContent = name.substring(0, 3);
        button.addEventListener('click', () => {
            currentMonth = index;
            updateMonthButtons();
            updateMonthDisplay();
            if (document.getElementById('transactions').classList.contains('active')) {
                loadTransactions();
            }
        });
        
        col.appendChild(button);
        monthButtonsContainer.appendChild(col);
    });
}

function updateMonthDisplay() {
    loadMonthData(currentMonth);
   
    document.querySelectorAll('.month-btn').forEach((btn, index) => {
        if (index === currentMonth) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

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
   
    document.getElementById('income-total').textContent = income.toFixed(2).replace('.', ',');
    document.getElementById('expenses-total').textContent = expenses.toFixed(2).replace('.', ',');
    document.getElementById('balance-total').textContent = balance.toFixed(2).replace('.', ',');
   
    const balanceCard = document.querySelector('.card-custom.balance');
    if (balance < 0) {
        balanceCard.classList.add('negative');
    } else {
        balanceCard.classList.remove('negative');
    }
}

// ==========================================
// GERENCIAMENTO DE TRANSAÇÕES
// ==========================================
function loadTransactions() {
    const transactions = financialData.getTransactions(currentMonth);
    const transactionsList = document.getElementById('transactions-list');
    const noTransactions = document.getElementById('no-transactions');
   
    transactionsList.innerHTML = '';
   
    if (transactions.length === 0) {
        noTransactions.style.display = 'block';
        return;
    }
   
    noTransactions.style.display = 'none';
   
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
   
    transactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
       
        const dateObj = new Date(transaction.date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
       
        const formattedAmount = transaction.amount.toFixed(2).replace('.', ',');
        const categoryDisplay = categoryNames[transaction.category] || transaction.category;
       
        transactionItem.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-date">${formattedDate}</div>
                <div class="transaction-desc">${transaction.description}</div>
                <div class="transaction-cat">${categoryDisplay}</div>
            </div>
            <div class="transaction-amount" style="color: ${transaction.type === 'income' ? 'var(--success)' : 'var(--danger)'};">
                R$ ${formattedAmount}
            </div>
        `;
       
        const actions = document.createElement('div');
        actions.className = 'transaction-actions';
       
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-primary btn-sm';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => editTransaction(transaction.id));
       
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));
       
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
       
        transactionItem.querySelector('.transaction-info').appendChild(actions);
        transactionsList.appendChild(transactionItem);
    });
}

function editTransaction(id) {
    const transactions = financialData.getTransactions(currentMonth);
    const transaction = transactions.find(t => t.id === id);
   
    if (!transaction) {
        alert('Transação não encontrada.');
        return;
    }
   
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('category').value = transaction.category;
    document.getElementById('date').value = transaction.date;
   
    editingTransactionId = id;
    document.getElementById('submit-btn').textContent = 'Atualizar Transação';
    document.getElementById('cancel-edit').style.display = 'block';
   
    showSection('add-transaction');
    window.scrollTo(0, 0);
}

function cancelEdit() {
    editingTransactionId = null;
    document.getElementById('submit-btn').textContent = 'Adicionar Transação';
    document.getElementById('cancel-edit').style.display = 'none';
    document.getElementById('transaction-form').reset();
    document.getElementById('date').valueAsDate = new Date();
}

function deleteTransaction(id) {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
        return;
    }
   
    financialData.deleteTransaction(currentMonth, id);
    updateMonthDisplay();
    loadTransactions();
    alert('Transação excluída com sucesso!');
}

// ==========================================
// RELATÓRIOS
// ==========================================
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
    
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let transactionsTable = '';
    if (transactions.length > 0) {
        transactionsTable = `
            <div class="card-custom" style="margin-top: 15px; overflow-x: auto;">
                <h3>Detalhamento das Transações</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Tipo</th>
                            <th>Valor (R$)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
       
        transactions.forEach(transaction => {
            const dateObj = new Date(transaction.date);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
            const categoryDisplay = categoryNames[transaction.category] || transaction.category;
            const formattedAmount = transaction.amount.toFixed(2).replace('.', ',');
            const rowClass = transaction.type === 'income' ? 'income-row' : 'expense-row';
           
            transactionsTable += `
                <tr class="${rowClass}">
                    <td>${formattedDate}</td>
                    <td>${transaction.description}</td>
                    <td>${categoryDisplay}</td>
                    <td>${transaction.type === 'income' ? 'Receita' : 'Despesa'}</td>
                    <td>${formattedAmount}</td>
                </tr>
            `;
           
            if (transaction.type === 'income') {
                income += transaction.amount;
                incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
            } else {
                expenses += transaction.amount;
                expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
            }
        });
       
        transactionsTable += `</tbody></table></div>`;
    }
    
    const balance = income - expenses;
    let reportHTML = `
        <div class="card-custom">
            <h3>Relatório de ${monthNames[monthIndex]} ${year}</h3>
            <p><strong>Total de Receitas:</strong> R$ ${income.toFixed(2).replace('.', ',')}</p>
            <p><strong>Total de Despesas:</strong> R$ ${expenses.toFixed(2).replace('.', ',')}</p>
            <p><strong>Saldo:</strong> <span style="color: ${balance >= 0 ? 'var(--success)' : 'var(--danger)'}">R$ ${balance.toFixed(2).replace('.', ',')}</span></p>
            <p><strong>Total de Transações:</strong> ${transactions.length}</p>
        </div>
    `;
   
    reportHTML += transactionsTable;
   
    if (Object.keys(expensesByCategory).length > 0) {
        reportHTML += `
            <div class="card-custom" style="margin-top: 15px;">
                <h3>Gráfico de Gastos por Categoria</h3>
                <canvas id="expensesChart" height="180"></canvas>
            </div>
        `;
    }
    
    // Adicionar tabelas de receitas e despesas por categoria
    if (Object.keys(incomeByCategory).length > 0) {
        reportHTML += `
            <div class="card-custom" style="margin-top: 15px;">
                <h3>Receitas por Categoria</h3>
                <table class="report-table">
                    <thead><tr><th>Categoria</th><th>Valor (R$)</th></tr></thead>
                    <tbody>
        `;
       
        Object.entries(incomeByCategory).forEach(([category, amount]) => {
            reportHTML += `
                <tr class="income-row">
                    <td>${categoryNames[category] || category}</td>
                    <td>${amount.toFixed(2).replace('.', ',')}</td>
                </tr>
            `;
        });
       
        reportHTML += `</tbody></table></div>`;
    }
   
    if (Object.keys(expensesByCategory).length > 0) {
        reportHTML += `
            <div class="card-custom" style="margin-top: 15px;">
                <h3>Despesas por Categoria</h3>
                <table class="report-table">
                    <thead><tr><th>Categoria</th><th>Valor (R$)</th></tr></thead>
                    <tbody>
        `;
       
        Object.entries(expensesByCategory).forEach(([category, amount]) => {
            reportHTML += `
                <tr class="expense-row">
                    <td>${categoryNames[category] || category}</td>
                    <td>${amount.toFixed(2).replace('.', ',')}</td>
                </tr>
            `;
        });
       
        reportHTML += `</tbody></table></div>`;
    }
    
    document.getElementById('report-content').innerHTML = reportHTML;
    
    // Renderizar gráfico
    if (Object.keys(expensesByCategory).length > 0) {
        const isDark = document.body.classList.contains('dark-mode');
        const ctx = document.getElementById('expensesChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(expensesByCategory).map(cat => categoryNames[cat] || cat),
                datasets: [{
                    label: 'Despesas por Categoria',
                    data: Object.values(expensesByCategory),
                    backgroundColor: isDark
                        ? ['#ff1744', '#ff9100', '#2979ff', '#00e676', '#d500f9', '#00bcd4', '#ffd600', '#ff3d00', '#00bfae', '#ffea00', '#c51162', '#00c853']
                        : ['#e74c3c', '#f39c12', '#3498db', '#2ecc71', '#9b59b6', '#34495e', '#95a5a6', '#1abc9c', '#e67e22', '#7f8c8d', '#c0392b', '#27ae60']
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        title: { display: true, text: 'Categoria', color: isDark ? '#fff' : '#000' },
                        ticks: { color: isDark ? '#fff' : '#000' },
                        grid: { color: isDark ? '#444' : '#ddd' }
                    },
                    y: {
                        title: { display: true, text: 'Valor (R$)', color: isDark ? '#fff' : '#000' },
                        ticks: { color: isDark ? '#fff' : '#000' },
                        grid: { color: isDark ? '#444' : '#ddd' },
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// ==========================================
// EXPORTAÇÃO E IMPORTAÇÃO
// ==========================================
function exportData() {
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

// ==========================================
// CONFIGURAÇÃO DE TEMA
// ==========================================
function setupTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const body = document.body;
    
    function updateIcon() {
        if (body.classList.contains('dark-mode')) {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('dark-mode', savedTheme === 'dark');
    } else {
        body.classList.toggle('dark-mode', prefersDarkScheme.matches);
    }
    
    updateIcon();
    
    themeBtn.addEventListener('click', function() {
        const isDark = !body.classList.contains('dark-mode');
        body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon();
    });
}
