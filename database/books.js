const mariadb  = require('mariadb');
const config   = require('../config/config');
const pool = mariadb.createPool({
    host: config.host,
    user:config.user,
    password: config.password,
    connectionLimit: 5
});
let connection = {}; //connection handler
let booksCache = []; //cache lives here
let needRefreshCache = true; //flag for refresh
pool.getConnection()
    .then(conn => {
         conn.query(`SELECT * from ${config.schema}.authors`)
            .then((rows) => {
                connection = conn;
                return connection;

            })
            .catch(err => {
                //handle error
                console.log(err);
                conn.end();
            })

    }).catch(err => {
    //not connected
});
const requestBooks  = async()=>{
    let sql = `SELECT b.*,a.author_name,a.author_lname,a.author_notes, g.genre_desc 
                FROM ${config.schema}.books b
                JOIN ${config.schema}.authors a
                ON  b.author_id = a.id
                JOIN ${config.schema}.genre g
                ON b.genre_id = g.genre_id
                WHERE 1=1`;

    return await connection.query(sql);//,parArray);
};
//returs list of books according to filter  and sorts by field(field name should be the same as in database)
const  getBooks= async (params)=>{
    let result = [];
    if (booksCache.length===0 || needRefreshCache) {
        console.log('requesting db');
        booksCache =  await requestBooks();
        needRefreshCache = false;
    }
    //apply filter and sort
    result = booksCache;
    if (params){

        if (params.filter){
            result = booksCache.filter((itm)=>{
                return (params.filter.bookId ? itm.book_id === params.filter.bookId : true) &&
                       (params.filter.bookTitle ? itm.book_title.toUpperCase().indexOf(params.filter.bookTitle.toUpperCase())> -1 : true) &&
                       (params.filter.bookAnnotation ? itm.book_annotation.toUpperCase().indexOf(params.filter.bookAnnotation.toUpperCase())> -1 : true) &&
                       (params.filter.authorId ? itm.author_id === params.filter.authorId : true) &&
                       (params.filter.genreId  ? itm.genre_id === params.filter.genreId : true);
            });

        }
        if (params.sortByField){
            result.sort((a,b)=>{
                return a[params.sortByField] < b[params.sortByField]? -1 : 1
            });
        }
    }
    return result;

};
//creating new record
const create = (params)=>{
    let insertStatment =`INSERT INTO ${config.schema}.books(book__title,book_date,book_annotation, author_id,genre_id)
                          VALUES('${params.bookTitle}',SYSDATE(),'${params.bookAnnotation}',${params.authorId},${params.genreId})`;
    needRefreshCache = true;
    return connection.query(insertStatment);
};

//updating the record
const update = (params)=>{
    let updStatement = `UPDATE ${config.schema}.books b 
                        SET    b.book_title = '${params.bookTitle}',
                               b.book_date = SYSDATE(),
                               b.book_annotation = '${params.bookAnnotation}',
                               b.author_id = ${params.authorId},
                               b.genre_id = ${params.genreId}
                        where  b.book_id = ${params.bookId}`;
    needRefreshCache = true;
    return connection.query(updStatement);
};

//remove the record
const remove = (params)=>{
    let delStatement = `delete from  ${config.schema}.books 
                        where  book_id = ${params.bookId}`;
    needRefreshCache = true;
    return connection.query(delStatement);
};


//generating testing data. Run script for database first
const generateData = async ()=>{
    results = [];
    let sql = `insert into ${config.schema}.authors(author_name,author_lname,author_notes)
    
    values `;
        for (let i=1;i<=100;i++){
            sql+=`('name_${i}','author_lname_${i}','author_notes_${i}')`
            sql+=i<100 ? ',':'';
        };
        let res = await connection.query(sql);
        console.log(res);
        results.push({
        table:'authors',
        result:res
        });
        sql = `insert into ${config.schema}.genre(genre_desc)
        values `;
        for (let i=1;i<=100;i++){
            sql+=`('genre_desc_${i}')`
            sql+=i<100 ? ',':'';
        };
        res = await connection.query(sql);
        results.push({
            table:'genre',
            result:res
        });
        console.log(res);
        sql = `insert into ${config.schema}.books(book_title,book_annotation,book_date,author_id,genre_id)
        values `;
            for (let i = 1; i <= 100000; i++) {
            let authorId = Math.trunc(Math.random() * 100);
                authorId = authorId===0?1:authorId
            let genreId = Math.trunc(Math.random() * 100);
                genreId = genreId===0 ? 1: genreId;
            sql += `('book_title_${i}','book_annotation_${i}',SYSDATE(),${authorId},${genreId})`;
            sql += i < 100000 ? ',' : '';
       }
     res = await connection.query(sql);
    results.push({
        table:'books',
        result:res
    });
    console.log(res);
    return results;
};
module.exports.getBooks = getBooks;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports.generateData = generateData;
