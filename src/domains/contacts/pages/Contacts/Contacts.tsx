import { images } from "app/assets/images";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import React from "react";
import { useTranslation } from "react-i18next";

const { ContactsBanner } = images.contacts.pages.contacts;

type ContactsHeaderExtraProps = {
  onSearch?: any;
  onAddContact?: any;
};

const ContactsHeaderExtra = ({ onSearch, onAddContact }: ContactsHeaderExtraProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end items-center space-x-5">
      <Button className="whitespace-no-wrap">{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT")}</Button>
    </div>
  );
};

const ContactsTable = () => {
  return (
    <span>this gon be a table</span>
  )
};

type ContactsProps = {
  contacts?: any;
  onSearch?: any;
  onAddContact?: any;
};

export const Contacts = ({ contacts, onSearch, onAddContact }: ContactsProps) => {
  const { t } = useTranslation();

  const crumbs = [
    {
      route: "portfolio",
      label: "Go back to Portfolio",
    },
  ];

  return (
    <div className="flex flex-col -m-5 bg-theme-neutral-200 min-h-screen">
      <Breadcrumbs crumbs={crumbs} className="font-semibold p-10" />

      <div className="flex flex-col flex-1 space-y-10">
        <div className="bg-theme-background p-10">
          <Header
            title={t("CONTACTS.CONTACTS_PAGE.TITLE")}
            subtitle={t("CONTACTS.CONTACTS_PAGE.SUBTITLE")}
            extra={<ContactsHeaderExtra onSearch={onSearch} onAddContact={onAddContact} />}
          />
        </div>

        <div className="flex flex-1 bg-theme-background p-10">
          {contacts.length === 0 &&
            <div className="flex flex-col items-center justify-center">
              <ContactsBanner className="w-3/5 mb-8" />
              <span>Add your most frequent contacts for fast, easy payments</span>
            </div>
          }

          {contacts.length > 0 &&
            <ContactsTable contacts={contacts} />
          }
        </div>
      </div>
    </div>
  );
};

Contacts.defaultProps = {
  contacts: [],
};
