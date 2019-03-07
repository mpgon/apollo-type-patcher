import typePatcher from "../index";
import mockUser from "../__mocks__/user";
import mockTypes from "../__mocks__/types";
import { testUser } from "./addTypename";

describe("typePatcher factory", () => {
  it("should corretly add __typename", () => {
    const patcher = typePatcher(mockTypes);

    const user = mockUser();

    patcher.User(user);

    testUser(user);
  });
});
