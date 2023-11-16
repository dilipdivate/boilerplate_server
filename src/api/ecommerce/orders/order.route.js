const express = require('express');
const { requiresToBeLoggedIn } = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const orderValidation = require('./order.validation');
const orderController = require('./order.controller');

const router = express.Router();

router
  .route('/')
  .post(requiresToBeLoggedIn('manageUsers'), validate(orderValidation.createOrder), orderController.createOrder)
  .get(requiresToBeLoggedIn('getUsers'), validate(orderValidation.getOrders), orderController.getAllOrders);

router
  .route('/:orderId')
  .get(requiresToBeLoggedIn('getUsers'), validate(orderValidation.getOrder), orderController.getSingleOrder)
  .put(requiresToBeLoggedIn('manageUsers'), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(requiresToBeLoggedIn('manageUsers'), validate(orderValidation.deleteOrder), orderController.deleteOrder);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: order management and retrieval
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a order
 *     description: Only admins can create other orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - family_name
 *               - date_of_birth
 *             properties:
 *                 first_name:
 *                   type: string
 *                 family_name:
 *                   type: string
 *                 date_of_birth:
 *                   type: date
 *                   description: Enter date in dd/mm/yyyy format
 *                 date_of_death:
 *                   type: date
 *                   description: Enter date in dd/mm/yyyy format
 *             example:
 *               first_name: fake firstname
 *               family_name: fake lastname
 *               date_of_birth: DOB
 *               date_of_death: DOD
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "400":
 *         $ref: '#/components/responses/InvalidDate'
 *       "401":
 *         $ref: '#/components/responses/Unorderized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 * 
 *   get:
 *     summary: Get all orders
 *     description: Only admins can retrieve all orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: first_name
 *         schema:
 *           type: string
 *         description: first_name
 *       - in: query
 *         name: family_name
 *         schema:
 *           type: string
 *         description: family_name
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
 *         description: Maximum number of orders
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
 *                     $ref: '#/components/schemas/Order'
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
 *         $ref: '#/components/responses/Unorderized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a user
 *     description: Logged in orders can fetch only their own order information. Only admins can fetch other orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "401":
 *         $ref: '#/components/responses/Unorderized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Update a order
 *     description: Logged in orders can only update their own information. Only admins can update other users.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               family_name:
 *                 type: string
 *               date_of_birth:
 *                 type: date
 *                 description: Enter date in dd/mm/yyyy format
 *               date_of_death:
 *                 type: date
 *                 description: Enter date in dd/mm/yyyy format
 *             example:
 *               first_name: fake name
 *               family_name: fake name
 *               date_of_birth: DOB
 *               date_of_death: DOD
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "400":
 *         $ref: '#/components/responses/InvalidDate'
 *       "401":
 *         $ref: '#/components/responses/Unorderized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a order
 *     description: Logged in orders can delete only themselves. Only admins can delete other orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unorderized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
