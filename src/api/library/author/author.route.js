const express = require('express');
const { requiresToBeLoggedIn } = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const authorValidation = require('./author.validation');
const authorController = require('./author.controller');

const router = express.Router();

router
  .route('/')
  .post(requiresToBeLoggedIn('manageUsers'), validate(authorValidation.createAuthor), authorController.createAuthor)
  .get(requiresToBeLoggedIn('getUsers'), validate(authorValidation.getAuthors), authorController.getAuthors);

router
  .route('/:authorId')
  .get(requiresToBeLoggedIn('getUsers'), validate(authorValidation.getAuthor), authorController.getAuthor)
  .put(requiresToBeLoggedIn('manageUsers'), validate(authorValidation.updateAuthor), authorController.updateAuthor)
  .delete(requiresToBeLoggedIn('manageUsers'), validate(authorValidation.deleteAuthor), authorController.deleteAuthor);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: author management and retrieval
 */

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a author
 *     description: Only admins can create other authors.
 *     tags: [Authors]
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
 *                $ref: '#/components/schemas/Author'
 *       "400":
 *         $ref: '#/components/responses/InvalidDate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 * 
 *   get:
 *     summary: Get all authors
 *     description: Only admins can retrieve all authors.
 *     tags: [Authors]
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
 *         description: Maximum number of authors
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
 *                     $ref: '#/components/schemas/Author'
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
 * /authors/{id}:
 *   get:
 *     summary: Get a user
 *     description: Logged in authors can fetch only their own author information. Only admins can fetch other authors.
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Author'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Update a author
 *     description: Logged in authors can only update their own information. Only admins can update other users.
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author id
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
 *                $ref: '#/components/schemas/Author'
 *       "400":
 *         $ref: '#/components/responses/InvalidDate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a author
 *     description: Logged in authors can delete only themselves. Only admins can delete other authors.
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author id
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
