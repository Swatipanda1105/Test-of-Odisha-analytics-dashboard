
    
let salesChart, dishChart, pieChart;

// ✅ FILE UPLOAD HANDLER
document.getElementById('fileInput').addEventListener('change', function(e) {

    const file = e.target.files[0];

    if (!file) return;

    // ✅ Only allow CSV
    if (!file.name.endsWith(".csv")) {
        alert("Please upload a valid CSV file!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(evt) {
        processCSV(evt.target.result);
    };

    reader.readAsText(file);
});


// ✅ CSV PROCESSING
function processCSV(data) {

    const rows = data.split(/\r?\n/).slice(1);

    let salesByDate = {};
    let dishRevenue = {};
    let total = 0;

    rows.forEach(r => {

        if (!r.trim()) return;

        const parts = r.split(/[,;]+/).map(x => x.trim());

        if (parts.length < 3) return;

        const date = parts[0];
        const dish = parts[1];
        const val = parseInt(parts[2]);

        if (!date || !dish || isNaN(val)) return;

        total += val;

        salesByDate[date] = (salesByDate[date] || 0) + val;
        dishRevenue[dish] = (dishRevenue[dish] || 0) + val;
    });

    if (total === 0) {
        document.getElementById('insights').innerHTML = "⚠️ No valid data found in CSV!";
        return;
    }

    renderCharts(salesByDate, dishRevenue);
    generateInsights(salesByDate, dishRevenue, total);
}


// ✅ CHARTS
function renderCharts(salesByDate, dishRevenue) {

    if (salesChart) salesChart.destroy();
    if (dishChart) dishChart.destroy();
    if (pieChart) pieChart.destroy();

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
        }
    });

    dishChart = new Chart(document.getElementById('dishChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(dishRevenue),
            datasets: [{
                label: "Dish Revenue",
                data: Object.values(dishRevenue),
                backgroundColor: "maroon"
            }]
        }
    });

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


// ✅ INSIGHTS
function generateInsights(sales, dishes, total) {

    let bestDay = Object.keys(sales).reduce((a, b) => sales[a] > sales[b] ? a : b);
    let bestDish = Object.keys(dishes).reduce((a, b) => dishes[a] > dishes[b] ? a : b);

    let avg = Math.round(total / Object.keys(sales).length);

    let text = `
    <b>📊 Insights</b><br><br>
    Total Revenue: ₹${total}<br>
    Average Daily Revenue: ₹${avg}<br>
    Best Performing Day: ${bestDay}<br>
    Most Popular Dish: ${bestDish}<br><br>

    <b>💡 Suggestions:</b><br>
    Promote <b>${bestDish}</b> more.<br>
    Analyze strategies used on <b>${bestDay}</b>.<br>
    Maintain consistent marketing.
    `;

    document.getElementById('insights').innerHTML = text;
}


