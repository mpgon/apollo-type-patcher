/* eslint-disable no-underscore-dangle */
const CACHE_TYPES: { [key: string]: any } = {
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

import addTypename from "./addTypename";
import typePatcher from "./index";

const getUser = (): any => ({
  id: 1,
  address: {
    lat: 50,
    lng: 50,
  },
  cart: {
    id: 1,
    // TODO: add nested types w/ de-normalized data in the middle
    products: [
      { id: 1, name: "product 1" },
      { id: 2, name: "product 2" },
      { id: 3, name: "product 3" },
    ],
  },
});

const testUser = (user: any) => {
  expect(user.address.__typename).toBe("Address");
  expect(user.cart.__typename).toBe("Cart");
  user.cart.products.forEach((r: any) => {
    expect(r.__typename).toBe("Product");
  });
};

describe("add typename property", () => {
  describe("addTypename", () => {
    it("should corretly add __typename", () => {
      const user = getUser();

      addTypename(user, "address", "Address");
      addTypename(user, "cart", "Cart");
      addTypename(user, "cart.products", "Product");

      testUser(user);
    });
    it("should not add __typename if prop doesn't exist", () => {
      const user: any = {
        id: 1,
      };
      addTypename(user, "cart", "Cart");
      expect(user.cart).toBe(undefined);
    });
  });
  describe("typePatcher factory", () => {
    it("should corretly add __typename", () => {
      const patcher = typePatcher(CACHE_TYPES);

      const user = getUser();

      patcher.User(user);

      testUser(user);
    });
  });
});
