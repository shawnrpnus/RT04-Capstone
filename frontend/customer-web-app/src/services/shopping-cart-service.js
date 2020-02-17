export const getCartTotal = cartItems => {
    let total = 0;
    for(let i=0; i<cartItems.length; i++){
        total += parseInt(cartItems[i].qty, 10)*parseInt((cartItems[i].price*cartItems[i].discount/100), 10);
    }
    return total;
};
