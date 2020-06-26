import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { contact1 as contact } from "../../data";
import { ContactListItem } from "./ContactListItem";

describe("ContactListItem", () => {
  it("should render", () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <ContactListItem contact={contact} />
        </tbody>
      </table>
    );

    expect(asFragment).toMatchSnapshot();
  });

  it("should call onAction callback if provided", () => {
    const onAction = jest.fn();

    const options = [
      { label: "Option 1", value: "1" },
    ];

    const { getAllByTestId, getByTestId } = render(
      <table>
        <tbody>
          <ContactListItem contact={contact} onAction={onAction} />
        </tbody>
      </table>
    );

    act(() => {
      fireEvent.click(getAllByTestId("dropdown__toggle")[0]);
    });

    act(() => {
      fireEvent.click(getByTestId("dropdown__option--0"));
    });

    expect(onAction).toHaveBeenCalled();
  });

  it("should not call onAction callback if not provided", () => {
    const onAction = jest.fn();

    const options = [
      { label: "Option 1", value: "1" },
    ];

    const { getAllByTestId, getByTestId } = render(
      <table>
        <tbody>
          <ContactListItem contact={contact} />
        </tbody>
      </table>
    );

    act(() => {
      fireEvent.click(getAllByTestId("dropdown__toggle")[0]);
    });

    act(() => {
      fireEvent.click(getByTestId("dropdown__option--0"));
    });

    expect(onAction).not.toHaveBeenCalled();
  });
});
