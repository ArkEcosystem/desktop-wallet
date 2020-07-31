import Tippy from "@tippyjs/react";
import { ContactAddress } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";
import { useTranslation } from "react-i18next";

import { ContactListItemProps, Option } from "./ContactListItem.models";

export const ContactListItem = ({ contact, variant, onAction, options }: ContactListItemProps) => {
	const { t } = useTranslation();

	// TODO: add "Delegate", "Business", "Bridgechain"
	const walletTypes: string[] = [];

	const isCondensed = () => variant === "condensed";

	return (
		<>
			{contact
				.addresses()
				.values()
				.map((address: ContactAddress, index: number) => (
					<tr key={index}>
						<td
							className={`text-center ${
								index === contact.addresses().count() - 1
									? "border-b border-dashed border-theme-neutral-200"
									: ""
							}`}
						>
							{index === 0 && (
								<div className="flex items-center space-x-3">
									<Circle className="bg-theme-primary border-theme-primary">
										<span className="text-sm text-theme-background">
											{contact.name().slice(0, 2)}
										</span>
									</Circle>
									<span className="font-semibold">{contact.name()}</span>
								</div>
							)}
						</td>
						<td
							className={`text-center ${
								index === contact.addresses().count() - 1
									? "border-b border-dashed border-theme-neutral-200"
									: ""
							}`}
						>
							<NetworkIcon coin={address.coin()} network={address.network()} />
						</td>
						<td className="py-6 border-b border-dashed border-theme-neutral-200">
							<div className="flex items-center space-x-3">
								<Avatar address={address.address()} />
								<Address address={address.address()} maxChars={isCondensed() ? 24 : undefined} />
							</div>
						</td>
						{!isCondensed() && (
							<td className="text-sm font-bold text-center border-b border-dashed border-theme-neutral-200 space-x-2">
								{walletTypes.map((type: string) =>
									// @ts-ignore
									address[`is${type}`]() ? (
										<Tippy key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
											<Circle className="border-black">
												<Icon name={type} width={25} height={25} />
											</Circle>
										</Tippy>
									) : null,
								)}
							</td>
						)}
						<td className="border-b border-dashed border-theme-neutral-200">
							{index === 0 && options && options.length > 1 && (
								<Dropdown
									toggleContent={
										<div className="float-right">
											<Button variant="plain" size="icon">
												<Icon name="Settings" width={20} height={20} />
											</Button>
										</div>
									}
									options={options}
									onSelect={(action: Option) => onAction?.(action, address)}
								/>
							)}

							{index === 0 && options && options.length === 1 && (
								<Button
									data-testid={`ContactListItem__one-option-button-${index}`}
									className="float-right"
									variant="plain"
									onClick={() => onAction?.(options[0], address)}
								>
									{options[0]?.label}
								</Button>
							)}
						</td>
					</tr>
				))}
		</>
	);
};

ContactListItem.defaultProps = {
	options: [
		{ label: "Send", value: "send" },
		{ label: "Edit", value: "edit" },
		{ label: "Delete", value: "send" },
	],
};
