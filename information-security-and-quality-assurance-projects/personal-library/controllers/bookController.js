const Book = require('../models/book');

function BookController() {

    this.getBooks = async function () {
        const books = await Book.find({}).select({ __v: 0, comments: 0 });

        return books;
    }

    this.getBookById = async function (bookId) {
        const book = await Book.findById({ _id: bookId }).select({ __v: 0, commentcount: 0 });

        if (book)
            return book;
        else
            return 'no book exists';
    }

    this.saveBook = async function (title) {
        try {
            const book = new Book({ title });
            await book.save({validateBeforeSave: true});

            return book;
        } catch (e) {
            //console.log(e);
            return 'missing title';
        }
    }

    this.saveComment = async function (bookId, comment) {
        try {
            let book = await Book.findById(bookId);
            book = book.toObject();
            delete book._id;
            delete book.__v;
            book.comments.push(comment);
            book.commentcount++;
            await Book.updateOne({ _id: bookId }, book);
            book._id = bookId;
            delete book.commentcount;

            return book;
        } catch (e) {
            return 'no book exists';
        }
    }

    this.deleteAllBooks = async function () {
        try {
            await Book.deleteMany({});

            return 'complete delete successful';
        } catch (e) {
            console.log(e);
            return 'error to delete books';
        }
    }

    this.deleteBookById = async function (bookId) {
        try {
            await Book.deleteOne({ _id: bookId });

            return 'delete successful';
        } catch (e) {
            console.log(e);
            return 'no book exists'
        }
    }
}

module.exports = BookController;