//routers and requests handlers
const  Router  = require( 'koa-router');
const  books = require('../../database/books');
const  convert = require('koa-convert');
const  KoaBody = require( 'koa-body');

const router = new Router(),
    koaBody = convert(KoaBody());

router
    .post('/books',koaBody, async (ctx, next) => {
        /* ui request sample
         fetch('/books',{
            headers:{'content-type':'application/json; charset=UTF8'},
            method:'POST',
            body:JSON.stringify({
               filter:{bookAnnotation:'aa'},
               sortByField:'book_title'
               })
          }).then(data=>data.json()).then(d=>console.log(d))
         */
        ctx.status = 201;
        let result = await books.getBooks(ctx.request.body);
        if (result) {
            ctx.body = result
        } else {
            ctx.status = 204
        }
    })
    .post('/create', koaBody, async (ctx, next) => {
        /*
        request from UI sample:
        fetch('/create',{
            headers:{'content-type':'application/json; charset=UTF8'},
            method:'POST',
            body:JSON.stringify({bookTitle:'book_3',
                                 bookAnnotation:'AAAA',
                                 authorId:1,
                                 genreId:1
                                })
          }).then(data=>data.json()).then(d=>console.log(`new book_id = ${d.insertId}`))
         */
        ctx.status = 201;
        ctx.body = await books.create(ctx.request.body)
    })
    .post('/update', koaBody, async (ctx, next) => {
        /*
       request from UI sample:
       fetch('/create',{
           headers:{'content-type':'application/json; charset=UTF8'},
           method:'POST',
           body:JSON.stringify({bookTitle:'book_updated',
                                bookAnnotation:'updated_annotation',
                                authorId:1,
                                genreId:1
                                })
         }).then(data=>data.json()).then(d=>console.log(`new book_id = ${d.insertId}`))
        */
        ctx.status = 201;
        ctx.body = await books.update(ctx.request.body)
    })
    .post('/delete', koaBody, async (ctx, next) => {
        /*request from UI sample
        fetch('/delete',{
            headers:{'content-type':'application/json; charset=UTF8'},
            method:'POST',
            body:JSON.stringify({bookId:12})
          }).then(data=>data.json()).then(d=>console.log(d))
         */
        ctx.status = 201;
        ctx.body = await books.remove(ctx.request.body);
    })
    .get('/generate', async (ctx, next) => {
        ctx.body = await books.generateData()
    });


module.exports.routes = ()=>{return router.routes()};
module.exports.allowedMethods = ()=>{router.allowedMethods()};