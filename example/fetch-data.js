module.exports = function fetchData(query) {
  return fetch(`https://api.openbrewerydb.org/breweries/autocomplete?query=${query}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(`The API returned a ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(error);
      return [];
    })
}
