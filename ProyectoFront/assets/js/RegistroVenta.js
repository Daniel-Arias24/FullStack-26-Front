// ============================================================
//  RegistroVenta.js  —  Panel Admin ESPRIT
//
//  Se conecta al microservicio Python (FastAPI) en puerto 8000.
//
//  ENDPOINTS QUE CONSUME:
//  ┌──────────────────────────────────────────────────────────┐
//  │ POST   http://localhost:8000/api/ventas   → guardar venta│
//  │   Body: { vendedor, fecha, local, producto, canal, costo}│
//  │                                                          │
//  │ GET    http://localhost:8000/api/stats/dashboard         │
//  │   → { ventas_mensuales, productos, vendedores, ingresos, │
//  │       total_ventas, total_ingresos }                     │
//  │                                                          │
//  │ GET    http://localhost:8000/api/stats/resumen           │
//  │   → { total_ventas, total_ingresos, promedio_venta,      │
//  │       venta_mas_alta, venta_mas_baja, ... }              │
//  │                                                          │
//  │ GET    http://localhost:8000/api/ventas                  │
//  │   → lista completa de ventas (tabla)                     │
//  └──────────────────────────────────────────────────────────┘
// ============================================================

const API_PYTHON = "http://localhost:8000";

// ── Colores del tema ESPRIT ───────────────────────────────────
const COLORES = ["#ddcbcb", "rgb(233,33,33)", "#750a0a", "#440404"];

const CHART_OPTIONS_BASE = {
  responsive: true,
  plugins: { legend: { labels: { color: "white" } } },
  scales: {
    x: { ticks: { color: "white" } },
    y: { ticks: { color: "white" } }
  }
};

// ────────────────────────────────────────────────────────────
//  INSTANCIAS DE CHART.JS
// ────────────────────────────────────────────────────────────
let chartVentas, chartProductos, chartVendedores, chartIngresos;

// ── Datos de placeholder (se muestran mientras carga) ────────
const PLACEHOLDER = {
  ventas_mensuales: { labels: ["Ene","Feb","Mar","Abr","May","Jun"], data: [0,0,0,0,0,0] },
  productos:        { labels: ["Chaqueta","Jeans","Camiseta","Vestidos"], data: [0,0,0,0] },
  vendedores:       { labels: ["Samuel","Daniel","Brahian","Juan David"], data: [0,0,0,0] },
  ingresos:         { labels: ["Online","Tienda física"], data: [0,0] }
};

function initCharts(stats) {
  const d = stats || PLACEHOLDER;

  // Destruir si ya existen (para actualizaciones)
  [chartVentas, chartProductos, chartVendedores, chartIngresos].forEach(c => { if (c) c.destroy(); });

  // ── Gráfica 1: Ventas mensuales (línea) ──────────────────
  chartVentas = new Chart(document.getElementById("ventasChart"), {
    type: "line",
    data: {
      labels: d.ventas_mensuales.labels,
      datasets: [{
        label: "Ventas",
        data:  d.ventas_mensuales.data,
        borderColor: "#440404",
        backgroundColor: "rgba(221,203,203,0.35)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointRadius: 4
      }]
    },
    options: { ...CHART_OPTIONS_BASE, responsive: true }
  });

  // ── Gráfica 2: Productos vendidos (barras) ───────────────
  chartProductos = new Chart(document.getElementById("productosChart"), {
    type: "bar",
    data: {
      labels: d.productos.labels,
      datasets: [{
        label: "Cantidad",
        data:  d.productos.data,
        backgroundColor: COLORES
      }]
    },
    options: { ...CHART_OPTIONS_BASE, responsive: true }
  });

  // ── Gráfica 3: Vendedores (dona) ─────────────────────────
  chartVendedores = new Chart(document.getElementById("vendedoresChart"), {
    type: "doughnut",
    data: {
      labels: d.vendedores.labels,
      datasets: [{ data: d.vendedores.data, backgroundColor: COLORES }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "white" } } }
    }
  });

  // ── Gráfica 4: Ingresos online vs física (pie) ───────────
  chartIngresos = new Chart(document.getElementById("ingresosChart"), {
    type: "pie",
    data: {
      labels: d.ingresos.labels,
      datasets: [{ data: d.ingresos.data, backgroundColor: ["#ddcbcb","#440404"] }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "white" } } }
    }
  });
}

