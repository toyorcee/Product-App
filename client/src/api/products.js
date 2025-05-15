import axios from "axios";

const BASE_URL = "https://fakestoreapi.com";

export function fetchProducts() {
  return axios.get(`${BASE_URL}/products`);
}

export function fetchCategories() {
  return axios.get(`${BASE_URL}/products/categories`);
}

export function fetchProductsByCategory(category) {
  return axios.get(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}`
  );
}

export function fetchProductById(id) {
  return axios.get(`${BASE_URL}/products/${id}`);
}
