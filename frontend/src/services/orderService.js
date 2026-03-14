import api from './api'

export const placeOrder = (shippingData) => api.post('/orders', shippingData)