// ────────────────────────────────────────────────────────────
//  CARGAR DATOS DESDE PYTHON  →  GET /api/stats/dashboard
// ────────────────────────────────────────────────────────────
async function cargarDashboard() {
  try {
    const [dashRes, resumenRes] = await Promise.all([
      fetch(`${API_PYTHON}/api/stats/dashboard`),
      fetch(`${API_PYTHON}/api/stats/resumen`)
    ]);

    if (!dashRes.ok) throw new Error("Error al cargar dashboard");

    const stats   = await dashRes.json();
    const resumen = resumenRes.ok ? await resumenRes.json() : null;

    // Actualizar gráficas con datos reales
    initCharts(stats);

    // Actualizar tarjetas de resumen si existen en el HTML
    if (resumen && !resumen.mensaje) {
      actualizarTarjetas(resumen);
    }

    // Cargar tabla de ventas recientes
    cargarTablaVentas();

  } catch (err) {
    console.warn("⚠️ No se pudo conectar con el análisis Python:", err.message);
    console.warn("Asegúrate de tener corriendo: uvicorn main:app --reload (puerto 8000)");
    // Mostrar gráficas con placeholder en lugar de romper la UI
    initCharts(null);
  }
}

// ── Actualizar tarjetas KPI ──────────────────────────────────
function actualizarTarjetas(resumen) {
  const totalVentasEl    = document.getElementById("kpiTotalVentas");
  const totalIngresosEl  = document.getElementById("kpiTotalIngresos");
  const promedioEl       = document.getElementById("kpiPromedio");
  const topVentaEl       = document.getElementById("kpiTopVenta");

  if (totalVentasEl)   totalVentasEl.textContent   = resumen.total_ventas;
  if (totalIngresosEl) totalIngresosEl.textContent = `$${resumen.total_ingresos.toLocaleString("es-CO")}`;
  if (promedioEl)      promedioEl.textContent      = `$${resumen.promedio_venta.toLocaleString("es-CO")}`;
  if (topVentaEl && resumen.venta_mas_alta) {
    topVentaEl.textContent = `${resumen.venta_mas_alta.producto} – $${resumen.venta_mas_alta.costo.toLocaleString("es-CO")}`;
  }
}

// ── Tabla de ventas recientes ────────────────────────────────
async function cargarTablaVentas() {
  const tbody = document.getElementById("tablaVentasBody");
  if (!tbody) return;

  try {
    const res   = await fetch(`${API_PYTHON}/api/ventas`);
    const lista = await res.json();

    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#aaa;">Sin ventas registradas aún</td></tr>`;
      return;
    }

    // Mostrar las últimas 10 ventas
    tbody.innerHTML = lista.slice(0, 10).map(v => `
      <tr>
        <td>${v.vendedor}</td>
        <td>${v.fecha}</td>
        <td>${v.producto}</td>
        <td>${v.canal}</td>
        <td>$${parseFloat(v.costo).toLocaleString("es-CO")}</td>
        <td>
          <button class="btn-eliminar" data-id="${v.id}" title="Eliminar venta">
            🗑
          </button>
        </td>
      </tr>
    `).join("");

    // Bindear botones de eliminar
    tbody.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", async function () {
        const id = this.dataset.id;
        if (!confirm(`¿Eliminar la venta #${id}?`)) return;
        await eliminarVenta(id);
      });
    });

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:red;">Error cargando ventas</td></tr>`;
  }
}

