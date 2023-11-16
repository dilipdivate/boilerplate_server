const httpStatus = require('http-status');
const Customer = require('./customer.model');
const ApiError = require('../../../../utils/ApiError');
const Loan = require('../loan/loan.model');
const Transaction = require('../transaction/transaction.model');

/**
 * Create a Customer
 * @param {Object} customerBody
 * @returns {Promise<Customer>}
 */
const createCustomer = async (customerBody) => {
  return Customer.create(customerBody);
};

/**
 * Query for Customers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCustomers = async (filter, options) => {
  const customers = await Customer.paginate(filter, options);
  return customers;
};

/**
 * Get Customer by id
 * @param {ObjectId} id
 * @returns {Promise<Customer>}
 */
const getCustomerById = async (id) => {
  return Customer.findById(id);
};

/**
 * Get Customer by customerNumber
 * @param {string} customerNumber
 * @returns {Promise<Customer>}
 */
const getCustomerByNumber = async (customerNumber) => {
  return Customer.findOne({ customerNumber });
};

/**
 * Update Customer by id
 * @param {ObjectId} customerId
 * @param {Object} updateBody
 * @returns {Promise<Customer>}
 */
const updateCustomerById = async (customerId, updateBody) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  Object.assign(customer, updateBody);
  await customer.save();
  return customer;
};

/**
 * Delete Customer by id
 * @param {ObjectId} customerId
 * @returns {Promise<Customer>}
 */
const deleteCustomerById = async (customerId) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  await customer.remove();
  return customer;
};

module.exports = {
  createCustomer,
  queryCustomers,
  getCustomerById,
  getCustomerByNumber,
  updateCustomerById,
  deleteCustomerById,
};
