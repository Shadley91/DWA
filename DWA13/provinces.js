const provinces = [
  "Western Cape",
  "Gauteng",
  "Northern Cape",
  "Eastern Cape",
  "KwaZulu-Natal",
  "Free State",
];
const names = [
  "Ashwin",
  "Sibongile",
  "Jan-Hendrik",
  "Sifso",
  "Shailen",
  "Frikkie",
];

// 1. Console Log each name:
names.forEach((name) => {
  console.log(name);
});

// 2. Console Log each name with a matching province:
names.forEach((name, index) => {
  console.log(`${name} (${provinces[index]})`);
});

// 3. Map province names to uppercase:
const uppercaseProvinces = provinces.map((province) => province.toUpperCase());
console.log(uppercaseProvinces);

// 4. Create an array with the amount of characters in each name:
const charactersInNames = names.map((name) => name.length);
console.log(charactersInNames);

// 5. Sort provinces alphabetically:
const sortedProvinces = provinces.sort();
console.log(sortedProvinces);

// 6. Remove provinces with the word "Cape" and return the count:
const filteredProvinces = provinces.filter(
  (province) => !province.includes("Cape")
);
const remainingCount = filteredProvinces.length;
console.log(remainingCount);

// 7. Create a boolean array indicating if a name contains an 'S' character:
const hasSCharacter = names.map((name) => name.includes("S"));
console.log(hasSCharacter);

// 8. Turn the above boolean array into an object indicating the province of an individual using reduce:
const provinceObject = names.reduce((obj, name, index) => {
  obj[name] = provinces[index];
  return obj;
}, {});
console.log(provinceObject);
