import { Contact } from "@arkecosystem/platform-sdk-profiles";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
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
  ])("should open & close add contact modal", async (button) => {
    const { asFragment, getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <Contacts contacts={[]} />
      </I18nextProvider>,
    );

    fireEvent.click(getByTestId("contacts__add-contact-btn"));

    expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
    expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

    if (button === "contact-form__save-btn") {
      await act(async () => {
        await fireEvent.change(getByTestId("contact-form__name-input"), {
          target: { value: "name" },
        });
      });

      await act(async () => {
        await fireEvent.change(getByTestId("contact-form__network-select"), {
          target: { value: "ark" },
        });
      });

      await act(async () => {
        await fireEvent.change(getByTestId("contact-form__address-input"), {
          target: { value: "address" },
        });
      });

      await act(async () => {
        await fireEvent.click(getByTestId("contact-form__add-address-btn"));
      });
    }

    fireEvent.click(getByTestId(button));

    await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));

    expect(asFragment()).toMatchSnapshot();
  });
});
