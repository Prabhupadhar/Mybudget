// Excel Budget Planner Application
class ExcelBudgetPlanner {
    constructor() {
        this.transactions = [];
        this.budgetLimits = {};
        this.categories = {
            income: ['Salary', 'Business Income', 'Investment Returns', 'Rental Income', 'Bonus', 'Tips', 'Gifts Received', 'Other Income'],
            expenses: ['Housing', 'Food & Groceries', 'Transportation', 'Utilities', 'Insurance', 'Healthcare', 'Personal Care', 'Entertainment', 'Shopping', 'Education', 'Debt Payments', 'Savings', 'Investment', 'Travel', 'Miscellaneous']
        };
        
        this.editingTransaction = null;
        this.currentTab = 'dashboard';
        this.charts = {};
        
        this.init();
    }

    init() {
        console.log('Initializing Excel Budget Planner...');
        this.loadSampleData();
        this.setupEventListeners();
        this.populateCategoryFilters();
        this.switchTab('dashboard');
        this.updateDashboard();
        console.log('Application initialized successfully');
    }

    // Load initial sample data
    loadSampleData() {
        this.transactions = [
            {
                id: 1,
                type: 'income',
                category: 'Salary',
                amount: 75000,
                description: 'Monthly Salary',
                date: '2024-12-01'
            },
            {
                id: 2,
                type: 'expense',
                category: 'Housing',
                amount: 20000,
                description: 'Monthly Rent',
                date: '2024-12-01'
            },
            {
                id: 3,
                type: 'expense',
                category: 'Food & Groceries',
                amount: 8000,
                description: 'Monthly Groceries',
                date: '2024-12-02'
            },
            {
                id: 4,
                type: 'expense',
                category: 'Transportation',
                amount: 5000,
                description: 'Fuel & Metro',
                date: '2024-12-03'
            },
            {
                id: 5,
                type: 'expense',
                category: 'Utilities',
                amount: 3500,
                description: 'Electricity & Water',
                date: '2024-12-04'
            },
            {
                id: 6,
                type: 'expense',
                category: 'Entertainment',
                amount: 2000,
                description: 'Movie & Dinner',
                date: '2024-12-05'
            },
            {
                id: 7,
                type: 'expense',
                category: 'Healthcare',
                amount: 1500,
                description: 'Medical Checkup',
                date: '2024-12-06'
            },
            {
                id: 8,
                type: 'expense',
                category: 'Shopping',
                amount: 4000,
                description: 'Clothing',
                date: '2024-12-07'
            }
        ];

        this.budgetLimits = {
            'Housing': 25000,
            'Food & Groceries': 12000,
            'Transportation': 6000,
            'Utilities': 4000,
            'Entertainment': 5000,
            'Shopping': 6000,
            'Healthcare': 4000,
            'Personal Care': 2000,
            'Education': 3000,
            'Miscellaneous': 3000
        };
        console.log('Sample data loaded');
    }

