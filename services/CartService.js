const createError = require('http-errors');
const CartModel = require('../models/cart');
const CartItemModel = require('../models/cartItem');

module.exports = class CartService {

  async create(data) {
    const { user_id } = data;

    try {

      // Instantiate new cart and save
      const Cart = new CartModel();
      const cart = await Cart.create(user_id);

      return cart;

    } catch(err) {
      throw err;
    }

  };

  async loadCart(user_id) {
    try {
      // Load user cart based on ID
      const cart = await CartModel.findOneByUser(user_id);

      // Load cart items and add them to the cart record
      const items = await CartItemModel.find(cart.id);
      cart.items = items;

      return cart;

    } catch(err) {
      throw err;
    }
  }

  async addItem(user_id, item) {
    try {
      // Load user cart based on ID
      const cart = await CartModel.findOneByUser(user_id);

      // Create cart item
      const cartItem = await CartItemModel.create({ cartId: cart.id, ...item });

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async removeItem(cartItemId) {
    try {
      // Remove cart item by line ID
      const cartItem = await CartItemModel.delete(cartItemId);

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async updateItem(cartItemId, data) {
    try {
      // Remove cart item by line ID
      const cartItem = await CartItemModel.update(cartItemId, data);

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async checkout(cartId, userId, paymentInfo) {
    try {

      // Load cart items
      const cartItems = await CartItemModel.find(cartId);

      // Generate total price from cart items
      const total = cartItems.reduce((total, item) => {
        return total += Number(item.price);
      }, 0);

      // Generate initial order
      const Order = new OrderModel({ total, userId });
      Order.addItems(cartItems);
      await Order.create();

      return Order;

    } catch(err) {
      throw err;
    }
  }

}