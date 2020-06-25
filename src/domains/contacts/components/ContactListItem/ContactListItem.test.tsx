import { Contact } from "@arkecosystem/platform-sdk-profiles";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import { ContactListItem } from "./ContactListItem";

describe("ContactListItem", () => {
  const contact = new Contact(
    {
      id: "olebank",
      name: "OLEBank",
      starred: false,
      addresses: [
        { coin: "Ark", network: "mainnet", address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" },
      ],
    },
  );

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

    const { getByTestId } = render(
      <table>
        <tbody>
          <ContactListItem contact={contact} onAction={onAction} />
        </tbody>
      </table>
    );

    act(() => {
      fireEvent.click(getByTestId("dropdown__toggle"));
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

    const { getByTestId } = render(
      <table>
        <tbody>
          <ContactListItem contact={contact} />
        </tbody>
      </table>
    );

    act(() => {
      fireEvent.click(getByTestId("dropdown__toggle"));
    });

    act(() => {
      fireEvent.click(getByTestId("dropdown__option--0"));
    });

    expect(onAction).not.toHaveBeenCalled();
  });
});
