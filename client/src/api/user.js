import axios from "axios";

const BASE_URL = "https://fakestoreapi.com";

export function fetchUserById(id) {
  return axios.get(`${BASE_URL}/users/${id}`);
}

export function updateUser({ id, username, email, password }) {
  return axios.put(`${BASE_URL}/users/${id}`, {
    id,
    username,
    email,
    password,
  });
}
