const Product = require('../models/productModel');
const { ErrorHandler } = require('../utils/ErrorHandler');


const products = async ( req, res, next) =>{
    try {
        const products = await Product.find();
        res.json({
            success: true,
            products
        })
    } catch (error) {
        console.error( `Error fetching products data ${error}`);
        return next(new ErrorHandler(500, 'Internal Server Error'));
    }
}
const productSearch = async (req, res, next) =>{
    try {
        const { search } = req.query;
        const allProducts = await Product.find();

        const filteredProducts = allProducts.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );
    
        res.json(filteredProducts);
      } catch (error) {
        console.error('Error searching products:', error);
        return next(new ErrorHandler(500, 'Internal Server Error'));
      }
}


const sortProducts = async (req, res, next) => { 
  try {
  const { sortBy } = req.query;

  const sortedProducts = await Product.find();

  if (sortBy) {
    if (sortBy === "Price : Lowest") {
      sortedProducts.sort((a, b) => parseInt(a.price.replace(",", "")) - parseInt(b.price.replace(",", "")));
    } else if (sortBy === "Price : Highest") {
      sortedProducts.sort((a, b) => parseInt(b.price.replace(",", "")) - parseInt(a.price.replace(",", "")));
    } else if (sortBy === "Name : (A-Z)") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Name : (Z-A)") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
  }
  res.json(sortedProducts);
  } catch (error) {
    console.error('Error sorting products:', error);
    return next(new ErrorHandler(500, 'Internal Server Error'));
  } 
}

const filterProducts = async (req, res, next) =>
{
  try {
       const { headphoneType } = JSON.parse(req.query.filters);
       const { company } = JSON.parse(req.query.filters);
       const { color } = JSON.parse(req.query.filters);
       const { priceRange } = JSON.parse(req.query.filters);

    const products = await Product.find();

    let filteredProducts = products.filter(product => 
    {
      if (headphoneType && product.category !== headphoneType) return false;
      if (company && product.brand !== company) return false;
      if (color && product.color !== color) return false;
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split(" - ");
        const productPrice = parseInt(product.price.replace(",", ""));
        const minRange = parseInt(minPrice.replace("₹", "").replace(",", ""));
        const maxRange = parseInt(maxPrice.replace("₹", "").replace(",", ""));
        if (productPrice < minRange || productPrice > maxRange) return false;
      }
      return true;
  });
  res.json(filteredProducts);
    
  } catch (error) {
    console.error('Error sorting products:', error);
    return next(new ErrorHandler(500, 'Internal Server Error'));
  }
}

module.exports = {products, productSearch, sortProducts, filterProducts}