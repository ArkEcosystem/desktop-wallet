import { Contact, ContactAddress } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";

type ContactListItemProps = {
	contact: Contact;
	onAction?: any;
};

export const ContactListItem = ({ contact, onAction }: ContactListItemProps) => {
	const onDropdownAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	const options = [
		{ label: "Send", value: "send" },
		{ label: "Edit", value: "edit" },
		{ label: "Delete", value: "send" },
	];

	return (
		<>
			{contact.addresses().map(({ address, avatar, coin, network }: ContactAddress, index: number) => (
				<tr key={index}>
					<td
						className={`text-center ${
							index === contact.addresses().length - 1
								? "border-b border-dashed border-theme-neutral-200"
								: ""
						}`}
					>
						{index === 0 && (
							<div className="flex items-center space-x-3">
								<Circle className="bg-theme-primary-600 border-theme-primary-600">
									<span className="text-sm text-theme-background">{contact.name().slice(0, 2)}</span>
								</Circle>
								<span className="font-semibold">{contact.name()}</span>
							</div>
						)}
					</td>
					<td
						className={`text-center ${
							index === contact.addresses().length - 1
								? "border-b border-dashed border-theme-neutral-200"
								: ""
						}`}
					>
						<Circle className={`border-${coin.toLowerCase()}-${network.toLowerCase()}`}>
							<Icon name={coin} className={`text-${coin.toLowerCase()}-${network.toLowerCase()}`} />
						</Circle>
					</td>
					<td className="py-6 border-b border-dashed border-theme-neutral-200">
						<div className="flex items-center space-x-3">
							<Circle avatarId={avatar} />
							<Address address={address} maxChars={null} />
						</div>
					</td>
					<td className="text-sm font-bold text-center border-b border-dashed border-theme-neutral-200 space-x-2">
						<span>TODO</span>
					</td>
					{/*
          {typeIcons && (
            <td className="text-sm font-bold text-center border-b border-dashed border-theme-neutral-200 space-x-2">
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
