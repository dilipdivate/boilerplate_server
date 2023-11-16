const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Product } = require('../../src/models');
const { productOne, productTwo, insertProducts } = require('../fixtures/product.fixture');

const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');

setupTestDB();

// eslint-disable-next-line jest/no-disabled-tests
describe('Product routes', () => {
  describe('POST /v1/products', () => {
    let newProduct;
    beforeEach(() => {
      newProduct = {
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
    });

    test('should return 201 and successfully create new product if data is ok', async () => {
      await insertUsers([admin]);
      const res = await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        productName: newProduct.productName,
        department: newProduct.department,
        price: newProduct.price,
        isbn: newProduct.isbn,
        productDescription: newProduct.productDescription,
        rating: newProduct.rating,
        supply: newProduct.supply,
        category: newProduct.category,
      });

      // const dbProduct = await Product.findById(res.body.id);
      // expect(dbProduct).toBeDefined();
      // expect(dbProduct).toMatchObject({
      //   productName: newProduct.productName,
      //   department: newProduct.department,
      //   price: newProduct.price,
      //   isbn: newProduct.isbn,
      //   productDescription: newProduct.productDescription,
      //   rating: newProduct.rating,
      //   supply: newProduct.supply,
      //   category: newProduct.category,
      // });
    });

    test('should return 400 error if price is characters', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);
      newProduct.price = 'test';

      await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if price is out of range', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);

      newProduct.price = 1000;

      await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.BAD_REQUEST);

      newProduct.price = 0;

      await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.BAD_REQUEST);

      newProduct.price = -1;

      await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if rating is out of range', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);
      newProduct.rating = -1;

      await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.BAD_REQUEST);

      newProduct.rating = 6;

      await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/products', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: productOne._id.toHexString(),
        productName: productOne.productName,
        department: productOne.department,
        price: productOne.price,
        isbn: productOne.isbn,
        productDescription: productOne.productDescription,
        rating: productOne.rating,
        supply: productOne.supply,
        category: productOne.category,
      });
    });

    test('should return 403 if a non-admin is trying to access all products', async () => {
      await insertUsers([userOne]);
      await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ productId: productOne.productId })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(productOne._id.toHexString());
    });

    test('should correctly apply filter on role field', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ category: ['toys'] })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(productOne._id.toHexString());
      expect(res.body.results[1].id).toBe(productTwo._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      productOne.productName = 'ABC';
      productTwo.productName = 'PQR';
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'productName:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[1].id).toBe(productOne._id.toHexString());
      expect(res.body.results[0].id).toBe(productTwo._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertUsers([admin]);
      productOne.productName = 'ABC';
      productTwo.productName = 'PQR';
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'productName:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(productOne._id.toHexString());
      expect(res.body.results[1].id).toBe(productTwo._id.toHexString());
    });

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'category:desc,productName:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);

      const expectedOrder = [productOne, productTwo].sort((a, b) => {
        if (a.category < b.category) {
          return 1;
        }
        if (a.category > b.category) {
          return -1;
        }
        return a.productName < b.productName ? -1 : 1;
      });

      expectedOrder.forEach((product, index) => {
        expect(res.body.results[index].id).toBe(product._id.toHexString());
      });
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(productOne._id.toHexString());
      expect(res.body.results[1].id).toBe(productTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 4, limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 4,
        limit: 2,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(productTwo._id.toHexString());
    });
  });

  describe('GET /v1/products/:productId', () => {
    test('should return 200 and the user object if data is ok', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);

      const res = await request(app)
        .get(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: productOne._id.toHexString(),
        productName: productOne.productName,
        department: productOne.department,
        price: productOne.price, // 154.00
        isbn: productOne.isbn,
        productDescription: productOne.productDescription,
        rating: productOne.rating, // 57
        supply: productOne.supply,
        category: productOne.category,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);

      await request(app).get(`/v1/products/${productOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to get another user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertProducts([productOne, productTwo]);

      await request(app)
        .get(`/v1/products/${productTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and the user object if admin is trying to get another user', async () => {
      await insertUsers([userOne, admin]);
      await insertProducts([productOne, productTwo]);

      await request(app)
        .get(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProducts([productTwo]);

      await request(app)
        .get('/v1/products/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if user is not found', async () => {
      await insertUsers([admin]);
      await insertProducts([productTwo]);

      await request(app)
        .get(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/products/:productId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);

      await request(app)
        .delete(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbProduct = await Product.findById(productOne._id);
      expect(dbProduct).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProducts([productOne]);

      await request(app).delete(`/v1/products/${productOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete another user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertProducts([productOne, productTwo]);

      await request(app)
        .delete(`/v1/products/${productTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if admin is trying to delete another user', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);

      await request(app)
        .delete(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);

      await request(app)
        .delete('/v1/products/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if product already is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .delete(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/products/:productId', () => {
    test('should return 200 and successfully update user if data is ok', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);

      const updateBody = {
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

      const res = await request(app)
        .put(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: productOne._id.toHexString(),
        productName: updateBody.productName,
        department: updateBody.department,
        price: updateBody.price,
        isbn: updateBody.isbn,
        productDescription: updateBody.productDescription,
        rating: updateBody.rating,
        supply: updateBody.supply,
        category: updateBody.category,
      });

      // const dbProduct = await Product.findById(productOne._id);
      // expect(dbProduct).toBeDefined();
      // expect(dbProduct).toMatchObject({
      //   id: productOne._id.toHexString(),
      //   productName: updateBody.productName,
      //   department: updateBody.department,
      //   price: updateBody.price,
      //   isbn: updateBody.isbn,
      //   productDescription: updateBody.productDescription,
      //   rating: updateBody.rating,
      //   supply: updateBody.supply,
      //   category: updateBody.category,
      // });
    });

    test('should return 200 and successfully update user if admin is updating another user', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);
      const updateBody = {
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

      await request(app)
        .put(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating another user that is not found', async () => {
      await insertUsers([admin]);
      await insertProducts([productTwo]);
      const updateBody = {
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

      await request(app)
        .patch(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProducts([productTwo]);
      const updateBody = {
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

      await request(app)
        .patch(`/v1/products/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 if rating is invalid', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne, productTwo]);
      const updateBody = {
        productName: faker.commerce.productName(),
        department: faker.commerce.department(),
        price: faker.number.int({ min: 1, max: 500 }), // 154.00
        isbn: faker.commerce.isbn(13),
        productDescription: faker.commerce.productDescription(),
        supply: faker.number.int({ min: 1, max: 1000 }), // 57
        // category: [categories[Math.floor(Math.random() * categories.length)]],
        category: ['Baby', 'Movies', 'Shoes', 'Books', 'Electronics', 'Computers', 'Kids'],
        // rating: faker.number.int({ min: 0, max: 5 }), // 57
        rating: -1,
      };

      await request(app)
        .put(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if price does not exist', async () => {
      await insertUsers([admin]);
      await insertProducts([productOne]);
      const updateBody = {
        productName: faker.commerce.productName(),
        department: faker.commerce.department(),
        // price: faker.number.int({ min: 1, max: 500 }), // 154.00
        isbn: faker.commerce.isbn(13),
        productDescription: faker.commerce.productDescription(),
        rating: faker.number.int({ min: 0, max: 5 }), // 57
        supply: faker.number.int({ min: 1, max: 1000 }), // 57
        // category: [categories[Math.floor(Math.random() * categories.length)]],
        category: ['Baby', 'Movies', 'Shoes', 'Books', 'Electronics', 'Computers', 'Kids'],
      };

      await request(app)
        .put(`/v1/products/${productOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
