const { nanoid } = require('nanoid'); // madule third-party
const books = require('./books'); // impor module books.js

// function handler untuk menyimpan data buku
const saveBookHandler = (request, h) => {
  // request dari sisi client
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // jika tidak terdapat nama pada request
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // jika tidak readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  // variabel untuk menyaring array books
  const isPassed = books.filter((book) => book.id === id).length > 0;

  // response terpenuhi
  if (isPassed) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // response gagal
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// function handler untuk menampilkan semua data buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // jika request query name dari client terpenuhi
  if (name) {
    // variabel untuk menyaring array books
    const queryRequest = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

    // response terpenuhi
    const response = h.response({
      status: 'success',
      data: {
        books: queryRequest.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // jika request query reading dari client terpenuhi
  if (reading) {
    const isReadingBook = reading === '1';

    // variabel untuk menyaring array books
    const queryRequest = books.filter((book) => book.reading === isReadingBook);

    // response query reading terpenuhi
    const response = h.response({
      status: 'success',
      data: {
        books: queryRequest.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // jika request query dari client terpenuhi
  if (finished) {
    const isFinishBook = finished === '1';

    // variabel untuk menyaring array books
    const queryRequest = books.filter((book) => book.finished === isFinishBook);

    // response query finished terpenuhi
    const response = h.response({
      status: 'success',
      data: {
        books: queryRequest.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // response terpenuhi
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// function handler untuk detail data buku
const getDetailBookHandler = (request, h) => {
  const { bookId } = request.params;

  // variabel untuk menyaring array books
  const book = books.filter((b) => b.id === bookId)[0];

  // jika data book tidak ditemukan
  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // response berhasil
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

// function handler untuk memperbarui data buku
const updateBookHandler = (request, h) => {
  const { bookId } = request.params;

  // request dari sisi client
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const indexBook = books.findIndex((book) => book.id === bookId);

  // jika request name tidak ada
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // jika request readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // jika response berhasil
  if (indexBook !== -1) {
    books[indexBook] = {
      ...books[indexBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // response gagal, tidak menemukan Id
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// function handler untuk menghapus data buku
const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const indexBook = books.findIndex((book) => book.id === bookId);

  // jika response berhasil
  if (indexBook !== -1) {
    books.splice(indexBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // response gagal
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// ekspor function handler
module.exports = {
  saveBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
