function updateQuantity(button, delta) {
    const form = button.closest('form');
    const quantityInput = form.querySelector('.quantity-input');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += delta;
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }
    quantityInput.value = currentQuantity;
    form.submit();
}
