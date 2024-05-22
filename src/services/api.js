import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://restcountries.com/v3.1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getAllCountries() {
    return apiClient.get("/all");
  },
  getCountryByName(name) {
    return apiClient.get(`/name/${name}`);
  },
  getCountriesByRegion(region) {
    return apiClient.get(`/region/${region}`);
  },
};
