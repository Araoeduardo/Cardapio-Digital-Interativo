// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Recuperar quantidades salvas no localStorage
    const quantities = JSON.parse(localStorage.getItem('quantities')) || {};
    
    // Atualizar quantidades iniciais nos inputs
    for (const [itemId, quantity] of Object.entries(quantities)) {
        const inputElement = document.getElementById(`${itemId}-quantity`);
        if (inputElement) {
            inputElement.value = quantity;
        }
    }
    
    // Atualizar o carrinho inicial
    updateCart();
});

function changeQuantity(itemId, change) {
    const inputElement = document.getElementById(`${itemId}-quantity`);
    const currentQuantity = parseInt(inputElement.value);
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 0) {
        inputElement.value = newQuantity;
        
        // Salvar quantidades no localStorage
        const quantities = JSON.parse(localStorage.getItem('quantities')) || {};
        quantities[itemId] = newQuantity;
        localStorage.setItem('quantities', JSON.stringify(quantities));
        
        // Atualizar o carrinho
        updateCart();
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const quantities = JSON.parse(localStorage.getItem('quantities')) || {};
    let cartItems = '';
    let cartTotal = 0;

    const itemsData = {
        burger1: { name: 'Hambúrguer Clássico', price: 15 },
        burger2: { name: 'Cheeseburger', price: 18 },
        burger3: { name: 'Hambúrguer de Frango', price: 17 },
        burger4: { name: 'Hambúrguer Triplo', price: 19 },
        burger5: { name: 'Double Burger', price: 22 },
        snack1: { name: 'Coxinha', price: 6 },
        snack2: { name: 'Pão de Queijo', price: 4 },
        snack3: { name: 'Kibe', price: 5 },
        snack4: { name: 'Empada de Palmito', price: 7 },
        snack5: { name: 'Pastel de Carne', price: 5 },
        drink1: { name: 'Refrigerante', price: 5 },
        drink2: { name: 'Suco Natural', price: 7 },
        drink3: { name: 'Água', price: 3 },
        drink4: { name: 'Cerveja', price: 8 },
        drink5: { name: 'Café', price: 4 }
    };

    for (const [itemId, quantity] of Object.entries(quantities)) {
        if (quantity > 0) {
            const itemData = itemsData[itemId];
            cartItems += `<li>${itemData.name} x ${quantity} - R$ ${(itemData.price * quantity).toFixed(2)}</li>`;
            cartTotal += itemData.price * quantity;
        }
    }

    cartItemsContainer.innerHTML = cartItems;
    document.getElementById('cart-total').textContent = cartTotal.toFixed(2);
}

function toggleCart() {
    const cart = document.getElementById('cart');
    if (cart.style.display === 'none' || cart.style.display === '') {
        cart.style.display = 'block';
    } else {
        cart.style.display = 'none';
    }
}

function showAdditionalInfoModal() {
    document.getElementById('additional-info-modal').style.display = 'block';
}

function viewOrder() {
    const form = document.getElementById('additional-info-form');
    const paymentMethods = Array.from(form.elements['payment-method'])
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)
        .join(', ');

    if (form.checkValidity() && paymentMethods) {
        const fullName = form.elements['full-name'].value;
        const address = form.elements['address'].value;

        const summaryHtml = `
            <p><strong>Nome Completo:</strong> ${fullName}</p>
            <p><strong>Endereço:</strong> ${address}</p>
            <p><strong>Forma de Pagamento:</strong> ${paymentMethods}</p>
            <h3>Itens do Pedido</h3>
            ${document.getElementById('cart-items').innerHTML}
            <p><strong>Total:</strong> R$ ${document.getElementById('cart-total').textContent}</p>
        `;

        document.getElementById('order-summary').innerHTML = summaryHtml;
        document.getElementById('additional-info-modal').style.display = 'none';
        document.getElementById('order-summary-modal').style.display = 'block';
    } else {
        if (!paymentMethods) {
            alert('Por favor, selecione uma forma de pagamento.');
        }
        form.reportValidity();
    }
}

function confirmOrder() {
    alert('Pedido confirmado!');
    // Zerar localStorage e atualizar o carrinho
    localStorage.removeItem('quantities');
    updateCart();
    // Fechar todos os modais e reiniciar a página
    document.getElementById('order-summary-modal').style.display = 'none';
    document.getElementById('additional-info-modal').style.display = 'none';
    location.reload();
}

function closeOrderSummary() {
    alert('Pedido cancelado!');
    // Zerar localStorage e atualizar o carrinho
    localStorage.removeItem('quantities');
    updateCart();
    // Fechar o modal de resumo do pedido
    document.getElementById('order-summary-modal').style.display = 'none';
}