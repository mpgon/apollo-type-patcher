import addTypename from "../addTypename";
import mockUser from "../__mocks__/user";

export const testUser = (user: any) => {
  expect(user.address.__typename).toBe("Address");
  expect(user.cart.__typename).toBe("Cart");
  user.cart.products.forEach((r: any) => {
    expect(r.__typename).toBe("Product");
  });
};

describe("addTypename", () => {
  it("should corretly add __typename", () => {
    const user = mockUser();

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
