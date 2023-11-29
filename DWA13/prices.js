console.log(
  (() => {
    const products = [
      { product: "banana", price: "2" },
      { product: "mango", price: 6 },
      { product: "potato", price: " " },
      { product: "avocado", price: "8" },
      { product: "coffee", price: 10 },
      { product: "tea", price: "" },
    ];

    // forEach to log each product name
    products.forEach((item) => console.log(item.product));

    // filter products with names longer than 5 characters
    const filteredProducts = products.filter(
      (item) => item.product.length <= 5
    );

    // filter and map to convert prices to numbers and remove products without prices
    const pricesOnly = filteredProducts
      .filter((item) => item.price !== "" && !isNaN(item.price))
      .map((item) => ({ ...item, price: Number(item.price) }));

    // reduce to calculate combined price of remaining products
    const totalPrice = pricesOnly.reduce((acc, item) => acc + item.price, 0);

    // reduce to concatenate all product names
    const allProductNames = products.reduce((acc, item, index, arr) => {
      if (index === arr.length - 1) {
        return `${acc}${item.product}`;
      }
      return `${acc}${item.product}, `;
    }, "");

    // reduce to find highest and lowest-priced items
    const priceStats = products.reduce(
      (acc, item) => {
        if (Number(item.price) > acc.highest.price) {
          acc.highest = { name: item.product, price: Number(item.price) };
        }
        if (Number(item.price) < acc.lowest.price && item.price !== "") {
          acc.lowest = { name: item.product, price: Number(item.price) };
        }
        return acc;
      },
      {
        highest: { name: "", price: -Infinity },
        lowest: { name: "", price: Infinity },
      }
    );

    // Object.entries and reduce to change keys
    const modifiedProducts = products.reduce((acc, [key, value]) => {
      const modifiedKey =
        key === "product" ? "name" : key === "price" ? "cost" : key;
      return { ...acc, [modifiedKey]: value };
    }, {});

    return {
      productNames: allProductNames,
      totalPrice,
      highestPrice: `Highest: ${priceStats.highest.name}`,
      lowestPrice: `Lowest: ${priceStats.lowest.name}`,
      modifiedProducts,
    };
  })()
);
