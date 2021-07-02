import React from "react";
import { render, screen } from "testing-library";

import { StepNavigation } from "./StepNavigation";

describe("StepNavigation", () => {
  it("should not render back to wallet button if not on last step", () => {
    const { asFragment } = render(<StepNavigation activeIndex={1} size={2} />);

    expect(() => screen.getByTestId("StepNavigation__back-to-wallet-button")).toThrow();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render back to wallet button if on last step", () => {
    const { asFragment } = render(<StepNavigation activeIndex={1} size={1} />);

    expect(screen.getByTestId("StepNavigation__back-to-wallet-button")).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render back button if not on last step", () => {
    const { asFragment } = render(<StepNavigation activeIndex={1} size={2} />);

    expect(screen.getByTestId("StepNavigation__back-button")).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should not render back button if on last step", () => {
    const { asFragment } = render(<StepNavigation activeIndex={1} size={1} />);

    expect(() => screen.getByTestId("StepNavigation__back-button")).toThrow();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render continue button if not on last two steps", () => {
    const { asFragment } = render(<StepNavigation activeIndex={1} size={3} />);

    expect(screen.getByTestId("StepNavigation__continue-button")).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should not render continue button if on last two steps", () => {
    const { asFragment, rerender } = render(<StepNavigation activeIndex={1} size={2} />);

    expect(() => screen.getByTestId("StepNavigation__continue-button")).toThrow();
    expect(asFragment()).toMatchSnapshot();

    rerender(<StepNavigation activeIndex={2} size={2} />);

    expect(() => screen.getByTestId("StepNavigation__continue-button")).toThrow();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should disable buttons if loading", () => {
    const { asFragment, rerender } = render(<StepNavigation activeIndex={1} size={2} isLoading />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }

    expect(asFragment()).toMatchSnapshot();
  });
});
