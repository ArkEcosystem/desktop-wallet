import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";

type ContactListItemProps = {
  contact: any;
  variant?: "condensed";
  onAction?: any;
};

export const ContactListItem = ({
  contact,
  variant,
  onAction,
}: ContactListItemProps) => {
  const onDropdownAction = (action: any) => {
    if (typeof onAction === "function") onAction(action);
  };

  const options = [
    { label: "Send", value: "send" },
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "send" },
  ];

  const isCondensed = () => {
    return variant === "condensed";
  };

  return (
    <>
      {contact.addresses().map((address: any, index: number) => (
        <tr key={index}>
          <td className={`text-center ${index === contact.addresses().length - 1 ? "border-b border-dashed border-theme-neutral-200" : ""}`}>
            {index === 0 && (
              <div className="flex items-center space-x-3">
                <Circle className="bg-theme-primary-600 border-theme-primary-600">
                  <span className="text-sm text-theme-background">
                    {contact.name().slice(0, 2)}
                  </span>
                </Circle>
                <span className="font-semibold">{contact.name()}</span>
              </div>
            )}
          </td>
          <td className={`text-center ${index === contact.addresses().length - 1 ? "border-b border-dashed border-theme-neutral-200" : ""}`}>
            <Circle className={`border-${address.coin.toLowerCase()}-${address.network.toLowerCase()}`}>
              <Icon name={address.coin} className={`text-${address.coin.toLowerCase()}-${address.network.toLowerCase()}`} />
            </Circle>
          </td>
          <td className="py-6 border-b border-dashed border-theme-neutral-200">
            <div className="flex items-center space-x-3">
              <Circle avatarId={address.avatar} />
              <Address address={address.address} maxChars={isCondensed() ? 24 : null} />
            </div>
          </td>
          {!isCondensed() && (
            <td className="text-sm font-bold text-center border-b border-dashed border-theme-neutral-200 space-x-2">
              {["Delegate", "Business", "Bridgechain"].map((type: string) => {
                return address[`is${type}`]()
                  ? <Circle key={type} className="border-black">
                    <Icon name={type} width={25} height={25} />
                  </Circle>
                  : null;
              })}
            </td>
          )}
          <td className="border-b border-dashed border-theme-neutral-200">
            {options && options.length && (
              <Dropdown
                toggleContent={
                  <div className="float-right">
                    <Button variant="plain" size="icon">
                      <Icon name="Settings" width={20} height={20} />
                    </Button>
                  </div>
                }
                options={options}
                onSelect={onDropdownAction}
              />
            )}
          </td>
        </tr>
      ))}
    </>
  );
};
