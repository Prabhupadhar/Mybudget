// Personal Finance Tracker - Manual Entry Application
class FinanceTracker {
    constructor() {
        this.transactions = [];
        this.categories = [
            'Income',
            'Housing & Rent', 
            'Groceries & Food',
            'Transportation',
            'Utilities',
            'Entertainment', 
            'Healthcare',
            'Shopping',
            'Subscriptions',
            'Debt Payments',
            'Savings',
            'Other Expenses'
            'House EMI'
        ];
        
        this.paymentMethods = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'];
        
        this.categoryKeywords = {
            'Income': ['salary', 'freelance', 'bonus', 'dividend', 'interest', 'refund', 'income', 'deposit', 'pay'],
            'Housing & Rent': ['rent', 'mortgage', 'property', 'housing', 'apartment', 'lease', 'maintenance'],
            'Groceries & Food': ['grocery', 'supermarket', 'restaurant', 'food', 'cafe', 'starbucks', 'mcdonald', 'dmart', 'big bazaar', 'reliance fresh', 'more', 'spencer\'s', 'zomato', 'swiggy', 'dominos', 'pizza hut'],
            'Transportation': ['uber', 'lyft', 'ola', 'rapido', 'gas', 'fuel', 'metro', 'bus', 'taxi', 'car', 'parking', 'toll', 'auto', 'rickshaw', 'petrol', 'diesel'],
            'Utilities': ['electric', 'water', 'gas bill', 'internet', 'phone', 'cable', 'utility', 'power', 'bses', 'tata power', 'airtel', 'jio', 'bsnl', 'lpg', 'mobile bill'],
            'Entertainment': ['movie', 'theater', 'netflix', 'spotify', 'gaming', 'concert', 'entertainment', 'bookmyshow', 'hotstar', 'prime', 'youtube'],
            'Healthcare': ['pharmacy', 'doctor', 'hospital', 'medical', 'dental', 'insurance', 'health', 'apollo', 'fortis', 'max', 'medplus', '1mg'],
            'Shopping': ['amazon', 'store', 'mall', 'clothing', 'electronics', 'shopping', 'flipkart', 'myntra', 'nykaa', 'paytm mall', 'ajio'],
            'Subscriptions': ['subscription', 'netflix', 'spotify', 'gym', 'membership', 'monthly', 'prime', 'hotstar'],
            'Debt Payments': ['credit card', 'loan', 'debt', 'payment', 'interest', 'emi'],
            'Savings': ['savings', 'investment', '401k', 'retirement', 'ira', 'sip', 'mutual fund', 'ppf', 'nsc']
        };

        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.filteredTransactions = [];
        this.editingTransaction = null;
        this.charts = {};
        this.isInitialized = false;

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.loadDataFromStorage();
        this.setTodayDate();
        this.populateFilters();
        this.updateUI();
        this.isInitialized = true;
        
        // Initialize with dashboard
        this.switchTab('dashboard');
        
        console.log('Finance Tracker initialized successfully');
    }

