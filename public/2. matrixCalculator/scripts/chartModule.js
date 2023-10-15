const chartLabels = ["Your Investment", "Bonus", "Cash Profit", "Equity Profit"];
//const dataSetLabel = "blabla"; bullshit for doughnut chart. It overrides the chart labels
let chartData = [1, 1, 1, 1];
const chartColors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'];

const chartConfig = {
  type: "doughnut",

  data: {
    labels: chartLabels,

    datasets: [{
      data: chartData,
      backgroundColor: chartColors
    }]
  },

  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  }
}

export function getNewChartData(calculation) {
  return [
    calculation.initialInvestment, calculation.bonus,
    calculation.totalCashProfit, calculation.totalEquityProfit
  ]
}

export function updateChartWithData(data, chart) {
  chart.data.datasets[0].data = data;
  chart.update();
}

export function drawChartToCanvas(canvasContext) {
  return new Chart(canvasContext, chartConfig);
} 