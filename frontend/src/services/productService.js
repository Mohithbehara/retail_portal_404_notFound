import api from './api'

export const getAllProducts = (page = 1, limit = 12, search = '', category = '') => {
  let url = `/products?page=${page}&limit=${limit}`
  if (search) url += `&search=${encodeURIComponent(search)}`
  if (category) url += `&category=${category}`
  return api.get(url)
}

export const searchProducts = (name) =>
  api.get(`/products/search?name=${name}`)

export const getProductById = (id) =>
  api.get(`/products/${id}`)

export const createProduct = (formData) =>
  api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const updateProductStock = (id, stock) =>
  api.put(`/products/${id}/stock`, { stock })
