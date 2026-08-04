/* FinSense AI Chart.js Visualizations */

function initUserDashboardCharts(data) {
    if (typeof Chart === 'undefined') return;

    // 1. Income vs Expense vs Debt Doughnut Chart
    const ctxDoughnut = document.getElementById('incomeExpenseChart');
    if (ctxDoughnut) {
        new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: ['Annual Income', 'Monthly Expenses (x12)', 'Savings', 'Existing Debt'],
                datasets: [{
                    data: [data.income, data.expenses * 12, data.savings, data.debt],
                    backgroundColor: ['#10b981', '#f43f5e', '#06b6d4', '#f59e0b'],
                    borderWidth: 2,
                    borderColor: '#0b1736'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } }
                    }
                }
            }
        });
    }

    // 2. Risk Metrics Radar Chart
    const ctxRadar = document.getElementById('riskMetricsChart');
    if (ctxRadar) {
        new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['Credit Score', 'Debt Ratio', 'Land Assets', 'Rainfall Risk', 'Econ Security'],
                datasets: [{
                    label: 'Financial Score Index',
                    data: [data.credit_score_norm, data.debt_health, data.land_health, data.rain_health, data.econ_health],
                    backgroundColor: 'rgba(99, 102, 241, 0.25)',
                    borderColor: '#6366f1',
                    pointBackgroundColor: '#06b6d4',
                    pointBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#94a3b8', font: { size: 11 } },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                }
            }
        });
    }
}
