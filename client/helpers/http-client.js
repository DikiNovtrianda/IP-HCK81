import axios from "axios";

export const phase2IP = axios.create({
  baseURL: "https://ipserver.novtrianda.space",
});