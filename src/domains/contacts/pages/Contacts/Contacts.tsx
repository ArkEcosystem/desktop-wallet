import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import React from "react";
import { useTranslation } from "react-i18next";

type ContactsProps = {
  contacts?: any;
};

export const Contacts = ({ contacts }: ContactsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Header
        title={t("CONTACTS.CONTACTS_PAGE.TITLE")}
        subtitle={t("CONTACTS.CONTACTS_PAGE.TITLE")}
        extra={
          <div className="flex justify-end space-x-3">
            <Button>{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT")}</Button>
          </div>
        }
      />
    </>
  );
};

Contacts.defaultProps = {
  contacts: [],
};