    // Event Listeners Setup
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tab switching - Fix the event listener
        document.querySelectorAll('.worksheet-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.currentTarget.getAttribute('data-tab');
                console.log('Tab clicked:', tabName);
                this.switchTab(tabName);
            });
        });

        // Add transaction button - Fix the event listener
        const addBtn = document.getElementById('add-transaction-btn');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add transaction button clicked');
                this.showTransactionModal();
            });
        }

        // Transaction modal events
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideTransactionModal();
            });
        }

        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideTransactionModal();
            });
        }

        const transactionType = document.getElementById('transaction-type');
        if (transactionType) {
            transactionType.addEventListener('change', () => {
                this.updateCategoryOptions();
            });
        }

        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                this.handleTransactionSubmit(e);
            });
        }

        // Budget modal events
        const editBudgetBtn = document.getElementById('edit-budget-btn');
        if (editBudgetBtn) {
            editBudgetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Edit budget button clicked');
                this.showBudgetModal();
            });
        }

        const closeBudgetModal = document.getElementById('close-budget-modal');
        if (closeBudgetModal) {
            closeBudgetModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideBudgetModal();
            });
        }

        const cancelBudgetBtn = document.getElementById('cancel-budget-btn');
        if (cancelBudgetBtn) {
            cancelBudgetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideBudgetModal();
            });
        }

        const budgetForm = document.getElementById('budget-form');
        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => {
                this.handleBudgetSubmit(e);
            });
        }

        // Search and filter events
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterTransactions();
            });
        }

        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterTransactions();
            });
        }

        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.filterTransactions();
            });
        }

        // Close modals on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('excel-modal')) {
                this.hideAllModals();
            }
        });

        // Set today's date as default
        const transactionDate = document.getElementById('transaction-date');
        if (transactionDate) {
            transactionDate.value = new Date().toISOString().split('T')[0];
        }
        
        console.log('Event listeners setup complete');
    }

    // Tab Management - Fix the tab switching logic
    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        if (!tabName) {
            console.error('No tab name provided');
            return;
        }
        
        // Update active tab button
        document.querySelectorAll('.worksheet-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('active');
            console.log('Tab button activated:', tabName);
        } else {
            console.error('Tab button not found for:', tabName);
        }

        // Update active content
        document.querySelectorAll('.worksheet-content').forEach(content => {
            content.classList.remove('active');
            console.log('Removed active from:', content.id);
        });
        
        const activeTabContent = document.getElementById(tabName);
        if (activeTabContent) {
            activeTabContent.classList.add('active');
            console.log('Tab content activated:', tabName);
        } else {
            console.error('Tab content not found for:', tabName);
        }

        this.currentTab = tabName;

        // Render content based on active tab with slight delay for DOM update
        setTimeout(() => {
            switch(tabName) {
                case 'dashboard':
                    this.updateDashboard();
                    break;
                case 'transactions':
                    this.renderTransactions();
                    break;
                case 'budget':
                    this.renderBudgetPlanning();
                    break;
                case 'reports':
                    this.renderReports();
                    break;
            }
        }, 50);
    }

    // Dashboard Updates
    updateDashboard() {
        console.log('Updating dashboard...');
        
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const currentBalance = totalIncome - totalExpenses;

        const incomeEl = document.getElementById('total-income');
        const expensesEl = document.getElementById('total-expenses');
        const balanceEl = document.getElementById('current-balance');

        if (incomeEl) incomeEl.textContent = this.formatCurrency(totalIncome);
        if (expensesEl) expensesEl.textContent = this.formatCurrency(totalExpenses);
        if (balanceEl) balanceEl.textContent = this.formatCurrency(currentBalance);

        // Update dashboard summary table
        this.updateDashboardSummary();
        
        // Update dashboard charts with delay to ensure elements are visible
        setTimeout(() => {
            this.renderDashboardCharts();
        }, 100);
        
        console.log('Dashboard updated');
    }

    updateDashboardSummary() {
        const tbody = document.getElementById('dashboard-summary-body');
        if (!tbody) return;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Calculate monthly spending by category
        const monthlySpending = {};
        this.transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return t.type === 'expense' && 
                       transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear;
            })
            .forEach(t => {
                monthlySpending[t.category] = (monthlySpending[t.category] || 0) + t.amount;
            });

        const summaryData = Object.entries(this.budgetLimits).map(([category, limit]) => {
            const spent = monthlySpending[category] || 0;
            const remaining = limit - spent;
            const percentage = limit > 0 ? (spent / limit) * 100 : 0;
            
            let status = 'Safe';
            let statusClass = 'status-safe';
            
            if (percentage >= 100) {
                status = 'Over Budget';
                statusClass = 'status-danger';
            } else if (percentage >= 80) {
                status = 'Near Limit';
                statusClass = 'status-warning';
            }

            return { category, limit, spent, remaining, status, statusClass };
        });

        tbody.innerHTML = summaryData.map(item => `
            <tr>
                <td>${item.category}</td>
                <td>₹${this.formatNumber(item.limit)}</td>
                <td>₹${this.formatNumber(item.spent)}</td>
                <td>₹${this.formatNumber(item.remaining)}</td>
                <td><span class="status-indicator ${item.statusClass}">${item.status}</span></td>
            </tr>
        `).join('');
    }

    // Transaction Management
    renderTransactions() {
        console.log('Rendering transactions...');
        const tbody = document.getElementById('transactions-table-body');
        if (!tbody) {
            console.error('Transactions table body not found');
            return;
        }
        
        if (this.transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <h3>No transactions yet</h3>
                        <p>Start by adding your first income or expense transaction.</p>
                    </td>
                </tr>
            `;
            return;
        }

        const sortedTransactions = [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        tbody.innerHTML = sortedTransactions.map((transaction, index) => `
            <tr>
                <td class="row-number">${index + 1}</td>
                <td>${this.formatDate(transaction.date)}</td>
                <td><span class="status-indicator status-${transaction.type === 'income' ? 'safe' : 'warning'}">${transaction.type}</span></td>
                <td>${transaction.category}</td>
                <td>${transaction.description}</td>
                <td style="text-align: right; font-family: 'Consolas', monospace; color: ${transaction.type === 'income' ? '#28a745' : '#dc3545'};">
                    ${transaction.type === 'income' ? '+' : '-'}₹${this.formatNumber(transaction.amount)}
                </td>
                <td>
                    <div class="transaction-actions">
                        <button class="action-btn edit" onclick="app.editTransaction(${transaction.id})">Edit</button>
                        <button class="action-btn delete" onclick="app.deleteTransaction(${transaction.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        console.log('Transactions rendered successfully');
    }

    showTransactionModal(transaction = null) {
        console.log('Showing transaction modal...');
        this.editingTransaction = transaction;
        const modal = document.getElementById('transaction-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('transaction-form');

        if (!modal || !title || !form) {
            console.error('Modal elements not found');
            return;
        }

        if (transaction) {
            title.textContent = 'Edit Transaction';
            this.populateTransactionForm(transaction);
        } else {
            title.textContent = 'Add New Transaction';
            form.reset();
            const dateField = document.getElementById('transaction-date');
            if (dateField) {
                dateField.value = new Date().toISOString().split('T')[0];
            }
        }

        modal.classList.remove('hidden');
        console.log('Transaction modal shown');
        
        // Focus first field for better UX
        setTimeout(() => {
            const firstField = modal.querySelector('select, input');
            if (firstField) firstField.focus();
        }, 100);
    }

    hideTransactionModal() {
        const modal = document.getElementById('transaction-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.editingTransaction = null;
    }

    populateTransactionForm(transaction) {
        const typeField = document.getElementById('transaction-type');
        const categoryField = document.getElementById('transaction-category');
        const amountField = document.getElementById('transaction-amount');
        const descField = document.getElementById('transaction-description');
        const dateField = document.getElementById('transaction-date');

        if (typeField) typeField.value = transaction.type;
        this.updateCategoryOptions();
        if (categoryField) categoryField.value = transaction.category;
        if (amountField) amountField.value = transaction.amount;
        if (descField) descField.value = transaction.description;
        if (dateField) dateField.value = transaction.date;
    }

    handleTransactionSubmit(e) {
        e.preventDefault();
        console.log('Handling transaction submit...');
        
        const formData = {
            type: document.getElementById('transaction-type')?.value,
            category: document.getElementById('transaction-category')?.value,
            amount: parseFloat(document.getElementById('transaction-amount')?.value),
            description: document.getElementById('transaction-description')?.value,
            date: document.getElementById('transaction-date')?.value
        };

        // Validation
        if (!formData.type || !formData.category || !formData.amount || !formData.description || !formData.date) {
            alert('Please fill in all fields');
            return;
        }

        if (isNaN(formData.amount) || formData.amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (this.editingTransaction) {
            // Update existing transaction
            const index = this.transactions.findIndex(t => t.id === this.editingTransaction.id);
            if (index !== -1) {
                this.transactions[index] = { ...this.editingTransaction, ...formData };
                console.log('Transaction updated');
            }
        } else {
            // Add new transaction
            const transaction = {
                id: Date.now(),
                ...formData
            };
            this.transactions.push(transaction);
            console.log('New transaction added');
        }

        // Update all views
        this.updateDashboard();
        this.renderTransactions();
        this.renderBudgetPlanning();
        this.hideTransactionModal();
    }

    editTransaction(id) {
        console.log('Editing transaction:', id);
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.showTransactionModal(transaction);
        }
    }

    deleteTransaction(id) {
        console.log('Deleting transaction:', id);
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.updateDashboard();
            this.renderTransactions();
            this.renderBudgetPlanning();
        }
    }

    // Budget Management
    renderBudgetPlanning() {
        console.log('Rendering budget planning...');
        const container = document.getElementById('budget-planning-grid');
        if (!container) {
            console.error('Budget planning container not found');
            return;
        }
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Calculate monthly spending by category
        const monthlySpending = {};
        this.transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return t.type === 'expense' && 
                       transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear;
            })
            .forEach(t => {
                monthlySpending[t.category] = (monthlySpending[t.category] || 0) + t.amount;
            });

        const budgetItems = Object.entries(this.budgetLimits).map(([category, limit]) => {
            const spent = monthlySpending[category] || 0;
            const remaining = limit - spent;
            const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
            
            let progressClass = 'safe';
            let statusClass = 'safe';
            let statusText = `₹${this.formatNumber(remaining)} remaining`;
            
            if (percentage >= 100) {
                progressClass = 'danger';
                statusClass = 'over';
                statusText = `₹${this.formatNumber(Math.abs(remaining))} over budget`;
            } else if (percentage >= 80) {
                progressClass = 'warning';
                statusClass = 'near';
            }

            return `
                <div class="budget-item">
                    <div class="budget-item-header">
                        <div class="budget-category">${category}</div>
                        <div class="budget-amounts">₹${this.formatNumber(spent)} / ₹${this.formatNumber(limit)}</div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-bar ${progressClass}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="budget-status ${statusClass}">${statusText}</div>
                </div>
            `;
        });

        container.innerHTML = budgetItems.join('');
        console.log('Budget planning rendered');
    }

    showBudgetModal() {
        console.log('Showing budget modal...');
        const modal = document.getElementById('budget-modal');
        if (!modal) {
            console.error('Budget modal not found');
            return;
        }
        
        this.populateBudgetForm();
        modal.classList.remove('hidden');
        console.log('Budget modal shown');
    }

    hideBudgetModal() {
        const modal = document.getElementById('budget-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    populateBudgetForm() {
        const container = document.getElementById('budget-inputs');
        if (!container) return;
        
        container.innerHTML = this.categories.expenses.map(category => {
            const currentLimit = this.budgetLimits[category] || 0;
            return `
                <div class="budget-input-row">
                    <label class="budget-input-label">${category}</label>
                    <input type="number" name="${category}" value="${currentLimit}" min="0" step="100" class="excel-input budget-input-field">
                </div>
            `;
        }).join('');
    }

    handleBudgetSubmit(e) {
        e.preventDefault();
        console.log('Handling budget submit...');
        
        const formData = new FormData(e.target);
        const newBudgets = {};
        
        for (let [category, amount] of formData.entries()) {
            newBudgets[category] = parseFloat(amount) || 0;
        }
        
        this.budgetLimits = newBudgets;
        this.renderBudgetPlanning();
        this.updateDashboard();
        this.hideBudgetModal();
        console.log('Budget updated');
    }

    // Reports and Charts
    renderReports() {
        console.log('Rendering reports...');
        setTimeout(() => {
            this.renderExpenseTrendsChart();
            this.renderIncomeExpenseChart();
            this.renderFinancialInsights();
        }, 100);
    }

    renderDashboardCharts() {
        this.renderMonthlyOverviewChart();
        this.renderCategoryPieChart();
    }

    renderMonthlyOverviewChart() {
        const canvas = document.getElementById('monthly-overview-chart');
        if (!canvas) return;

        if (this.charts.monthlyOverview) {
            this.charts.monthlyOverview.destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // Get last 6 months data
        const monthlyData = this.getMonthlyData(6);
        const labels = Object.keys(monthlyData).map(key => {
            const date = new Date(key + '-01');
            return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        });

        const incomeData = Object.values(monthlyData).map(data => data.income);
        const expenseData = Object.values(monthlyData).map(data => data.expenses);

        this.charts.monthlyOverview = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: '#1FB8CD',
                    borderRadius: 4
                }, {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: '#B4413C',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return context.dataset.label + ': ₹' + this.formatNumber(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + this.formatNumber(value)
                        }
                    }
                }
            }
        });
    }

    renderCategoryPieChart() {
        const canvas = document.getElementById('category-pie-chart');
        if (!canvas) return;

        if (this.charts.categoryPie) {
            this.charts.categoryPie.destroy();
        }

        const ctx = canvas.getContext('2d');
        const categorySpending = this.getCategorySpending();
        
        if (Object.keys(categorySpending).length === 0) {
            return;
        }

        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
        
        this.charts.categoryPie = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categorySpending),
                datasets: [{
                    data: Object.values(categorySpending),
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return context.label + ': ₹' + this.formatNumber(context.raw);
                            }
                        }
                    }
                }
            }
        });
    }

    renderExpenseTrendsChart() {
        const canvas = document.getElementById('expense-trends-chart');
        if (!canvas) return;

        if (this.charts.expenseTrends) {
            this.charts.expenseTrends.destroy();
        }

        const ctx = canvas.getContext('2d');
        const monthlyData = this.getMonthlyData(12);
        
        const labels = Object.keys(monthlyData).map(key => {
            const date = new Date(key + '-01');
            return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        });

        const expenseData = Object.values(monthlyData).map(data => data.expenses);

        this.charts.expenseTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Expenses',
                    data: expenseData,
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return 'Expenses: ₹' + this.formatNumber(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + this.formatNumber(value)
                        }
                    }
                }
            }
        });
    }

    renderIncomeExpenseChart() {
        const canvas = document.getElementById('income-expense-chart');
        if (!canvas) return;

        if (this.charts.incomeExpense) {
            this.charts.incomeExpense.destroy();
        }

        const ctx = canvas.getContext('2d');
        const monthlyData = this.getMonthlyData(6);
        
        const labels = Object.keys(monthlyData).map(key => {
            const date = new Date(key + '-01');
            return date.toLocaleDateString('en-IN', { month: 'short' });
        });

        const incomeData = Object.values(monthlyData).map(data => data.income);
        const expenseData = Object.values(monthlyData).map(data => data.expenses);

        this.charts.incomeExpense = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: false,
                    tension: 0.4
                }, {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return context.dataset.label + ': ₹' + this.formatNumber(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + this.formatNumber(value)
                        }
                    }
                }
            }
        });
    }

    renderFinancialInsights() {
        const container = document.getElementById('financial-insights');
        if (!container) return;
        
        const totalIncome = this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;
        
        const topExpenseCategory = this.getTopExpenseCategory();
        const avgTransaction = this.transactions.filter(t => t.type === 'expense').length > 0 
            ? totalExpenses / this.transactions.filter(t => t.type === 'expense').length 
            : 0;

        container.innerHTML = `
            <div class="insight-card">
                <h4>Savings Rate</h4>
                <div class="insight-value">${savingsRate}%</div>
                <p>of your income is being saved</p>
            </div>
            <div class="insight-card">
                <h4>Top Spending</h4>
                <div class="insight-value">${topExpenseCategory.category}</div>
                <p>₹${this.formatNumber(topExpenseCategory.amount)} spent</p>
            </div>
            <div class="insight-card">
                <h4>Average Transaction</h4>
                <div class="insight-value">₹${this.formatNumber(avgTransaction)}</div>
                <p>per expense transaction</p>
            </div>
        `;
    }

    // Filtering and Search
    populateCategoryFilters() {
        const allCategories = [...this.categories.income, ...this.categories.expenses];
        const categoryFilter = document.getElementById('category-filter');
        
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            allCategories.forEach(category => {
                categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
            });
        }
    }

    updateCategoryOptions() {
        const typeSelect = document.getElementById('transaction-type');
        const categorySelect = document.getElementById('transaction-category');
        
        if (!typeSelect || !categorySelect) return;
        
        const type = typeSelect.value;
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        if (type === 'income') {
            this.categories.income.forEach(category => {
                categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
            });
        } else if (type === 'expense') {
            this.categories.expenses.forEach(category => {
                categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
            });
        }
    }

    filterTransactions() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const typeFilter = document.getElementById('type-filter');
        
        if (!searchInput || !categoryFilter || !typeFilter) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value;
        const typeValue = typeFilter.value;

        const filtered = this.transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
                                transaction.category.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryValue || transaction.category === categoryValue;
            const matchesType = !typeValue || transaction.type === typeValue;
            
            return matchesSearch && matchesCategory && matchesType;
        });

        this.renderFilteredTransactions(filtered);
    }

    renderFilteredTransactions(transactions) {
        const tbody = document.getElementById('transactions-table-body');
        if (!tbody) return;
        
        if (transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <h3>No transactions found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </td>
                </tr>
            `;
            return;
        }

        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        tbody.innerHTML = sortedTransactions.map((transaction, index) => `
            <tr>
                <td class="row-number">${index + 1}</td>
                <td>${this.formatDate(transaction.date)}</td>
                <td><span class="status-indicator status-${transaction.type === 'income' ? 'safe' : 'warning'}">${transaction.type}</span></td>
                <td>${transaction.category}</td>
                <td>${transaction.description}</td>
                <td style="text-align: right; font-family: 'Consolas', monospace; color: ${transaction.type === 'income' ? '#28a745' : '#dc3545'};">
                    ${transaction.type === 'income' ? '+' : '-'}₹${this.formatNumber(transaction.amount)}
                </td>
                <td>
                    <div class="transaction-actions">
                        <button class="action-btn edit" onclick="app.editTransaction(${transaction.id})">Edit</button>
                        <button class="action-btn delete" onclick="app.deleteTransaction(${transaction.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Modal Management
    hideAllModals() {
        document.querySelectorAll('.excel-modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.editingTransaction = null;
    }

    // Utility Functions
    formatCurrency(amount) {
        return '₹' + this.formatNumber(Math.abs(amount));
    }

    formatNumber(amount) {
        return Math.abs(amount).toLocaleString('en-IN');
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getMonthlyData(monthsBack) {
        const monthlyData = {};
        const currentDate = new Date();
        
        for (let i = monthsBack - 1; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthKey = date.toISOString().slice(0, 7);
            monthlyData[monthKey] = { income: 0, expenses: 0 };
        }

        this.transactions.forEach(t => {
            const monthKey = t.date.slice(0, 7);
            if (monthlyData[monthKey]) {
                monthlyData[monthKey][t.type === 'income' ? 'income' : 'expenses'] += t.amount;
            }
        });

        return monthlyData;
    }

    getCategorySpending() {
        const categorySpending = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
            });
        return categorySpending;
    }

    getTopExpenseCategory() {
        const categoryTotals = this.getCategorySpending();
        let topCategory = { category: 'None', amount: 0 };
        
        for (const [category, amount] of Object.entries(categoryTotals)) {
            if (amount > topCategory.amount) {
                topCategory = { category, amount };
            }
        }
        
        return topCategory;
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing app...');
    app = new ExcelBudgetPlanner();
    console.log('App initialized and ready');
});