// ============================================================
//  registroVenta.js  —  Formulario + Dashboard conectados
//  Los datos se guardan en localStorage (clave "ventas_esprit")
//  Cuando tengas el backend Python, reemplaza loadVentas() y
//  saveVenta() por llamadas fetch() a tu API.
// ============================================================

// ── Utilidades de persistencia ────────────────────────────────
function loadVentas() {
  const raw = localStorage.getItem("ventas_esprit");
  return raw ? JSON.parse(raw) : [];
}

function saveVenta(venta) {
  const ventas = loadVentas();
  ventas.push(venta);
  localStorage.setItem("ventas_esprit", JSON.stringify(ventas));
}

// ── Helpers para calcular datos de las gráficas ───────────────
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const PRODUCTOS_BASE = ["Chaqueta","Jeans","Camiseta","Vestidos"];
const VENDEDORES_BASE = ["Samuel Soracá","Daniel Arias","Brahian Marin","Juan David Rojas"];
const COLORES = ["#ddcbcb","rgb(233,33,33)","#750a0a","#440404"];

function calcVentasMensuales(ventas) {
  const counts = Array(12).fill(0);
  ventas.forEach(v => {
    if (v.fecha) {
      const mes = new Date(v.fecha).getMonth(); // 0-11
      counts[mes]++;
    }
  });
  // Mostrar solo meses con datos + los 6 primeros si no hay nada
  const hayDatos = counts.some(c => c > 0);
  if (!hayDatos) return { labels: MESES.slice(0,6), data: [120,190,300,250,420,500] };
  return { labels: MESES, data: counts };
}

function calcProductos(ventas) {
  const map = {};
  PRODUCTOS_BASE.forEach(p => map[p] = 0);
  ventas.forEach(v => {
    if (v.producto) map[v.producto] = (map[v.producto] || 0) + 1;
  });
  const labels = Object.keys(map);
  const data   = labels.map(l => map[l]);
  const hayDatos = data.some(d => d > 0);
  return hayDatos
    ? { labels, data }
    : { labels: ["Jeans","Chaquetas","Vestidos","Camisetas"], data: [50,35,20,60] };
}

function calcVendedores(ventas) {
  const map = {};
  VENDEDORES_BASE.forEach(v => map[v] = 0);
  ventas.forEach(v => {
    if (v.vendedor) map[v.vendedor] = (map[v.vendedor] || 0) + 1;
  });
  const labels = Object.keys(map).map(n => n.split(" ")[0]); // solo nombre
  const data   = Object.values(map);
  const hayDatos = data.some(d => d > 0);
  return hayDatos
    ? { labels, data }
    : { labels: ["Samuel","Daniel","Brahian","Juan David"], data: [35,25,20,20] };
}

function calcIngresos(ventas) {
  let online = 0, fisico = 0;
  ventas.forEach(v => {
  const monto = parseFloat(v.costo) || 0;
  if (v.canal === "online") online += monto;
  else fisico += monto;
});
  const hayDatos = online > 0 || fisico > 0;
  return hayDatos
    ? { labels: ["Online","Tienda física"], data: [online, fisico] }
    : { labels: ["Online","Tienda física"], data: [65, 35] };
}

// ── Instancias de Chart.js ────────────────────────────────────
let chartVentas, chartProductos, chartVendedores, chartIngresos;

const chartConfig = {
  scales: {
    x: { ticks: { color: "white" } },
    y: { ticks: { color: "white" } }
  },
  plugins: { legend: { labels: { color: "white" } } }
};

function initCharts() {
  const ventas = loadVentas();

  const mv = calcVentasMensuales(ventas);
  chartVentas = new Chart(document.getElementById("ventasChart"), {
    type: "line",
    data: {
      labels: mv.labels,
      datasets: [{
        label: "Ventas",
        data: mv.data,
        borderColor: "#440404",
        backgroundColor: "rgba(221,203,203,0.35)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointRadius: 4
      }]
    },
    options: { responsive: true, ...chartConfig }
  });

  const mp = calcProductos(ventas);
  chartProductos = new Chart(document.getElementById("productosChart"), {
    type: "bar",
    data: {
      labels: mp.labels,
      datasets: [{
        label: "Cantidad",
        data: mp.data,
        backgroundColor: COLORES
      }]
    },
    options: { responsive: true, ...chartConfig }
  });

  const mv2 = calcVendedores(ventas);
  chartVendedores = new Chart(document.getElementById("vendedoresChart"), {
    type: "doughnut",
    data: {
      labels: mv2.labels,
      datasets: [{ data: mv2.data, backgroundColor: COLORES }]
    },
    options: { responsive: true, plugins: { legend: { labels: { color: "white" } } } }
  });

  const mi = calcIngresos(ventas);
  chartIngresos = new Chart(document.getElementById("ingresosChart"), {
    type: "pie",
    data: {
      labels: mi.labels,
      datasets: [{ data: mi.data, backgroundColor: ["#ddcbcb","#440404"] }]
    },
    options: { responsive: true, plugins: { legend: { labels: { color: "white" } } } }
  });
}

