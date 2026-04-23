
new Chart(
  document.getElementById("ventasChart"),
  {
    type: "line",

    data: {
      labels: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun"
      ],

      datasets: [{
        label: "Ventas",

        data: [
          120,
          190,
          300,
          250,
          420,
          500
        ],

        borderColor: "#440404",

        backgroundColor: "#ddcbcb",

        tension: 0.4,

        fill: true
      }]
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: "white"
          }
        },

        y: {
          ticks: {
            color: "white"
          }
        }
      }
    }
  }
);

new Chart(
  document.getElementById("productosChart"),
  {
    type: "bar",

    data: {
      labels: [
        "Jeans",
        "Chaquetas",
        "Vestidos",
        "Camisetas"
      ],

      datasets: [{
        label: "Cantidad",

        data: [
          50,
          35,
          20,
          60
        ],

        backgroundColor: [
          "#ddcbcb",
          "rgb(233, 33, 33)",
          "#750a0a",
          "#440404"
        ]
      }]
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: "white"
          }
        },

        y: {
          ticks: {
            color: "white"
          }
        }
      }
    }
  }
);

new Chart(
  document.getElementById("vendedoresChart"),
  {
    type: "doughnut",

    data: {
      labels: [
        "Samuel",
        "Daniel",
        "Brahian",
        "Juan David"
      ],

      datasets: [{
        data: [
          35,
          25,
          20,
          20
        ],

        backgroundColor: [
          "#ddcbcb",
          "rgb(233, 33, 33)",
          "#750a0a",
          "#440404"
        ]
      }]
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      }
    }
  }
);

new Chart(
  document.getElementById("ingresosChart"),
  {
    type: "pie",

    data: {
      labels: [
        "Online",
        "Tienda física"
      ],

      datasets: [{
        data: [
          65,
          35
        ],

        backgroundColor: [
          "#ddcbcb",
          "#440404"
        ]
      }]
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      }
    }
  }
);