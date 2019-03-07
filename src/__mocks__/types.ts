export default {
  User: {
    address: "Address",
    __nested: {
      cart: "Cart",
    },
  },
  Cart: {
    __nested: {
      products: "Product",
    },
  },
  Product: {
    department: "Department",
  },
};
