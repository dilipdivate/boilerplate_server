const httpStatus = require('http-status');
const Order = require('./order.model');
const Product = require('../products/product.model');
const ApiError = require('../../../utils/ApiError');

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

/**
 * Create a Order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody) => {
  return Order.create(orderBody);
};

/**
 * Query for Orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  return orders;
};

/**
 * Get Order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  return Order.findById(id);
};

/**
 * Get Order by user id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getMyOrderById = async (id) => {
  return Order.find({ user: id });
};

/**
 * Get Order by category
 * @param {string} category
 * @returns {Promise<Order>}
 */
const getOrderByCategory = async (category) => {
  return Order.findOne({ category });
};

/**
 * Update Order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.orderStatus === 'Delivered') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already delivered this order');
  }

  if (updateBody.status === 'Shipped') {
    order.orderItems.forEach(async (ord) => {
      await updateStock(ord.product, ord.quantity);
    });
  }
  
  order.orderStatus = updateBody.status;

  if (updateBody.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  Object.assign(order, updateBody);
  await order.save({ validateBeforeSave: false });
  return order;
};


/**
 * Delete Order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.remove();
  return order;
};

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  getMyOrderById,
  getOrderByCategory,
  updateOrderById,
  deleteOrderById,
};
