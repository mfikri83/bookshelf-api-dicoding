const {
  saveBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  updateBookHandler,
  deleteBookHandler,
} = require('./handler'); // impor module handler.js

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveBookHandler,
  },
  {
    method: 'GET',
    path: '/{books?}',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBookHandler,
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

// ekspor const routes
module.exports = routes;