    setupEventListeners() {
        // Navigation - Fix the event handling
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                e.preventDefault();
                e.stopPropagation();
                const tabName = e.target.getAttribute('data-tab');
                if (tabName) {
                    this.switchTab(tabName);
                }
                return;
            }
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Dashboard buttons
        const loadSampleBtn = document.getElementById('load-sample-btn');
        const clearDataBtn = document.getElementById('clear-data-btn');
        const quickAddBtn = document.getElementById('quick-add-btn');
        const viewAllTransactionsBtn = document.getElementById('view-all-transactions');
        
        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadSampleData();
            });
        }
        
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearAllData();
            });
        }

        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab('add-transaction');
            });
        }

        if (viewAllTransactionsBtn) {
            viewAllTransactionsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab('transactions');
            });
        }

        // Transaction form
        const transactionForm = document.getElementById('transaction-form');
        const saveAndAddAnotherBtn = document.getElementById('save-and-add-another');
        
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e, false);
            });
        }

        if (saveAndAddAnotherBtn) {
            saveAndAddAnotherBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e, true);
            });
        }

        // Transaction type change
        const typeInputs = document.querySelectorAll('input[name="transaction-type"]');
        typeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateCategoryOptions();
            });
        });

        // Search and filter
        const searchInput = document.getElementById('search-transactions');
        const categoryFilter = document.getElementById('category-filter');
        const paymentFilter = document.getElementById('payment-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterTransactions();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterTransactions();
            });
        }

        if (paymentFilter) {
            paymentFilter.addEventListener('change', () => {
                this.filterTransactions();
            });
        }

        // Export buttons
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        const exportCsvBtn = document.getElementById('export-csv-btn');
        const exportChartsBtn = document.getElementById('export-charts-btn');
        
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportPDF();
            });
        }
        
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportCSV();
            });
        }
        
        if (exportChartsBtn) {
            exportChartsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportCharts();
            });
        }

        // Modal handling
        const modalCloseButtons = document.querySelectorAll('.modal-close');
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        const saveTransactionBtn = document.getElementById('save-transaction-btn');
        if (saveTransactionBtn) {
            saveTransactionBtn.addEventListener('click', () => {
                this.saveTransactionEdit();
            });
        }

        // Notification close
        const notificationClose = document.querySelector('.notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }
    }

    setTodayDate() {
        const dateInput = document.getElementById('transaction-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === tabName) {
                item.classList.add('active');
            }
        });

        // Update content visibility
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        } else {
            console.error('Tab not found:', tabName);
            return;
        }

        // Update specific tab content
        if (tabName === 'dashboard') {
            this.updateDashboard();
        } else if (tabName === 'add-transaction') {
            this.setTodayDate();
            this.updateCategoryOptions();
        } else if (tabName === 'analytics') {
            setTimeout(() => this.updateAnalyticsCharts(), 200);
        } else if (tabName === 'transactions') {
            this.filterTransactions();
            this.updateTransactionsTable();
        } else if (tabName === 'export') {
            this.updateExportStats();
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-color-scheme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-color-scheme', newTheme);
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
        
        localStorage.setItem('theme', newTheme);
    }

    loadSampleData() {
        console.log('Loading sample data...');
        
        const sampleTransactions = [
            {
                id: this.generateId(),
                date: "2024-08-01",
                description: "Software Engineer Salary",
                amount: 95000,
                category: "Income",
                type: "income",
                paymentMethod: "Bank Transfer",
                notes: "Monthly salary - Tech Corp"
            },
            {
                id: this.generateId(),
                date: "2024-08-02",
                description: "Apartment Rent",
                amount: 28000,
                category: "Housing & Rent",
                type: "expense",
                paymentMethod: "Bank Transfer",
                notes: "Monthly rent for 2BHK"
            },
            {
                id: this.generateId(),
                date: "2024-08-03",
                description: "DMart Weekly Shopping",
                amount: 4200,
                category: "Groceries & Food",
                type: "expense",
                paymentMethod: "Card",
                notes: "Vegetables, fruits, household items"
            },
            {
                id: this.generateId(),
                date: "2024-08-03",
                description: "Netflix Monthly",
                amount: 649,
                category: "Subscriptions",
                type: "expense",
                paymentMethod: "Card",
                notes: "Premium subscription"
            },
            {
                id: this.generateId(),
                date: "2024-08-04",
                description: "Ola Auto to Office",
                amount: 85,
                category: "Transportation",
                type: "expense",
                paymentMethod: "UPI",
                notes: "Daily commute"
            },
            {
                id: this.generateId(),
                date: "2024-08-05",
                description: "Electricity Bill BSES",
                amount: 3200,
                category: "Utilities",
                type: "expense",
                paymentMethod: "Bank Transfer",
                notes: "Quarterly bill payment"
            },
            {
                id: this.generateId(),
                date: "2024-08-05",
                description: "PVR Movie Night",
                amount: 950,
                category: "Entertainment",
                type: "expense",
                paymentMethod: "Card",
                notes: "Movie + snacks with friends"
            },
            {
                id: this.generateId(),
                date: "2024-08-06",
                description: "Freelance Web Design",
                amount: 18000,
                category: "Income",
                type: "income",
                paymentMethod: "UPI",
                notes: "Logo design project"
            },
            {
                id: this.generateId(),
                date: "2024-08-07",
                description: "Shell Petrol",
                amount: 1800,
                category: "Transportation",
                type: "expense",
                paymentMethod: "Card",
                notes: "Full tank for car"
            },
            {
                id: this.generateId(),
                date: "2024-08-08",
                description: "Apollo Pharmacy",
                amount: 1200,
                category: "Healthcare",
                type: "expense",
                paymentMethod: "UPI",
                notes: "Monthly medicines"
            },
            {
                id: this.generateId(),
                date: "2024-08-08",
                description: "Myntra Shopping",
                amount: 3500,
                category: "Shopping",
                type: "expense",
                paymentMethod: "Card",
                notes: "Work shirts and formal wear"
            },
            {
                id: this.generateId(),
                date: "2024-08-09",
                description: "Jio Mobile Recharge",
                amount: 719,
                category: "Utilities",
                type: "expense",
                paymentMethod: "UPI",
                notes: "3 month plan with unlimited data"
            },
            {
                id: this.generateId(),
                date: "2024-08-09",
                description: "Zomato Dinner Order",
                amount: 850,
                category: "Groceries & Food",
                type: "expense",
                paymentMethod: "UPI",
                notes: "Chinese food delivery"
            },
            {
                id: this.generateId(),
                date: "2024-08-09",
                description: "SIP Mutual Fund",
                amount: 15000,
                category: "Savings",
                type: "expense",
                paymentMethod: "Bank Transfer",
                notes: "Monthly investment in equity funds"
            },
            {
                id: this.generateId(),
                date: "2024-07-28",
                description: "Quarterly Bonus",
                amount: 25000,
                category: "Income",
                type: "income",
                paymentMethod: "Bank Transfer",
                notes: "Performance bonus Q2"
            }
        ];

        this.transactions = [...sampleTransactions];
        this.filterTransactions();
        this.updateUI();
        this.saveDataToStorage();
        this.showNotification('Sample data loaded successfully!');
        
        console.log('Sample data loaded:', this.transactions.length, 'transactions');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            this.transactions = [];
            this.filterTransactions();
            this.updateUI();
            this.saveDataToStorage();
            this.showNotification('All data cleared successfully!');
        }
    }

    updateCategoryOptions() {
        const typeInputs = document.querySelectorAll('input[name="transaction-type"]');
        const categorySelect = document.getElementById('transaction-category');
        
        if (!categorySelect) return;
        
        let selectedType = 'expense'; // default
        typeInputs.forEach(input => {
            if (input.checked) {
                selectedType = input.value;
            }
        });

        const currentValue = categorySelect.value;
        
        if (selectedType === 'income') {
            categorySelect.innerHTML = '<option value="">Select Category</option><option value="Income">Income</option>';
            categorySelect.value = 'Income';
        } else {
            const expenseCategories = this.categories.filter(cat => cat !== 'Income');
            categorySelect.innerHTML = '<option value="">Select Category</option>' + 
                expenseCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
            
            // Restore previous value if valid for this type
            if (expenseCategories.includes(currentValue)) {
                categorySelect.value = currentValue;
            }
        }
    }

    handleFormSubmit(e, saveAndAddAnother = false) {
        e.preventDefault();
        
        const dateInput = document.getElementById('transaction-date');
        const descriptionInput = document.getElementById('transaction-description');
        const amountInput = document.getElementById('transaction-amount');
        const categorySelect = document.getElementById('transaction-category');
        const paymentMethodSelect = document.getElementById('payment-method');
        const notesInput = document.getElementById('transaction-notes');
        
        // Get transaction type
        const typeInputs = document.querySelectorAll('input[name="transaction-type"]');
        let transactionType = 'expense';
        typeInputs.forEach(input => {
            if (input.checked) {
                transactionType = input.value;
            }
        });

        // Validate inputs exist
        if (!dateInput || !descriptionInput || !amountInput || !categorySelect) {
            alert('Form elements not found. Please refresh the page.');
            return;
        }

        const transaction = {
            id: this.generateId(),
            date: dateInput.value,
            description: descriptionInput.value,
            amount: parseFloat(amountInput.value) || 0,
            category: categorySelect.value,
            type: transactionType,
            paymentMethod: paymentMethodSelect ? paymentMethodSelect.value : 'Cash',
            notes: notesInput ? notesInput.value : ''
        };

        // Validate required fields
        if (!transaction.date || !transaction.description || transaction.amount <= 0 || !transaction.category) {
            alert('Please fill in all required fields with valid data.');
            return;
        }

        console.log('Adding transaction:', transaction);
        this.addTransaction(transaction);
        
        if (saveAndAddAnother) {
            this.clearForm();
            this.setTodayDate();
            this.showNotification('Transaction saved! Add another one.');
        } else {
            this.showSuccessMessage();
            setTimeout(() => {
                this.switchTab('dashboard');
            }, 1500);
        }
    }

    clearForm() {
        const form = document.getElementById('transaction-form');
        if (form) {
            form.reset();
            // Reset radio button to expense
            const expenseRadio = document.getElementById('type-expense');
            if (expenseRadio) {
                expenseRadio.checked = true;
            }
            this.updateCategoryOptions();
        }
    }

    showSuccessMessage() {
        const successEl = document.getElementById('form-success');
        if (successEl) {
            successEl.classList.remove('hidden');
            setTimeout(() => {
                successEl.classList.add('hidden');
            }, 3000);
        }
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.filterTransactions();
        this.updateUI();
        this.saveDataToStorage();
        
        console.log('Transaction added successfully:', transaction);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.abs(amount));
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
        };
        return date.toLocaleDateString('en-IN', options);
    }

    updateUI() {
        this.updateSummaryCards();
        this.updateDashboard();
        
        // Update transactions if on that tab
        if (document.getElementById('transactions')?.classList.contains('active')) {
            this.updateTransactionsTable();
        }
    }

    updateDashboard() {
        this.updateDashboardCharts();
        this.updateRecentTransactions();
        this.updateQuickInsights();
    }

    updateSummaryCards() {
        const currentMonth = new Date().toISOString().substr(0, 7);
        const monthlyTransactions = this.transactions.filter(t => t.date.startsWith(currentMonth));
        
        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlySavings = monthlyIncome - monthlyExpenses;
        const healthScore = this.calculateHealthScore(monthlyIncome, monthlyExpenses, monthlySavings);

        const monthlyIncomeEl = document.getElementById('monthly-income');
        const monthlyExpensesEl = document.getElementById('monthly-expenses');
        const monthlySavingsEl = document.getElementById('monthly-savings');
        const healthScoreEl = document.getElementById('health-score');

        if (monthlyIncomeEl) monthlyIncomeEl.textContent = this.formatCurrency(monthlyIncome);
        if (monthlyExpensesEl) monthlyExpensesEl.textContent = this.formatCurrency(monthlyExpenses);
        if (monthlySavingsEl) monthlySavingsEl.textContent = this.formatCurrency(monthlySavings);
        if (healthScoreEl) healthScoreEl.textContent = `${healthScore}/100`;
    }

    calculateHealthScore(income, expenses, savings) {
        if (income === 0) return 0;

        let score = 0;
        const savingsRate = savings / income;
        
        // Savings rate (50% of score)
        if (savingsRate >= 0.3) score += 50;
        else if (savingsRate >= 0.2) score += 40;
        else if (savingsRate >= 0.1) score += 25;
        else if (savingsRate >= 0) score += 10;

        // Expense control (30% of score)
        const expenseRatio = expenses / income;
        if (expenseRatio <= 0.5) score += 30;
        else if (expenseRatio <= 0.7) score += 20;
        else if (expenseRatio <= 0.9) score += 10;

        // Transaction diversity (20% of score)
        const categories = new Set(this.transactions.map(t => t.category));
        if (categories.size >= 5) score += 20;
        else if (categories.size >= 3) score += 10;

        return Math.round(Math.min(score, 100));
    }

    updateDashboardCharts() {
        setTimeout(() => {
            this.createCategoryChart();
            this.createTrendsChart();
        }, 100);
    }

    createCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.categoryChart) {
            this.charts.categoryChart.destroy();
        }

        const categoryTotals = this.getCategoryTotals();
        const expenseCategories = Object.entries(categoryTotals)
            .filter(([category, amount]) => category !== 'Income' && amount > 0)
            .sort(([,a], [,b]) => b - a);

        if (expenseCategories.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No expense data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        const labels = expenseCategories.map(([category]) => category);
        const data = expenseCategories.map(([, amount]) => amount);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

        this.charts.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
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
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createTrendsChart() {
        const canvas = document.getElementById('trendsChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.trendsChart) {
            this.charts.trendsChart.destroy();
        }

        const monthlyData = this.getMonthlyData();
        const labels = Object.keys(monthlyData).sort();
        
        if (labels.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No trend data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        const incomeData = labels.map(month => monthlyData[month].income);
        const expenseData = labels.map(month => monthlyData[month].expenses);

        this.charts.trendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.map(month => {
                    const [year, monthNum] = month.split('-');
                    return new Date(year, monthNum - 1).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
                }),
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
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    getCategoryTotals() {
        const totals = {};
        
        this.transactions.forEach(transaction => {
            const category = transaction.category;
            if (!totals[category]) {
                totals[category] = 0;
            }
            totals[category] += transaction.amount;
        });

        return totals;
    }

    getMonthlyData() {
        const monthlyData = {};
        
        this.transactions.forEach(transaction => {
            const month = transaction.date.substring(0, 7);
            
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expenses: 0 };
            }
            
            if (transaction.type === 'income') {
                monthlyData[month].income += transaction.amount;
            } else {
                monthlyData[month].expenses += transaction.amount;
            }
        });

        return monthlyData;
    }

    updateRecentTransactions() {
        const container = document.getElementById('recent-transactions-list');
        if (!container) return;

        const recentTransactions = [...this.transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (recentTransactions.length === 0) {
            container.innerHTML = '<p class="empty-message">No recent transactions</p>';
            return;
        }

        container.innerHTML = recentTransactions.map(transaction => {
            const amountClass = transaction.type === 'income' ? 'positive' : 'negative';
            const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
            
            return `
                <div class="recent-item">
                    <div class="recent-item-info">
                        <p class="recent-item-description">${transaction.description}</p>
                        <p class="recent-item-details">${this.formatDate(transaction.date)} • ${transaction.category}</p>
                    </div>
                    <div class="recent-item-amount ${amountClass}">
                        ${this.formatCurrency(amount)}
                    </div>
                </div>
            `;
        }).join('');
    }

    updateQuickInsights() {
        const insights = this.generateQuickInsights();
        const insightsList = document.getElementById('insights-list');
        
        if (!insightsList) return;
        
        if (insights.length === 0) {
            insightsList.innerHTML = '<p class="insight-item">Add some transactions to see personalized insights</p>';
        } else {
            insightsList.innerHTML = insights.map(insight => 
                `<p class="insight-item">${insight}</p>`
            ).join('');
        }
    }

    generateQuickInsights() {
        if (this.transactions.length === 0) return [];

        const insights = [];
        const categoryTotals = this.getCategoryTotals();
        const totalExpenses = Object.entries(categoryTotals)
            .filter(([cat]) => cat !== 'Income')
            .reduce((sum, [, amount]) => sum + amount, 0);

        // Top spending category
        const topExpenseCategory = Object.entries(categoryTotals)
            .filter(([cat]) => cat !== 'Income')
            .sort(([,a], [,b]) => b - a)[0];

        if (topExpenseCategory) {
            const percentage = ((topExpenseCategory[1] / totalExpenses) * 100).toFixed(1);
            insights.push(`💸 Your highest spending category is ${topExpenseCategory[0]} at ${this.formatCurrency(topExpenseCategory[1])} (${percentage}%)`);
        }

        // Current month analysis
        const currentMonth = new Date().toISOString().substr(0, 7);
        const monthlyTransactions = this.transactions.filter(t => t.date.startsWith(currentMonth));
        const monthlyIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        if (monthlyIncome > 0 && monthlyExpenses > 0) {
            const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100);
            if (savingsRate > 20) {
                insights.push(`✅ Excellent! You're saving ${savingsRate.toFixed(1)}% this month`);
            } else if (savingsRate > 0) {
                insights.push(`⚠️ You're saving ${savingsRate.toFixed(1)}% this month - aim for 20%+`);
            } else {
                insights.push(`🚨 You're overspending this month - review your expenses`);
            }
        }

        // Subscription analysis
        const subscriptions = categoryTotals['Subscriptions'] || 0;
        if (subscriptions > 2000) {
            insights.push(`📱 Review subscriptions (${this.formatCurrency(subscriptions)}) - cancel unused services`);
        }

        return insights.slice(0, 3);
    }

    filterTransactions() {
        const searchInput = document.getElementById('search-transactions');
        const categoryFilter = document.getElementById('category-filter');
        const paymentFilter = document.getElementById('payment-filter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const categoryFilterValue = categoryFilter ? categoryFilter.value : '';
        const paymentFilterValue = paymentFilter ? paymentFilter.value : '';

        this.filteredTransactions = this.transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
                                transaction.category.toLowerCase().includes(searchTerm) ||
                                transaction.amount.toString().includes(searchTerm);
            const matchesCategory = !categoryFilterValue || transaction.category === categoryFilterValue;
            const matchesPayment = !paymentFilterValue || transaction.paymentMethod === paymentFilterValue;
            
            return matchesSearch && matchesCategory && matchesPayment;
        });

        this.currentPage = 1;
    }

    populateFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const editCategorySelect = document.getElementById('edit-category');
        
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>' + 
                this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }

        if (editCategorySelect) {
            editCategorySelect.innerHTML = this.categories.map(cat => 
                `<option value="${cat}">${cat}</option>`
            ).join('');
        }
    }

    updateTransactionsTable() {
        const tbody = document.getElementById('transactions-tbody');
        if (!tbody) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageTransactions = this.filteredTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(startIndex, endIndex);

        if (pageTransactions.length === 0) {
            tbody.innerHTML = '<tr class="empty-state"><td colspan="8">No transactions found</td></tr>';
        } else {
            tbody.innerHTML = pageTransactions.map(transaction => {
                const amountClass = transaction.type === 'income' ? 'positive' : 'negative';
                const displayAmount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
                
                return `
                    <tr>
                        <td class="transaction-date">${this.formatDate(transaction.date)}</td>
                        <td>${transaction.description}</td>
                        <td>
                            <span class="category-badge">${transaction.category}</span>
                        </td>
                        <td>${transaction.paymentMethod}</td>
                        <td class="transaction-amount ${amountClass}">${this.formatCurrency(displayAmount)}</td>
                        <td>${transaction.type === 'income' ? 'Income' : 'Expense'}</td>
                        <td class="transaction-notes">${transaction.notes || '-'}</td>
                        <td class="transaction-actions">
                            <button class="btn btn--outline btn--sm edit-btn" data-id="${transaction.id}">Edit</button>
                            <button class="btn btn--outline btn--sm delete-btn" data-id="${transaction.id}">Delete</button>
                        </td>
                    </tr>
                `;
            }).join('');

            // Add event listeners for edit/delete buttons
            tbody.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.editTransaction(e.target.dataset.id);
                });
            });

            tbody.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.deleteTransaction(e.target.dataset.id);
                });
            });
        }

        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (!paginationContainer) return;

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        if (this.currentPage > 1) {
            paginationHTML += `<button class="btn btn--outline btn--sm" onclick="app.goToPage(${this.currentPage - 1})">Previous</button>`;
        }

        for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(totalPages, this.currentPage + 2); i++) {
            const activeClass = i === this.currentPage ? 'btn--primary' : 'btn--outline';
            paginationHTML += `<button class="btn ${activeClass} btn--sm" onclick="app.goToPage(${i})">${i}</button>`;
        }

        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="btn btn--outline btn--sm" onclick="app.goToPage(${this.currentPage + 1})">Next</button>`;
        }

        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.updateTransactionsTable();
    }

    editTransaction(id) {
        this.editingTransaction = this.transactions.find(t => t.id === id);
        if (this.editingTransaction) {
            const editDate = document.getElementById('edit-date');
            const editDescription = document.getElementById('edit-description');
            const editCategory = document.getElementById('edit-category');
            const editAmount = document.getElementById('edit-amount');
            const editPaymentMethod = document.getElementById('edit-payment-method');
            const editNotes = document.getElementById('edit-notes');
            
            if (editDate) editDate.value = this.editingTransaction.date;
            if (editDescription) editDescription.value = this.editingTransaction.description;
            if (editCategory) editCategory.value = this.editingTransaction.category;
            if (editAmount) editAmount.value = this.editingTransaction.amount;
            if (editPaymentMethod) editPaymentMethod.value = this.editingTransaction.paymentMethod;
            if (editNotes) editNotes.value = this.editingTransaction.notes;
            
            this.showModal('edit-transaction-modal');
        }
    }

    saveTransactionEdit() {
        if (this.editingTransaction) {
            const editDate = document.getElementById('edit-date');
            const editDescription = document.getElementById('edit-description');
            const editCategory = document.getElementById('edit-category');
            const editAmount = document.getElementById('edit-amount');
            const editPaymentMethod = document.getElementById('edit-payment-method');
            const editNotes = document.getElementById('edit-notes');
            
            if (editDate) this.editingTransaction.date = editDate.value;
            if (editDescription) this.editingTransaction.description = editDescription.value;
            if (editCategory) {
                this.editingTransaction.category = editCategory.value;
                // Update type based on category
                this.editingTransaction.type = editCategory.value === 'Income' ? 'income' : 'expense';
            }
            if (editAmount) this.editingTransaction.amount = parseFloat(editAmount.value);
            if (editPaymentMethod) this.editingTransaction.paymentMethod = editPaymentMethod.value;
            if (editNotes) this.editingTransaction.notes = editNotes.value;
            
            this.filterTransactions();
            this.updateUI();
            this.saveDataToStorage();
            this.closeModal();
            this.showNotification('Transaction updated successfully!');
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.filterTransactions();
            this.updateUI();
            this.saveDataToStorage();
            this.showNotification('Transaction deleted successfully!');
        }
    }

    updateAnalyticsCharts() {
        // Create analytics charts with delay
        setTimeout(() => {
            this.createIncomeExpenseChart();
            this.createBalanceChart();
            this.createTopCategoriesChart();
            this.createMonthlyChart();
            this.createSpendingPatternsChart();
            this.createPaymentMethodChart();
        }, 100);
    }

    createIncomeExpenseChart() {
        const canvas = document.getElementById('incomeExpenseChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.incomeExpenseChart) {
            this.charts.incomeExpenseChart.destroy();
        }

        const categoryTotals = this.getCategoryTotals();
        const totalIncome = categoryTotals['Income'] || 0;
        const totalExpenses = Object.entries(categoryTotals)
            .filter(([cat]) => cat !== 'Income')
            .reduce((sum, [, amount]) => sum + amount, 0);

        this.charts.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [totalIncome, totalExpenses],
                    backgroundColor: ['#1FB8CD', '#B4413C'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    createBalanceChart() {
        const canvas = document.getElementById('balanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.balanceChart) {
            this.charts.balanceChart.destroy();
        }

        const balanceData = this.calculateRunningBalance();
        
        if (balanceData.length === 0) return;
        
        const labels = balanceData.map(item => this.formatDate(item.date));
        const data = balanceData.map(item => item.balance);

        this.charts.balanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Balance',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    calculateRunningBalance() {
        const sortedTransactions = [...this.transactions]
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        let balance = 0;
        return sortedTransactions.map(transaction => {
            const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
            balance += amount;
            return {
                date: transaction.date,
                balance: balance
            };
        });
    }

    createTopCategoriesChart() {
        const canvas = document.getElementById('topCategoriesChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.topCategoriesChart) {
            this.charts.topCategoriesChart.destroy();
        }

        const categoryTotals = this.getCategoryTotals();
        const topCategories = Object.entries(categoryTotals)
            .filter(([cat]) => cat !== 'Income')
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);

        if (topCategories.length === 0) return;

        const labels = topCategories.map(([category]) => category);
        const data = topCategories.map(([, amount]) => amount);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'];

        this.charts.topCategoriesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    createMonthlyChart() {
        const canvas = document.getElementById('monthlyChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.monthlyChart) {
            this.charts.monthlyChart.destroy();
        }

        const monthlyData = this.getMonthlyData();
        const labels = Object.keys(monthlyData).sort();
        
        if (labels.length === 0) return;
        
        const savingsData = labels.map(month => monthlyData[month].income - monthlyData[month].expenses);

        this.charts.monthlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(month => {
                    const [year, monthNum] = month.split('-');
                    return new Date(year, monthNum - 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
                }),
                datasets: [{
                    label: 'Monthly Savings',
                    data: savingsData,
                    backgroundColor: savingsData.map(value => value >= 0 ? '#1FB8CD' : '#B4413C'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    createSpendingPatternsChart() {
        const canvas = document.getElementById('spendingPatternsChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.spendingPatternsChart) {
            this.charts.spendingPatternsChart.destroy();
        }

        const dayOfWeekData = {};
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        this.transactions.filter(t => t.type === 'expense').forEach(transaction => {
            const dayOfWeek = new Date(transaction.date).getDay();
            const dayName = dayNames[dayOfWeek];
            
            if (!dayOfWeekData[dayName]) {
                dayOfWeekData[dayName] = 0;
            }
            dayOfWeekData[dayName] += transaction.amount;
        });

        const labels = dayNames;
        const data = labels.map(day => dayOfWeekData[day] || 0);

        this.charts.spendingPatternsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Spending Pattern',
                    data: data,
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    createPaymentMethodChart() {
        const canvas = document.getElementById('paymentMethodChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.paymentMethodChart) {
            this.charts.paymentMethodChart.destroy();
        }

        const paymentMethodTotals = {};
        this.transactions.forEach(transaction => {
            if (!paymentMethodTotals[transaction.paymentMethod]) {
                paymentMethodTotals[transaction.paymentMethod] = 0;
            }
            paymentMethodTotals[transaction.paymentMethod] += transaction.amount;
        });

        const labels = Object.keys(paymentMethodTotals);
        const data = Object.values(paymentMethodTotals);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];

        if (labels.length === 0) return;

        this.charts.paymentMethodChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
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
                                return `${context.label}: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateExportStats() {
        const totalCount = document.getElementById('total-transactions-count');
        const dateRange = document.getElementById('date-range');
        const categoriesCount = document.getElementById('categories-count');

        if (totalCount) totalCount.textContent = this.transactions.length;
        
        if (dateRange && this.transactions.length > 0) {
            const dates = this.transactions.map(t => new Date(t.date)).sort((a, b) => a - b);
            const startDate = dates[0].toLocaleDateString('en-IN');
            const endDate = dates[dates.length - 1].toLocaleDateString('en-IN');
            dateRange.textContent = `${startDate} - ${endDate}`;
        } else if (dateRange) {
            dateRange.textContent = 'No data';
        }

        if (categoriesCount) {
            const uniqueCategories = new Set(this.transactions.map(t => t.category));
            categoriesCount.textContent = uniqueCategories.size;
        }
    }

    exportPDF() {
        if (!window.jsPDF) {
            alert('PDF export feature requires jsPDF library');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Personal Finance Report', 20, 20);

        // Date
        doc.setFontSize(12);
        doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 20, 30);

        // Summary
        const categoryTotals = this.getCategoryTotals();
        const totalIncome = categoryTotals['Income'] || 0;
        const totalExpenses = Object.entries(categoryTotals)
            .filter(([cat]) => cat !== 'Income')
            .reduce((sum, [, amount]) => sum + amount, 0);
        const netSavings = totalIncome - totalExpenses;

        doc.text('Financial Summary:', 20, 50);
        doc.text(`Total Income: ${this.formatCurrency(totalIncome)}`, 20, 60);
        doc.text(`Total Expenses: ${this.formatCurrency(totalExpenses)}`, 20, 70);
        doc.text(`Net Savings: ${this.formatCurrency(netSavings)}`, 20, 80);

        // Top categories
        doc.text('Top Expense Categories:', 20, 100);
        const topCategories = Object.entries(categoryTotals)
            .filter(([cat]) => cat !== 'Income')
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        let yPosition = 110;
        topCategories.forEach(([category, amount]) => {
            doc.text(`• ${category}: ${this.formatCurrency(amount)}`, 25, yPosition);
            yPosition += 10;
        });

        doc.save('financial-report.pdf');
        this.showNotification('PDF report downloaded successfully!');
    }

    exportCSV() {
        const csvContent = this.convertToCSV(this.transactions);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'transactions.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        this.showNotification('CSV file downloaded successfully!');
    }

    convertToCSV(transactions) {
        const headers = ['Date', 'Description', 'Category', 'Amount (INR)', 'Type', 'Payment Method', 'Notes'];
        const csvRows = [headers.join(',')];

        transactions.forEach(transaction => {
            const row = [
                transaction.date,
                `"${transaction.description}"`,
                transaction.category,
                transaction.amount,
                transaction.type,
                transaction.paymentMethod,
                `"${transaction.notes || ''}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    exportCharts() {
        this.showNotification('Chart export feature will be available soon!');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('hidden');
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        this.editingTransaction = null;
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.classList.remove('hidden');
            
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.add('hidden');
        }
    }

    saveDataToStorage() {
        try {
            localStorage.setItem('financeTracker_transactions', JSON.stringify(this.transactions));
        } catch (error) {
            console.warn('Could not save data to localStorage:', error);
        }
    }

    loadDataFromStorage() {
        try {
            const saved = localStorage.getItem('financeTracker_transactions');
            if (saved) {
                this.transactions = JSON.parse(saved);
                this.filterTransactions();
            }
        } catch (error) {
            console.warn('Could not load data from localStorage:', error);
        }

        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-color-scheme', savedTheme);
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
            }
        }
    }
}

// Initialize the application
const app = new FinanceTracker();

// Global functions for pagination (called from generated HTML)
window.app = app;
