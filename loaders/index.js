const expressLoader = require('./express');
const routeLoader = require('../routes');
const passportLoader = require('./passport');


module.exports = async (app) => {

  // Load Express middlewares
  const expressApp = await expressLoader(app);

  // Load Passport middleware
  const passport = await passportLoader(expressApp);

  // Load API route handlers
  await routeLoader(app, passport);
  
  // Error Handler
  app.use((err, req, res, next) => {

    const { message, status } = err;
  
    return res.status(status).send({ message });
  });
}