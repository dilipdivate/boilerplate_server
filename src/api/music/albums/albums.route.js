const express = require('express');
const { requiresToBeLoggedIn } = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const albumsValidation = require('./albums.validation');
const albumsController = require('./albums.controller');
const tracksRoute = require('../tracks/tracks.route');

const router = express.Router();

router
  .route('/')
  .post(requiresToBeLoggedIn('manageUsers'), validate(albumsValidation.createAlbums), albumsController.createAlbums)
  .get(requiresToBeLoggedIn('getUsers'), validate(albumsValidation.getAlbums), albumsController.getAlbums);

router
  .route('/:albumId')
  .get(requiresToBeLoggedIn('getUsers'), validate(albumsValidation.getAlbum), albumsController.getAlbum)
  .put(requiresToBeLoggedIn('manageUsers'), validate(albumsValidation.updateAlbums), albumsController.updateAlbums)
  .delete(requiresToBeLoggedIn('manageUsers'), validate(albumsValidation.deleteAlbums), albumsController.deleteAlbums);

router.use('/:albumId/tracks', tracksRoute);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Albums
 *   description: book management and retrieval
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a book
 *     description: Only admins can create other books.
 *     tags: [Albums]
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
 *                $ref: '#/components/schemas/Album'
 *       "400":
 *         $ref: '#/components/responses/INvalidDetails'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all books
 *     description: Only admins can retrieve all books.
 *     tags: [Albums]
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
 *         description: Maximum number of books
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
 *                     $ref: '#/components/schemas/Album'
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
 * /books/{id}:
 *   get:
 *     summary: Get a book
 *     description: Logged in books can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Album'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Update a book
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album id
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
 *                $ref: '#/components/schemas/Album'
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
 *     summary: Delete a book
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album id
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