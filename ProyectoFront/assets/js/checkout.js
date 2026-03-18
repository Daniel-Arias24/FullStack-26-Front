const applyBtn = document.getElementById('applyDiscountBtn');
  const discountInput = document.getElementById('discountCode');
  const subtotal = 529900;
  let currentTotal = subtotal;

  function formatCurrency(value) {
    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  applyBtn.addEventListener('click', () => {
    const code = discountInput.value.trim().toLowerCase();
    if (!code) {
      alert('Por favor ingresa un código de descuento.');
      return;
    }

    // Ejemplo simple de descuento
    if (code === 'descuento10') {
      currentTotal = Math.round(subtotal * 0.9);
      alert('Código aplicado: 10% de descuento');
    } else if (code === 'descuento20') {
      currentTotal = Math.round(subtotal * 0.8);
      alert('Código aplicado: 20% de descuento');
    } else {
      alert('Código de descuento inválido.');
      currentTotal = subtotal;
    }

    // Actualizar totales en pantalla
    document.querySelector('.totals p span').textContent = formatCurrency(currentTotal);
    document.querySelector('.totals p.total span').textContent = formatCurrency(currentTotal);
  });

  // Validación básica del formulario antes de enviar
  document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    if (!e.target.checkValidity()) {
      e.preventDefault();
      alert('Por favor, completa todos los campos correctamente.');
      return false;
    }
    alert('Compra finalizada. ¡Gracias!');
  });