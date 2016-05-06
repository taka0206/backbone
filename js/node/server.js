/**
 * localhost:8080/booksでホストされるシンプルなAPI
 **/
 var express = require('express');
 var app = express();
 /** express 4.xでは以下のコードを追加 **/
 var bodyParser = require('body-parser');
 /** **/
 var bookId = 100;

 function findBook(id) {
   for (var i = 0; i < books.length; i++) {
     if (books[i].id === id) {
       return books[i];
     }
   }
   return null;
 }

 function removeBook(id) {
   var bookIndex = 0;
   for (var i = 0; i < books.length; i++) {
     if (books[i].id === id) {
       bookIndex = i;
     }
   }
   books.splice(bookIndex, 1);
 }

 // CORSリクエストをサポートするためのセットアップ
 var allowCrossDomain = function(req, response, next) {
   response.header('Access-Control-Allow-Origin', "http://localhost");
   response.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
   response.header('Access-Control-Allow-Headers', 'Content-Type');
   if ('OPTIONS' == req.method) {
     response.send(200);
   } else {
     next();
   }
 };

 /** express 4.0.0よりも前のバージョンでは、以下のコードを使用 */
 /** app.configure(function() {
   // リクエストのボディで提供されるJSONオブジェクトを解析
   app.use(express.bodyParser());
   app.use(allowCrossDomain);
 }); **/
 /** express 4.0.0以降の場合は、代わりに以下のコードを使用 **/
 app.use(allowCrossDomain);
 app.use(bodyParser());

 var books = [
   {id: 98, author: 'Stephen King', title: 'The Shining', year: 1977},
   {id: 99, author: 'George Orwell', title: 'Sample sample', year: 1949}
 ];

 /**
  * HTTP GET /books
  * Bookのリストを返す
  **/
  app.get('/books', function(request, response) {
    response.header('Access-Control-Allo-Origin', '*');
    console.log('In GET function ');
    response.json(books);
  });

  /**
   * HTTP GET /books/:id
   * id: 取得したいBookの一意な識別子
   * 指定されたIDのBookを返す
   * 該当するBookがない場合は404を返す
   **/
   app.get('/books/:id', function(request, response) {
     response.header('Access-Control-Allow-Origin', '*');
     console.log('Getting a book with id ' + request.params.id);
     var book = findBook(parseInt(request.params.id, 10));
     if (book === null) {
       response.send(404);
     } else {
       response.json(book);
     }
   });

   /**
    * HTTP POST /books/
    * このリクエストのボディに含まれているBookを保存
    * 正常終了の場合は200を返す
    **/
    app.post('/books/', function(request, response) {
      response.header('Access-Control-Allow-Origin', '*');
      var book = request.body;
      console.log('Saving book with the following structure ' + JSON.stringify(book));
      book.id = bookId++;
      books.push(book);
      response.json(book);
    });

    /**
     * HTTP PUT /books/:id
     * id: 更新したいBookの一意な識別子
     * 該当するBookがない場合は404を返す
     **/
     app.put('/books/:id', function(request, response) {
       response.header('Access-Control-Allow-Origin', '*');
       var book = request.body;
       console.log('Updating Book ' + JSON.stringify(book));
       var currentBook = findBook(parseInt(request.params.id, 10));
       if (currentBook === null) {
         response.send(404);
       } else {
         // Bookをローカルに保存
         currentBook.title = book.title;
         currentBook.year = book.year;
         currentBook.author = book.author;
         response.json(book);
       }
     });

     /**
       * HTTP DELETE /books/:id
       * id: 削除したいBookの一意な識別子
       * 対豪するBookがない場合は404を返す
       **/
      app.delete('/books/:id', function(request, response) {
        console.log('calling delete');
        response.header('Access-Control-Allow-Origin', '*');
        var book = findBook(parseInt(request.params.id, 10));
        if (book === null) {
          console.log('Could not find book');
          response.send(404);
        } else {
          console.log('Deleting ' + request.params.id);
          removeBook(parseInt(request.params.id, 10));
          response.send(200);
        }
      });

      // ポート8080でAPIを起動
      app.listen(8080);
