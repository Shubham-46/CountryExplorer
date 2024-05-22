<template>
  <div class="container">
    <div class="search-filter">
      <input
        v-model="searchQuery"
        placeholder="Search for a country"
        @input="searchCountry"
      />
      <select v-model="selectedRegion" @change="filterByRegion">
        <option value="">Select Region</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Oceania">Oceania</option>
      </select>
    </div>
    <table>
      <thead>
        <tr>
          <th>Flag</th>
          <th>Name</th>
          <th>Capital</th>
          <th>Currency</th>
          <th>Region</th>
          <th>Lat/Lng</th>
          <th>Languages</th>
          <th>Population</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="country in countries"
          :key="country.cca3"
          @click="showDetails(country)"
        >
          <td><img :src="country.flags.png" alt="Flag" class="flag" /></td>
          <td>{{ country.name.common }}</td>
          <td>{{ country.capital ? country.capital[0] : "N/A" }}</td>
          <td>{{ getCurrencies(country.currencies) }}</td>
          <td>{{ country.region }}</td>
          <td>{{ country.latlng.join(", ") }}</td>
          <td>{{ getLanguages(country.languages) }}</td>
          <td>{{ country.population.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>
          <strong>Official Name:</strong> {{ selectedCountry.name.official }}
        </p>
        <p><strong>Sub Region:</strong> {{ selectedCountry.subregion }}</p>
        <p>
          <strong>UN Member:</strong>
          {{ selectedCountry.unMember ? "Yes" : "No" }}
        </p>
        <p>
          <strong>Border Countries:</strong>
          {{ getBorderCountries(selectedCountry.borders) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      countries: [],
      searchQuery: "",
      selectedRegion: "",
      showModal: false,
      selectedCountry: null,
      isLoading: true,
    };
  },
  methods: {
    fetchCountries() {
      api
        .getAllCountries()
        .then((response) => {
          this.countries = response.data
            .sort((a, b) => b.population - a.population)
            .slice(0, 20);
        })
        .catch((error) => {
          console.error(error);
          alert("Error fetching countries data");
        });
    },
    searchCountry() {
      if (this.searchQuery) {
        api
          .getCountryByName(this.searchQuery)
          .then((response) => {
            this.countries = response.data;
          })
          .catch((error) => {
            console.error(error);
            alert("Country not found");
          });
      } else {
        this.fetchCountries();
      }
    },
    filterByRegion() {
      if (this.selectedRegion) {
        api
          .getCountriesByRegion(this.selectedRegion)
          .then((response) => {
            this.countries = response.data;
          })
          .catch((error) => {
            console.error(error);
            alert("Error fetching countries by region");
          });
      } else {
        this.fetchCountries();
      }
    },
    showDetails(country) {
      this.selectedCountry = country;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    getCurrencies(currencies) {
      return currencies
        ? Object.values(currencies)
            .map((currency) => currency.name)
            .join(", ")
        : "N/A";
    },
    getLanguages(languages) {
      return languages ? Object.values(languages).join(", ") : "N/A";
    },
    getBorderCountries(borders) {
      return borders ? borders.join(", ") : "N/A";
    },
  },
  created() {
    this.fetchCountries();
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.search-filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.flag {
  width: 50px;
  height: auto;
}

.modal {
  display: block; /* Show the modal */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
