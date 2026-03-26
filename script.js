
 function renderCharts(salesByDate, dishRevenue) {

    if (salesChart) salesChart.destroy();
    if (dishChart) dishChart.destroy();
    if (pieChart) pieChart.destroy();

    // ✅ Sales Trend (Line Chart)
    salesChart = new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
            labels: Object.keys(salesByDate),
            datasets: [{
                label: "Sales",
                data: Object.values(salesByDate),
                borderColor: "maroon",
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return "₹" + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: "Revenue (₹)"
                    }
                }
            }
        }
    });

    // ✅ Dish Performance (Bar Chart)
    dishChart = new Chart(document.getElementById('dishChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(dishRevenue),
            datasets: [{
                label: "Dish Revenue",
                data: Object.values(dishRevenue),
                backgroundColor: "maroon"
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return "₹" + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: "Revenue (₹)"
                    }
                }
            }
        }
    });

    // ✅ Pie Chart (no axis needed)
    pieChart = new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(dishRevenue),
            datasets: [{
                data: Object.values(dishRevenue)
            }]
        }
    });
}