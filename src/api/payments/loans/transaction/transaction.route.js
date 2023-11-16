const express = require('express');
const { requiresToBeLoggedIn } = require('../../../../middlewares/auth');
const validate = require('../../../../middlewares/validate');
const transactionValidation = require('./transaction.validation');
const transactionController = require('./transaction.controller');

const router = express.Router();

router
  .route('/')
  .post(
    requiresToBeLoggedIn('manageUsers'),
    validate(transactionValidation.createTransaction),
    transactionController.createTransaction
  )
  .get(
    requiresToBeLoggedIn('getUsers'),
    validate(transactionValidation.getTransactions),
    transactionController.getTransactions
  );

router
  .route('/:transactionId')
  .get(
    requiresToBeLoggedIn('getUsers'),
    validate(transactionValidation.getTransaction),
    transactionController.getTransaction
  )

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management and retrieval
 */

/**
 * @swagger
 * /payments/transactions:
 *   post:
 *     summary: Create a transaction
 *     description: Only admins can create other transactions.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - isbn
 *               - summary
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *                 description: Enter price between 1 and 500
 *               isbn:
 *                 type: string
 *               summary:
 *                  type: string
 *               genre:
 *                  [$ref: '#/components/responses/Genre']
 *               author:
 *                  $ref: '#/components/responses/Author'
 *             example:
 *               title: fake name
 *               price: 10
 *               isbn: 123456
 *               summary: summary
 *               genre:
 *                  [$ref: '#/components/responses/Genre']
 *               author:
 *                  $ref: '#/components/responses/Author'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/INvalidDetails'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all transactions
 *     description: Only admins can retrieve all transactions.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: genre
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: author
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of transactions
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /payments/transactions/{id}:
 *   get:
 *     summary: Get a transaction
 *     description: Logged in transactions can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Update a transaction
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *                 description: price must be between 1 to 500
 *               isbn:
 *                 type: string
 *               summary:
 *                 type: string
 *               genre:
 *                  [$ref: '#/components/responses/Genre']
 *               author:
 *                  $ref: '#/components/responses/Author'
 *             example:
 *               title: fake name
 *               price: 100
 *               isbn: fake name
 *               summary: fake name
 *               genre: 
 *                  [$ref: '#/components/responses/Genre']
 *               author: 
 *                  $ref: '#/components/responses/Author'

 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/InvalidDetails'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a transaction
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
