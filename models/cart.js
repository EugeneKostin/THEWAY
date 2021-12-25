const e = require("express");

module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function(item, id) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = {item: item, quantity: 0, price: 0};
        }
        cartItem.quantity++;
        cartItem.price = cartItem.item.price * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += cartItem.item.price;
    };

    // this.remove = function(id) {
    //     this.totalItems -= this.items[id].quantity;
    //     this.totalPrice -= this.items[id].price;
    //     delete this.items[id];
    // };

    this.remove = function(id) {
        if (this.items[id]) {
            if (this.items[id].quantity > 1) {
                this.items[id].quantity--;
                this.totalItems--;
                this.items[id].price = this.items[id].item.price * this.items[id].quantity;
                this.totalPrice -= this.items[id].item.price;
                return this.items[id].quantity;
            } else {
                this.items[id].quantity--;
                this.totalItems--;
                this.items[id].price = this.items[id].item.price * this.items[id].quantity;
                this.totalPrice -= this.items[id].item.price;
                delete this.items[id];
                return 0;
            }
        } else return 0;
    };

    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};