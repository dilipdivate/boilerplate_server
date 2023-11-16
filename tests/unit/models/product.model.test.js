const { faker } = require('@faker-js/faker');
const { Product } = require('../../../src/models');

describe('Product model', () => {
  describe('Product validation', () => {
    let newProduct;
    beforeEach(() => {
      const categories = ['Baby', 'Movies', 'Shoes', 'Books', 'Electronics', 'Computers', 'Kids'];
      newProduct = {
        productName: faker.commerce.productName(),
        department: faker.commerce.department(),
        price: faker.number.int({ min: 1, max: 500 }), // 154.00
        isbn: faker.commerce.isbn(13),
        productDescription: faker.commerce.productDescription(),
        rating: faker.number.int({ min: 0, max: 5 }), // 57
        supply: faker.number.int({ min: 1, max: 1000 }), // 57
        category: [categories[Math.floor(Math.random() * categories.length)]],
      };
    });

    test('should correctly validate a valid product', async () => {
      newProduct.price = 21;
      await expect(new Product(newProduct).validate()).resolves.not.toThrow();
    });

    test('should correctly validate error if price is characters', async () => {
      newProduct.price = 'test';
      await expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should correctly validate error if price is negative', async () => {
      newProduct.price = -1;
      await expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should correctly validate error if price is zero', async () => {
      newProduct.price = 0;
      await expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should correctly validate error if rating is greater than 5', async () => {
      newProduct.rating = 6;
      await expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should correctly validate error if rating is less than 0', async () => {
      newProduct.rating = -1;
      await expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should correctly validate error if supply is less than 1', async () => {
      newProduct.supply = -1;
      await expect(new Product(newProduct).validate()).rejects.toThrow();
    });
  });
});
