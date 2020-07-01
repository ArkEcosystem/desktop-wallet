import { fireEvent, render } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import React from "react";

import { LayoutControls } from "./LayoutControls";

describe("LayoutControls", () => {
  it("should render", () => {
    const { asFragment, getByTestId } = render(<LayoutControls />);

    expect(getByTestId("LayoutControls__grid")).toBeTruthy();
    expect(getByTestId("LayoutControls__list")).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it.each([
    ["onSelectGridView", "LayoutControls__grid--icon"],
    ["onSelectListView", "LayoutControls__list--icon"],
  ])("should call %s callback if provided", (callback, el) => {
    const fn = jest.fn();

    const { getByTestId } = render(<LayoutControls { ...{ [callback]: fn } } />);

    act(() => {
      fireEvent.click(getByTestId(el));
    });

    expect(fn).toBeCalled();
  });

  it.each([
    ["onSelectGridView", "LayoutControls__grid--icon"],
    ["onSelectListView", "LayoutControls__list--icon"],
  ])("should not call %s callback if not provided", (callback, el) => {
    const fn = jest.fn();

    const { getByTestId } = render(<LayoutControls />);

    act(() => {
      fireEvent.click(getByTestId(el));
    });

    expect(fn).not.toBeCalled();
  });
});
