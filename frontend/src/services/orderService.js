import api from './api'

export const placeOrder = (shippingData) => api.post('/orders', shippingData)
export const getUserOrders = () => api.get('/orders')
