const form = document.getElementById('checkoutForm');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let valid = true;
  const inputs = form.querySelectorAll('input[required]');

  inputs.forEach(input => {
    const errorMsg = input.parentElement.querySelector('.error-msg') || input.nextElementSibling;

    input.classList.remove('error');
    if (errorMsg) errorMsg.textContent = '';

    if (!input.checkValidity()) {
      valid = false;
      input.classList.add('error');

      if (errorMsg) {
        if (input.type === 'email') {
          errorMsg.textContent = 'Ingresa un correo válido';
        } else if (input.type === 'tel') {
          errorMsg.textContent = 'Ingresa un teléfono válido';
        } else if (input.type === 'checkbox') {
          errorMsg.textContent = 'Debes aceptar este campo';
        } else {
          errorMsg.textContent = 'Este campo es obligatorio';
        }
      }
    }
  });

  if (valid) {
    alert('Compra finalizada. ¡Gracias!');
  }
});

const discountInput = document.getElementById('discountCode');
const discountBtn = document.getElementById('applyDiscountBtn');
const discountMsg = document.getElementById('discountMsg');
const subtotalEl = document.querySelector('.totals span');
const totalEl = document.querySelector('.total span');

let subtotal = 529900;

discountBtn.addEventListener('click', () => {
  const code = discountInput.value.trim().toUpperCase();
  discountInput.classList.remove('error');
  discountMsg.textContent = '';
  
  if (code === '') {
    discountInput.classList.add('error');
    discountMsg.textContent = 'Ingresa un código';
    return;
  }

  if (code === 'DESCUENTO25') {
    const total = subtotal * 0.6;
    totalEl.textContent = `$${Math.floor(total)}`;
    discountMsg.textContent = 'Descuento aplicado ✔️';
    discountMsg.style.color = 'green';
  } else {
    discountInput.classList.add('error');
    discountMsg.textContent = 'Código inválido';
    discountMsg.style.color = '#d10000';
  }
});