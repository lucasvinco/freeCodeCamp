/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const BookController = require('../controllers/bookController');

module.exports = function (app) {

    const bookController = new BookController();

    app.route('/api/books')
        .get(async function (req, res) {
            //response will be array of book objects
            //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
            const books = await bookController.getBooks();
            res.json(books);
        })

        .post(async function (req, res) {
            var title = req.body.title;
            //response will contain new book object including atleast _id and title
            let book = await bookController.saveBook(title);
            if (typeof book !== 'string') {
                book = book.toObject();
                delete book.__v;
                delete book.comments;
                delete book.commentcount;

                res.json(book);
            } else {
                res.send(book);
            }
        })

        .delete(async function (req, res) {
            //if successful response will be 'complete delete successful'
            const response = await bookController.deleteAllBooks();

            res.send(response);
        });



    app.route('/api/books/:id')
        .get(async function (req, res) {
            var bookId = req.params.id;
            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
            const book = await bookController.getBookById(bookId);

            if (typeof book !== 'string')
                res.json(book);
            else
                res.send(book);
        })

        .post(async function (req, res) {
            var bookId = req.params.id;
            var comment = req.body.comment;
            //json res format same as .get
            let book = await bookController.saveComment(bookId, comment);

            if (typeof book !== 'string')
                res.json(book);
            else
                res.send(book);
        })

        .delete(async function (req, res) {
            var bookId = req.params.id;
            //if successful response will be 'delete successful'
            const response = await bookController.deleteBookById(bookId);

            res.send(response);
        });

};