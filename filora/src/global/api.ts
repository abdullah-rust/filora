import axios from "axios";

export const api = axios.create({
  baseURL: "/api/user",
  withCredentials: true,
});

/// api call
