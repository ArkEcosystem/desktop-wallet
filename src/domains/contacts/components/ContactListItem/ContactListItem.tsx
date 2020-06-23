import { Contact, ContactAddress } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";

type ContactListItemProps = {
  contact: Contact;
  actions?: any;
  onAction?: any;
};

export const ContactListItem = ({
  contact,
  actions,
  onAction,
}: ContactListItemProps) => {
  const onDropdownAction = (action: any) => {
    if (typeof onAction === "function") onAction(action);
  };

  return (
    <>
      {contact.addresses().map(({ address, avatar, coin, network }: ContactAddress, index: number) => (
        <tr key={index}>
          <td className={`text-center ${index === contact.addresses().length - 1 ? "border-b border-dashed border-theme-neutral-200" : ""}`}>
            {index === 0 && (
              <div className="flex items-center space-x-3">
                <Circle>
                  <span className="text-sm font-semibold">
                    {contact.name().slice(0, 2)}
                  </span>
                </Circle>
                <span className="font-semibold">{contact.name()}</span>
              </div>
            )}
          </td>
          <td className={`text-center ${index === contact.addresses().length - 1 ? "border-b border-dashed border-theme-neutral-200" : ""}`}>
            <Circle className={`border-${coin}-${network}`}>
              <Icon name={coin} className={`text-${coin}-${network}`} />
            </Circle>
          </td>
          <td className="py-6 border-b border-dashed border-theme-neutral-200">
            <div className="flex items-center space-x-3">
              <Circle avatarId={avatar} />
              <Address address={address} maxChars={0} />
            </div>
          </td>
          <td className="text-center text-sm font-bold border-b border-dashed border-theme-neutral-200 space-x-2">
            <span>TODO</span>
          </td>
          {/*
          {typeIcons && (
            <td className="text-center text-sm font-bold border-b border-dashed border-theme-neutral-200 space-x-2">
              {typeIcons.map((type: string, index: number) => {
                return (
                  <div key={index} className="inline-block">
                    <Icon name={type} />
                  </div>
                );
              })}
            </td>
          )}
          */}
          <td className="border-b border-dashed border-theme-neutral-200">
            {actions && actions.length && (
              <Dropdown
                toggleContent={
                  <div className="float-right">
                    <Button variant="plain" size="icon">
                      <Icon name="Settings" width={20} height={20} />
                    </Button>
                  </div>
                }
                options={actions}
                onSelect={onDropdownAction}
              />
            )}
          </td>
        </tr>
      ))}
    </>
  );
};