// ── Eliminar venta  →  DELETE /api/ventas/{id} ───────────────
async function eliminarVenta(id) {
  try {
    const res = await fetch(`${API_PYTHON}/api/ventas/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      showToast(`🗑 Venta #${id} eliminada`, "warning");
      await cargarDashboard(); // refrescar todo
    } else {
      showToast("Error al eliminar la venta", "error");
    }
  } catch (err) {
    showToast("No se pudo conectar con el servidor", "error");
  }
}

// ────────────────────────────────────────────────────────────
//  FORMULARIO  →  POST /api/ventas
//
//  Body que espera Python:
//  { vendedor, fecha, local, producto, canal, costo }
// ────────────────────────────────────────────────────────────
function bindForm() {
  // Asignar IDs a los elementos del formulario (no modifica el HTML)
  const allSelects  = document.querySelectorAll("select.form-select");
  const vendedorSel = allSelects[0];
  const productoSel = allSelects[1];
  const canalSel    = document.getElementById("canalVenta");
  const fechaInput  = document.querySelector('input[type="date"]');
  const costoInput  = document.querySelector('input[type="number"]');
  const btnGuardar  = document.querySelector(".boton-guardar");

  if (!btnGuardar) return;

  btnGuardar.addEventListener("click", async function (e) {
    e.preventDefault();

    const vendedor = vendedorSel ? vendedorSel.value : "";
    const fecha    = fechaInput  ? fechaInput.value  : "";
    const producto = productoSel ? productoSel.value : "";
    const canal    = canalSel    ? canalSel.value    : "fisica";
    const costo    = costoInput  ? parseFloat(costoInput.value) : 0;

    // ── Validación en el front ───────────────────────────────
    if (!vendedor || vendedor === "Selecciona un vendedor") {
      showToast("⚠️ Selecciona un vendedor.", "warning"); return;
    }
    if (!fecha) {
      showToast("⚠️ Selecciona una fecha.", "warning"); return;
    }
    if (!producto || producto === "Selecciona un producto") {
      showToast("⚠️ Selecciona un producto.", "warning"); return;
    }
    if (!canal || canal === "Selecciona el canal") {
      showToast("⚠️ Selecciona el canal de venta.", "warning"); return;
    }
    if (!costo || costo <= 0) {
      showToast("⚠️ Ingresa un costo mayor a 0.", "warning"); return;
    }

    const venta = { vendedor, fecha, local: "", producto, canal, costo };

    // ── Llamada a Python  →  POST /api/ventas ────────────────
    try {
      btnGuardar.disabled    = true;
      btnGuardar.textContent = "Guardando...";

      const res  = await fetch(`${API_PYTHON}/api/ventas`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(venta)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const guardada = await res.json();

      showToast(`✅ Venta registrada — ${guardada.producto} por $${guardada.costo.toLocaleString("es-CO")}`, "success");

      // Resetear formulario
      if (vendedorSel) vendedorSel.selectedIndex = 0;
      if (productoSel) productoSel.selectedIndex = 0;
      if (canalSel)    canalSel.selectedIndex    = 0;
      if (fechaInput)  fechaInput.value           = "";
      if (costoInput)  costoInput.value           = "";

      // Refrescar gráficas y tabla con los nuevos datos
      await cargarDashboard();

    } catch (err) {
      console.error("Error al guardar venta:", err);
      showToast("❌ No se pudo guardar. ¿Está corriendo el servidor Python?", "error");
    } finally {
      btnGuardar.disabled    = false;
      btnGuardar.textContent = "Registrar venta";
    }
  });
}

// ────────────────────────────────────────────────────────────
//  INYECTAR TARJETAS KPI Y TABLA EN EL HTML
//  (se insertan dinámicamente para no tocar el HTML existente)
// ────────────────────────────────────────────────────────────
function inyectarUIExtra() {
  const dashboardContent = document.querySelector(".dashboard-content");
  if (!dashboardContent) return;

  // ── Tarjetas KPI ─────────────────────────────────────────
  const kpiHTML = `
    <div id="kpi-row" style="
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    ">
      ${[
        { id: "kpiTotalVentas",   label: "Total ventas",    icon: "🛒" },
        { id: "kpiTotalIngresos", label: "Ingresos totales",icon: "💰" },
        { id: "kpiPromedio",      label: "Promedio/venta",  icon: "📊" },
        { id: "kpiTopVenta",      label: "Venta más alta",  icon: "🏆" }
      ].map(k => `
        <div style="
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 14px 16px;
          color: white;
        ">
          <div style="font-size:22px; margin-bottom:4px;">${k.icon}</div>
          <div style="font-size:11px; color:#aaa; text-transform:uppercase; letter-spacing:.5px;">${k.label}</div>
          <div id="${k.id}" style="font-size:18px; font-weight:700; margin-top:4px;">—</div>
        </div>
      `).join("")}
    </div>
  `;

  // ── Tabla de ventas recientes ────────────────────────────
  const tablaHTML = `
    <div id="tabla-ventas-card" style="
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 16px;
      margin-top: 20px;
      color: white;
    ">
      <h3 style="font-size:14px; margin-bottom:12px; color:#ddcbcb;">
        📋 Ventas recientes (últimas 10)
      </h3>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.15);">
              <th style="padding:8px; text-align:left; color:#aaa;">Vendedor</th>
              <th style="padding:8px; text-align:left; color:#aaa;">Fecha</th>
              <th style="padding:8px; text-align:left; color:#aaa;">Producto</th>
              <th style="padding:8px; text-align:left; color:#aaa;">Canal</th>
              <th style="padding:8px; text-align:left; color:#aaa;">Costo</th>
              <th style="padding:8px; text-align:left; color:#aaa;">Acción</th>
            </tr>
          </thead>
          <tbody id="tablaVentasBody">
            <tr><td colspan="6" style="padding:12px; color:#aaa; text-align:center;">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  // ── Estilos para botones de la tabla ────────────────────
  const style = document.createElement("style");
  style.textContent = `
    .btn-eliminar {
      background: transparent;
      border: 1px solid rgba(233,33,33,0.4);
      color: #e92121;
      border-radius: 6px;
      padding: 3px 8px;
      cursor: pointer;
      font-size: 13px;
      transition: background .2s;
    }
    .btn-eliminar:hover { background: rgba(233,33,33,0.15); }
    #tabla-ventas-card tr:hover td { background: rgba(255,255,255,0.04); }
    #tabla-ventas-card td { padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  `;
  document.head.appendChild(style);

  // Insertar KPIs antes de las gráficas
  dashboardContent.insertAdjacentHTML("afterbegin", kpiHTML);
  // Insertar tabla después de las gráficas
  dashboardContent.insertAdjacentHTML("beforeend", tablaHTML);
}

// ────────────────────────────────────────────────────────────
//  TOAST DE FEEDBACK
// ────────────────────────────────────────────────────────────
function showToast(msg, type = "success") {
  const existing = document.getElementById("esprit-toast");
  if (existing) existing.remove();

  const colores = {
    success: { bg: "#1a1a1a", border: "#ddcbcb" },
    warning: { bg: "#3a2800", border: "#e9a033" },
    error:   { bg: "#2a0000", border: "#e92121" }
  };
  const c = colores[type] || colores.success;

  const t = document.createElement("div");
  t.id = "esprit-toast";
  t.textContent = msg;
  t.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    background: ${c.bg}; color: #fff;
    padding: 14px 22px; border-radius: 10px;
    font-size: 14px; font-family: sans-serif;
    border-left: 4px solid ${c.border};
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    animation: slideIn .3s ease;
    max-width: 340px;
  `;

  const style = document.createElement("style");
  style.textContent = `@keyframes slideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`;
  document.head.appendChild(style);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ────────────────────────────────────────────────────────────
//  INIT
// ────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async function () {
  inyectarUIExtra();   // 1. Inyectar KPIs y tabla en el DOM
  bindForm();          // 2. Bindear eventos del formulario
  await cargarDashboard(); // 3. Cargar datos reales desde Python
});