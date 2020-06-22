import { render } from "@testing-library/react";
import React from "react";

import { HeaderSearchBar } from "./HeaderSearchBar";

describe("HeaderSearchBar", () => {
  it("should render", () => {
    const { asFragment, getByTestId } = render(
      <HeaderSearchBar />
    );

    expect(getByTestId("header-search-bar__button")).toHaveTextContent("Search");
    expect(asFragment()).toMatchSnapshot();
  });
});
