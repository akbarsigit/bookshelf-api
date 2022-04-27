const { addBookHandler, showBookHandler, showBookDetailHandler,updateBookHandler, deleteBookHandler } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    }, 
    {
        method: 'GET',
        path: '/books',
        handler: showBookHandler,
    }, 
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: showBookDetailHandler,
    }, 
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookHandler,
    }, 
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookHandler,
    },
];


module.exports = routes