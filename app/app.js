const Koa  = require('koa2');
const err = require( '../middleware/error');
const middleware = require('../middleware/routes/routes');
const routes = middleware.routes;
//const allowedMethods = middleware.allowedMethods;

const app = new Koa();

app.use(err);
app.use(routes());
//app.use(allowedMethods());

app.listen(3000, function () {
    console.log('%s listening at port %d', 'Books', 3000);
});