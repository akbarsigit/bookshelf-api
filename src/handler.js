const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
    };

    if (name === undefined){
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    else if (readPage > pageCount){
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }
    
    try{
        books.push(newBook);
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },   
        });
        response.code(201);   
        return response;
    }catch{
        const response = h.response({
            status: "error",
            message: "Buku gagal ditambahkan",
        });
        response.code(500);
        return response;
    }
};

const showBookHandler = (request, h) => {
    const { name: qName, reading: qReading, finished: qFinished } = request.query;
    let filteredBooks = null;
    
    if (qName){
        filteredBooks = books.filter((n) => n.name.toLowerCase().includes(qName.toLowerCase()))
    }
    else if (qReading){
        filteredBooks = books.filter((n) => n.reading == parseInt(qReading))
    }
    else if(qFinished){
        filteredBooks = books.filter((n) => n.finished == parseInt(qFinished))
    }
    else{
        filteredBooks = books;
    }
    
    const response = h.response ({
        status: 'success',
        data: {
            books : filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

const showBookDetailHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if (book === undefined) {
        const response = h.response({
            status: 'fail',
            message: "Buku tidak ditemukan"
        });
        response.code(404);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            book,
        }, 
    });
    response.code(200);
    return response;
};

const updateBookHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);
    book = books[index];

    if (name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    else if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    else if (index === -1){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    books[index] = {
        ...books[index], 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
    }

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });

    response.code(200);
    return response;
}

const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

module.exports = {addBookHandler, showBookHandler, showBookDetailHandler,updateBookHandler, deleteBookHandler, };