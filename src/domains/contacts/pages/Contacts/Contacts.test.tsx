import { Contact } from "@arkecosystem/platform-sdk-profiles";
import { act, fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { translations } from "../../i18n";
import { Contacts } from "./Contacts";

describe("Contacts", () => {
  it("should render", () => {
    const { asFragment, getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <Contacts contacts={[]} />
      </I18nextProvider>,
    );

    expect(getByTestId("contacts")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
    expect(getByTestId("contacts")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

    expect(getByTestId("contacts__banner")).toBeTruthy();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render with contacts", () => {
    const contacts = [
      new Contact(
        {
          id: "olebank",
          name: "OLEBank",
          starred: false,
          addresses: [
            { coin: "Ark", network: "mainnet", address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" },
            { coin: "Bitcoin", network: "mainnet", address: "15pyr1HRAxpq3x64duXav1csmyCtXXu9G8" },
          ],
        },
      ),
    ];

    const { asFragment, getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <Contacts contacts={contacts} />
      </I18nextProvider>,
    );

    expect(getByTestId("contacts")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
    expect(getByTestId("contacts")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

    expect(() => getByTestId("contacts__banner")).toThrow(/Unable to find an element by/);

    expect(asFragment()).toMatchSnapshot();
  });

  it.each([
    "modal__close-btn",
    "contact-form__cancel-btn",
    "contact-form__save-btn",
  ])("should open & close add contact modal", (button) => {
    const { asFragment, getByTestId, queryByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <Contacts contacts={[]} />
      </I18nextProvider>,
    );

    fireEvent.click(getByTestId("contacts__add-contact-btn"));

    if (button === "contacts__add-contact-btn") {
      expect(queryByTestId("contact-form__add-address-btn")).toHaveAttribute("disabled");

      act(() => {
        fireEvent.change(getByTestId("contact-form__name-input"), {
          target: { value: "name" },
        });

        fireEvent.change(getByTestId("contact-form__network-select"), {
          target: { value: "ark" },
        });

        fireEvent.change(getByTestId("contact-form__address-input"), {
          target: { value: "address" },
        });
      });

      expect(() => queryByTestId("contact-form__add-address-btn").not.toHaveAttribute("disabled"));

      act(() => {
        fireEvent.click(getByTestId("contact-form__add-address-btn"));
      });

      expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(1);

      expect(() => queryByTestId(button).not.toHaveAttribute("disabled"));
    }

    expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
    expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

    act(() => {
      fireEvent.click(getByTestId(button));
    });

    expect(() => queryByTestId("modal__inner").not.toBeInTheDocument());
  });
});
