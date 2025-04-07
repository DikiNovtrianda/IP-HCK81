import axios from "axios";

export const phase2IP = axios.create({
  baseURL: "http://localhost:3000",
});