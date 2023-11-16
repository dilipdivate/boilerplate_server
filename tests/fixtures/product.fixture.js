const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('../../src/models/product.model');

const categories = ['Baby', 'Movies', 'Shoes', 'Books', 'Electronics', 'Computers', 'Kids'];

const productOne = {
  _id: mongoose.Types.ObjectId(),
  productName: faker.commerce.productName(),
  department: faker.commerce.department(),
  price: faker.number.int({ min: 1, max: 500 }), // 154.00
  isbn: faker.commerce.isbn(13),
  productDescription: faker.commerce.productDescription(),
  rating: faker.number.int({ min: 0, max: 5 }), // 57
  supply: faker.number.int({ min: 1, max: 1000 }), // 57
  // category: [categories[Math.floor(Math.random() * categories.length)]],
  category: ['Baby', 'Movies', 'Shoes', 'Books', 'Electronics', 'Computers', 'Kids'],
};

const productTwo = {
  _id: mongoose.Types.ObjectId(),
  productName: faker.commerce.productName(),
  department: faker.commerce.department(),
  price: faker.number.int({ min: 1, max: 500 }), // 154.00
  isbn: faker.commerce.isbn(13),
  productDescription: faker.commerce.productDescription(),
  rating: faker.number.int({ min: 0, max: 5 }), // 57
  supply: faker.number.int({ min: 1, max: 1000 }), // 57
  // category: [categories[Math.floor(Math.random() * categories.length)]],
  category: ['Baby', 'Movies', 'Shoes', 'Books', 'Electronics', 'Computers', 'Kids'],
};

const insertProducts = async (products) => {
  await Product.insertMany(products.map((product) => ({ ...product })));
};

module.exports = {
  productOne,
  productTwo,
  insertProducts,
};
