const express = require('express');
const { requiresToBeLoggedIn } = require('../../../../middlewares/auth');
const validate = require('../../../../middlewares/validate');
const loanValidation = require('./loan.validation');
const loanController = require('./loan.controller');

const router = express.Router();

router
  .route('/')
  .post(requiresToBeLoggedIn('manageUsers'), validate(loanValidation.createLoan), loanController.createLoan)
  .get(requiresToBeLoggedIn('getUsers'), validate(loanValidation.getLoans), loanController.getLoans)


router
  .route('/:loanId')
  .get(requiresToBeLoggedIn('getUsers'), validate(loanValidation.getLoan), loanController.getLoan)
  // .get(requiresToBeLoggedIn('getUsers'), validate(loanValidation.getTransactionByLoan), loanController.getTransactionByLoan)
  .get(
    requiresToBeLoggedIn('getUsers'),
    validate(loanValidation.getLoanDetailByNumber),
    loanController.getLoanDetailByNumber
  )
  .patch(requiresToBeLoggedIn('manageUsers'), validate(loanValidation.updateLoan), loanController.updateLoan)
  .delete(requiresToBeLoggedIn('manageUsers'), validate(loanValidation.deleteLoan), loanController.deleteLoan);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management Api
 */

/**
 * @swagger
 * /payments/loans/loan:
 *   post:
 *     summary: Create new loan
 *     description: Only admins can create new loans.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanAmount
 *               - interestRate
 *               - loanDuration
 *               - paymentFrequency
 *               - loanType
 *               - loanStatus
 *               - offsetAccount
 *               - offsetAmt
 *               - customer
 *             properties:
 *               loanNumber:
 *                 type: number
 *               loanAmount:
 *                 type: number
 *               loanBalance:
 *                 type: number
 *               interestRate:
 *                 type: number
 *               principalAmt:
 *                 type: number
 *               interestAmt:
 *                 type: number
 *               totalInterestPaid:
 *                 type: number
 *               interestPaid:
 *                 type: object
 *                 properties:
 *                   paymentDates:
 *                     type: date
 *                   interestCharged:
 *                     type: number
 *               EMI:
 *                 type: number
 *               loanDuration:
 *                 type: number
 *               paymentFrequency:
 *                 type: number
 *               loanType:
 *                 type: string
 *               startDate:
 *                 type: date
 *               endDate:
 *                 type: date
 *               nextPaymentDate:
 *                 type: date
 *               loanStatus:
 *                 type: string
 *               offsetAccount:
 *                  type: boolean
 *               offsetAmt:
 *                  type: number
 *               transactions:
 *                  [$ref: '#/components/responses/Transaction']
 *               customer:
 *                  $ref: '#/components/responses/Customer'
 *             example:
 *               loanAmount: 100
 *               interestRate: 10
 *               principalAmt: 123
 *               interestAmt: 123
 *               totalInterestPaid: 133
 *               loanDuration: 10
 *               paymentFrequency: 4
 *               loanType: "FIXED"
 *               startDate: "01/01/2001"
 *               endDate: "01/01/2001"
 *               nextPaymentDate: "01/01/2023"
 *               loanStatus: "New"
 *               offsetAccount: true
 *               offsetAmt: 4
 *               customer: "abc"
 *               transactions: ["abc"]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Loan'
 *       "400":
 *         $ref: '#/components/responses/INvalidDetails'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all loans
 *     description: Only admins can retrieve all loans.
 *     tags: [Loans]
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
 *         description: Maximum number of loans
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
 *                     $ref: '#/components/schemas/Loan'
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
 * /payments/loans/loan/{id}:
 *   get:
 *     summary: Get a loan
 *     description: Logged in loans can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Loan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Update a loan
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanNumber:
 *                 type: number
 *               loanAmount:
 *                 type: number
 *               loanBalance:
 *                 type: number
 *               interestRate:
 *                 type: number
 *               principalAmt:
 *                 type: number
 *               interestAmt:
 *                 type: number
 *               totalInterestPaid:
 *                 type: number
 *               interestPaid:
 *                 type: object
 *                 properties:
 *                   paymentDates:
 *                     type: date
 *                   interestCharged:
 *                     type: number
 *               EMI:
 *                 type: number
 *               loanDuration:
 *                 type: number
 *               paymentFrequency:
 *                 type: number
 *               loanType:
 *                 type: string
 *               startDate:
 *                 type: date
 *               endDate:
 *                 type: date
 *               nextPaymentDate:
 *                 type: date
 *               loanStatus:
 *                 type: string
 *               offsetAccount:
 *                  type: boolean
 *               offsetAmt:
 *                  type: number
 *               transactions:
 *                  [$ref: '#/components/responses/Transaction']
 *               customer:
 *                  $ref: '#/components/responses/Customer'
 *             example:
 *               loanAmount: 100
 *               interestRate: 10
 *               principalAmt: 123
 *               interestAmt: 123
 *               totalInterestPaid: 133
 *               loanDuration: 10
 *               paymentFrequency: 4
 *               loanType: "FIXED"
 *               startDate: "01/01/2001"
 *               endDate: "01/01/2001"
 *               nextPaymentDate: "01/01/2023"
 *               loanStatus: "New"
 *               offsetAccount: true
 *               offsetAmt: 4
 *               customer: "abc"
 *               transactions: ["abc"]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Loan'
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
 *     summary: Delete a loan
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan id
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
