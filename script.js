let salesChart, dishChart, pieChart;

document.getElementById('fileInput').addEventListener('change', function(e) {
    const reader = new FileReader();

    reader.onload = function(evt) {
        processCSV(evt.target.result);
    };

    reader.readAsText(e.target.files[0]);
});

function processCSV(data) {

    
    const rows = data.split('\n').slice(1);

    console.log("Rows:", rows); 

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

    console.log("Sales:", salesByDate);
    console.log("Dishes:", dishRevenue);

    renderCharts(salesByDate, dishRevenue);
    generateInsights(salesByDate, dishRevenue, total);
}

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

function generateInsights(sales, dishes, total) {

    if (Object.keys(sales).length === 0) {
        document.getElementById('insights').innerHTML = "No valid data found!";
        return;
    }

    let bestDay = Object.keys(sales).reduce((a, b) => sales[a] > sales[b] ? a : b);
    let bestDish = Object.keys(dishes).reduce((a, b) => dishes[a] > dishes[b] ? a : b);

    let avg = Math.round(total / Object.keys(sales).length);

    let text = `
    Total Revenue: ₹${total}<br>
    Average Daily Revenue: ₹${avg}<br>
    Best Performing Day: ${bestDay}<br>
    Most Popular Dish: ${bestDish}<br><br>

    <b>Conclusion:</b><br>
    Focus more on promoting ${bestDish}.<br>
    Try to replicate strategies used on ${bestDay}.<br>
    Maintain consistent marketing.
    `;

    document.getElementById('insights').innerHTML = text;
}