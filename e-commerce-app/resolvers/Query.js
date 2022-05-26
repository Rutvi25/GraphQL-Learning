const { products, categories } = require('../db');

exports.Query = {
  hello: (parent, args, { products }) => 'World!!!',
  products: (parent, args, { products }) => products,
  product: (parent, { id }, { products }) => {
    return products.find(product => product.id === id);
  },
  categories: (parent, args,{ categories }) => categories,
  category: (parent, { id }, { categories }) => {
    return categories.find((category) => category.id === id);
  },
}