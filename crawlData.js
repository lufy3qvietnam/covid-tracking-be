const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const _ = require("lodash");

class crawData {
  constructor(link) {
    this.link = link;
    this.rawHTML = "";
    this.data = [];
    this.getHTML();
  }
  async getHTML() {
    return await axios
      .get(this.link)
      .then(response => {
        this.rawHTML = response.data;
        return this.crawData();
      })
      .catch(error => {
        error.status = (error.response && error.response.status) || 500;
        throw error;
      });
  }
  async crawData() {
    // console.log(this.$);
    //each site has different way to get data
  }
  async returnData() {
    // Promise.all(this.data);
    return this.data;
  }
}

// const crawWorlddoMetter = new crawData(
//   "https://www.worldometers.info/coronavirus/countries-where-coronavirus-has-spread/"
// );

// crawWorlddoMetter.returnData = async function() {
//   fs.writeFileSync("data.json", JSON.stringify(this.data));
// };

// crawWorlddoMetter.crawData = async function() {
//   const $ = cheerio.load(this.rawHTML);
//   const countries = JSON.parse(fs.readFileSync("countries.json"));
//   console.log(countries);
//   const allPromise = $("tbody > tr")
//     .map(async function(i, e) {
//       const countryName = await $(this)
//         .find("td:nth-child(1)")
//         .text();
//       const confirmed = await $(this)
//         .find("td:nth-child(2)")
//         .text();
//       const deaths = await $(this)
//         .find("td:nth-child(3)")
//         .text();
//       const indexCountry = _.findIndex(countries, function(o) {
//         return o.name == countryName;
//       });
//       if (indexCountry >= 0) {
//         const { long, lat, code } = countries[indexCountry];
//         const data = {
//           long,
//           lat,
//           code,
//           countryName,
//           confirmed,
//           deaths
//         };
//         return data;
//       }
//       return {};
//     })
//     .get();
//   Promise.all(allPromise).then(data => {
//     this.data = data;
//     this.returnData();
//   });
// };

// const crawlCountry = new crawData(
//   "https://developers.google.com/public-data/docs/canonical/countries_csv"
// );

// crawlCountry.returnData = async function() {
//   fs.writeFileSync("countries.json", JSON.stringify(this.data));
// };

// crawlCountry.crawData = async function() {
//   const $ = cheerio.load(this.rawHTML);
//   const allPromise = $("tr")
//     .map(async function(i, e) {
//       const code = await $(this)
//         .find("td:nth-child(1)")
//         .text();
//       const name = await $(this)
//         .find("td:nth-child(4)")
//         .text();
//       const lat = await $(this)
//         .find("td:nth-child(2)")
//         .text();
//       const long = await $(this)
//         .find("td:nth-child(3)")
//         .text();
//       const data = {
//         code,
//         name,
//         lat,
//         long
//       };
//       return data;
//     })
//     .get();
//   Promise.all(allPromise).then(data => {
//     console.log(data);
//     this.data = data;
//     this.returnData();
//   });
// };

module.exports = function() {
  const crawWorlddoMetter = new crawData(
    "https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory"
  );

  crawWorlddoMetter.returnData = async function() {
    // console.log(this.data);
    fs.writeFileSync("data.json", JSON.stringify(this.data));
  };

  crawWorlddoMetter.crawData = async function() {
    const $ = cheerio.load(this.rawHTML);
    fs.writeFileSync("text.html", this.rawHTML);
    const countries = JSON.parse(fs.readFileSync("countries.json"));
    // console.log(countries);
    const allPromise = $("#covid19-container > table > tbody > tr")
      .map(async function(i, e) {
        const countryName = await $(this)
          .find("th:nth-child(2) > a")
          .text();
        const confirmed = parseInt(
          await $(this)
            .find("td:nth-child(3)")
            .text()
            .replace(",", "")
        );
        const deaths = parseInt(
          await $(this)
            .find("td:nth-child(4)")
            .text()
            .replace(",", "")
        );
        const recovered = parseInt(
          await $(this)
            .find("td:nth-child(5)")
            .text()
            .replace(",", "")
        );
        const indexCountry = _.findIndex(countries, function(o) {
          return o.name == countryName;
        });
        if (indexCountry >= 0) {
          const { long, lat, code } = countries[indexCountry];
          const data = {
            long,
            lat,
            code,
            countryName,
            confirmed,
            deaths,
            recovered
          };
          // console.log(data);
          return data;
        }
      })
      .get();
    Promise.all(allPromise).then(data => {
      // console.log(data);
      this.data = data;
      this.returnData();
    });
  };
};