function updateCharts() {
  const ventas = loadVentas();

  const mv = calcVentasMensuales(ventas);
  chartVentas.data.labels = mv.labels;
  chartVentas.data.datasets[0].data = mv.data;
  chartVentas.update();

  const mp = calcProductos(ventas);
  chartProductos.data.labels = mp.labels;
  chartProductos.data.datasets[0].data = mp.data;
  chartProductos.update();

  const mv2 = calcVendedores(ventas);
  chartVendedores.data.labels = mv2.labels;
  chartVendedores.data.datasets[0].data = mv2.data;
  chartVendedores.update();

  const mi = calcIngresos(ventas);
  chartIngresos.data.labels = mi.labels;
  chartIngresos.data.datasets[0].data = mi.data;
  chartIngresos.update();
}

// ── Formulario ────────────────────────────────────────────────
function bindForm() {
  // Agregar IDs al HTML del formulario si no los tienen
  const form      = document.querySelector(".formulario-ventas form");
  const canalSel = document.getElementById("canalVenta");
  const selVend   = document.querySelector('select.form-select');
  const inputs    = document.querySelectorAll('input.form-control');
  const selProd   = document.querySelectorAll('select.form-select')[1];
  const btnGuardar = document.querySelector(".boton-guardar");

  // Asignamos IDs programáticamente para no tocar el HTML
  if (form) form.id = "formVenta";

  const allSelects = document.querySelectorAll("select.form-select");
  const vendedorSel = allSelects[0];
  const productoSel = allSelects[1];
  const fechaInput  = document.querySelector('input[type="date"]');
  const localInput  = document.querySelector('input[type="text"]');
  const costoInput  = document.querySelector('input[type="number"]');

  if (btnGuardar) {
    btnGuardar.addEventListener("click", function (e) {
      e.preventDefault();

      const vendedor = vendedorSel ? vendedorSel.value : "";
      const fecha    = fechaInput  ? fechaInput.value  : "";
      const local    = localInput  ? localInput.value  : "";
      const producto = productoSel ? productoSel.value : "";
      const costo    = costoInput  ? costoInput.value  : "0";

      // Validación básica
      if (
        !vendedor || vendedor === "Selecciona un vendedor" ||
        !fecha ||
        !producto || producto === "Selecciona un producto" ||
        !costo || parseFloat(costo) <= 0
      ) {
        showToast("⚠️ Completa todos los campos antes de registrar.", "warning");
        return;
      }

      const venta = {
        vendedor,
        fecha,
        local,
        producto,
        canal: canalSel ? canalSel.value : "fisica",
        costo: parseFloat(costo),
        timestamp: Date.now()
      };

      saveVenta(venta);
      updateCharts();
      showToast(`✅ Venta registrada — ${producto} por $${parseFloat(costo).toLocaleString("es-CO")}`, "success");

      // Reset form
      if (canalSel) canalSel.selectedIndex = 0;
      if (vendedorSel) vendedorSel.selectedIndex = 0;
      if (fechaInput)  fechaInput.value = "";
      if (localInput)  localInput.value = "";
      if (productoSel) productoSel.selectedIndex = 0;
      if (costoInput)  costoInput.value = "";
    });
  }
}

// ── Toast de feedback ─────────────────────────────────────────
function showToast(msg, type = "success") {
  const existing = document.getElementById("esprit-toast");
  if (existing) existing.remove();

  const t = document.createElement("div");
  t.id = "esprit-toast";
  t.textContent = msg;
  t.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    background: ${type === "success" ? "#1a1a1a" : "#5a2a00"};
    color: #fff; padding: 14px 22px; border-radius: 10px;
    font-size: 14px; font-family: sans-serif;
    border-left: 4px solid ${type === "success" ? "#ddcbcb" : "#e9a033"};
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    animation: slideIn .3s ease;
  `;

  const style = document.createElement("style");
  style.textContent = `@keyframes slideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`;
  document.head.appendChild(style);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── Botón para limpiar datos (útil en desarrollo) ─────────────
function addResetButton() {
  const panel = document.querySelector(".formulario-ventas");
  if (!panel) return;
  const btn = document.createElement("button");
  btn.textContent = "🗑 Limpiar datos de prueba";
  btn.style.cssText = `
    margin-top: 12px; width: 100%; background: transparent;
    border: 1px solid rgba(255,255,255,0.2); color: #aaa;
    border-radius: 8px; padding: 8px; cursor: pointer; font-size: 12px;
  `;
  btn.addEventListener("click", () => {
    if (confirm("¿Eliminar todas las ventas guardadas?")) {
      localStorage.removeItem("ventas_esprit");
      updateCharts();
      showToast("🗑 Datos eliminados", "warning");
    }
  });
  panel.appendChild(btn);
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  initCharts();
  bindForm();
  addResetButton();
});