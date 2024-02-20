const authRouter = require('./auth');
const userRouter = require('./user');
const productRouter = require('./product');
const cartRouter = require('./cart');


module.exports = (app, passport) => {
  authRouter(app, passport);
  userRouter(app);
  productRouter(app);
  cartRouter(app);
}