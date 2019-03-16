export default function mockUser() {
  return {
    id: 1,
    address: {
      lat: 50,
      lng: 50
    },
    cart: {
      id: 1,
      products: [
        { id: 1, name: "product 1" },
        { id: 2, name: "product 2" },
        { id: 3, name: "product 3" }
      ]
    }
  };
}
