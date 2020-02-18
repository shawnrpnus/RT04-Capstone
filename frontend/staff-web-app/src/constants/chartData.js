

//reports page
export const lineChart = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
        {
            lagend: 'none',
            data: [60, 78, 60, 89, 76, 87, 47],
            borderColor: '#ff8084',
            backgroundColor:'rgba(255, 128, 132, 0.1)',
            fill: 'origin',
        }
    ]
};
export const chartOptions = {
    maintainAspectRatio: false,
    height: 45,
    width: 500,
    animation: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            },
            display: false
        }],
        yAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            },
            display: false
        }]
    }
}

export const areaChart = {
    labels: ["2013", "2014", "2015", "2016"],
        datasets : [
            {
                label:'Expenses',
                data: [400,550,1120,540],
                borderColor: '#7d9299',
                backgroundColor:'rgba(211,216,219,0.5)',
                fill: 'origin',
                lineTension: 0,
            },
            {
                label:'Sales',
                data: [1000, 1170, 660, 1030],
                borderColor: '#ff8084',
                backgroundColor:'rgba(255, 128, 132, 0.1)',
                fill: 'origin',
                lineTension: 0,
            },
            
        ]
  }

export const areaOptions = {
    maintainAspectRatio: false,
    title: {
        display: true,
        text: 'Company Performance',
        position: 'top'
    },
    legend: {
        display: true,
        label: {
            fontColor: 'rgb(9,9,9)',
            position: 'right'
        }
    },
    animation: false,
}

export const barChart = {
    labels: ['100', '200', '300', '400', '500', '600', '700', '800'],
    datasets: [
        {
            lagend:'none',
            data:[2.5, 3, 3, 0.9, 1.3, 1.8, 3.8, 1.5],
            borderColor: "#ff8084",
            backgroundColor: "#ff8084",
            borderWidth: 2
        },
        {
            lagend:'none',
            data:[3.8, 1.8, 4.3, 2.3, 3.6, 2.8, 2.8, 2.8],
            borderColor: "#a5a5a5",
            backgroundColor: "#a5a5a5",
            borderWidth: 2
        }
    ]
}

export const barOptions = {
    maintainAspectRatio: false,
    animation: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            barPercentage: 0.7,
            categoryPercentage: 0.4
        }],
        yAxes: [{
            barPercentage: 0.7,
            categoryPercentage: 0.4
        }]
    },
}

export const sellData = {
    labels: ["", "10", "20", "30", "40", "50", "60", "70", "80"],
    datasets: [{
        backgroundColor: "transparent",
        borderColor: "#ff8084",
        data: [20, 40, 20, 50, 20, 60, 10, 40, 20],
        lineTension: 0,
    }, {
        backgroundColor: "transparent",
        borderColor: "#a5a5a5",
        data: [60, 10, 40, 30, 80, 30, 20, 90, 0],
        lineTension: 0,
    }]
}
export const sellOption = {
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
}

export const salesData ={
    labels: ["", "10", "20", "30", "40", "50"],
    datasets: [{
        backgroundColor: "transparent",
        borderColor: "#01cccd",
        data: [10, 50, 0, 80, 10, 70],
    },
    {
        backgroundColor: "transparent",
        borderColor: "#ff7f83",
        data: [20, 40, 15, 70, 30, 27],
    },
    {
        backgroundColor: "transparent",
        borderColor: "#a5a5a5",
        data: [5, 30, 20, 40, 50, 20],
    }]
}

export const salesOption ={
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            gridLines: {
                color: '#f8f8f8'
            },
        }],
        yAxes: [{
            gridLines: {
                color: '#f8f8f8'
            },

        }]
    },
}

//dashboard page

export const doughnutData = {
    labels: ['Saint Lucia', 'Kenya', 'Liberia'],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: ['#ff8084', '#13c9ca', '#a5a5a5']
        }

    ]
}

export const doughnutOption = {
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
}

export const pieData = {
    labels: ['Saint Lucia', 'Kenya', 'Liberia', 'Caneda'],
    datasets: [
        {
            data: [120, 200, 200, 150],
            backgroundColor: ['#ff8084', '#13c9ca', '#f0b54d', '#a5a5a5']
        }
    ]

}

export const pieOptions = {
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
}

export const lineData = {
    labels: ['100', '200', '300', '400', '500', '600', '700', '800'],
    datasets: [
        {
            lagend: 'none',
            data: [2.5, 3, 3, 0.9, 1.3, 1.8, 3.8, 1.5],
            borderColor: "#ff8084",
            backgroundColor: "#ff8084",
            borderWidth: 2
        },
        {
            lagend: 'none',
            data: [3.8, 1.8, 4.3, 2.3, 3.6, 2.8, 2.8, 2.8],
            borderColor: "#a5a5a5",
            backgroundColor: "#a5a5a5",
            borderWidth: 2
        }
    ]
};
export const lineOptions = {

    maintainAspectRatio: false,
    animation: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            barPercentage: 0.7,
            categoryPercentage: 0.4,
            gridLines: {
                display: false,
            },
        }],
        yAxes: [{
            barPercentage: 0.7,
            categoryPercentage: 0.4

        }]
    },
}

export const buyData = {
    labels: ["", "10", "20", "30", "40", "50"],
    datasets: [{
        backgroundColor: "transparent",
        borderColor: "#13c9ca",
        data: [20, 5, 80, 10, 100, 15],
    },
    {
        backgroundColor: "transparent",
        borderColor: "#a5a5a5",
        data: [0, 50, 20, 70, 30, 27],
    },
    {
        backgroundColor: "transparent",
        borderColor: "#ff8084",
        data: [0, 30, 40, 10, 86, 40],
    }]
}
export const buyOption = {
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            gridLines: {
                color: '#f8f8f8'
            },
        }],
        yAxes: [{
            gridLines: {
                color: '#f8f8f8'
            },

        }]
    },
}

export const employeeData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
        {
            lagend: 'none',
            data: [60, 78, 60, 89, 76, 87, 47],
            borderColor: '#ff8084',
            backgroundColor: 'rgba(255, 128, 132, 0.1)',
            fill: 'origin',
        }
    ]
};
export const employeeOptions = {
    maintainAspectRatio: false,
    height: 45,
    width: 500,
    animation: false,
    legend: {
        display: false,
    },
  }
