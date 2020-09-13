import { ContactAddress } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { AvatarWrapper } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";
import { useTranslation } from "react-i18next";

import { ContactListItemProps, Option } from "./ContactListItem.models";

export const ContactListItem = ({ contact, variant, onAction, options }: ContactListItemProps) => {
	const { t } = useTranslation();

	// TODO: add "Business", "Bridgechain"
	const walletTypes: string[] = ["Delegate"];

	const isCondensed = () => variant === "condensed";

	return (
		<>
			{contact
				.addresses()
				.values()
				.map((address: ContactAddress, index: number) => (
					<TableRow key={index} border={index === 0 || index === contact.addresses().count() - 1}>
						<TableCell variant="start">
							{index === 0 && (
								<div className="flex items-center space-x-3">
									<AvatarWrapper data-testid="ContactListItem__user--avatar" size="lg" noShadow>
										<img
											src={`data:image/svg+xml;utf8,${contact.avatar()}`}
											title={contact.name()}
											alt={contact.name()}
										/>
										<span className="absolute text-sm font-semibold text-theme-background">
											{contact.name().slice(0, 2).toUpperCase()}
										</span>
									</AvatarWrapper>

									<span className="font-semibold" data-testid="ContactListItem__name">
										{contact.name()}
									</span>
								</div>
							)}
						</TableCell>

						<TableCell innerClassName="justify-center">
							<NetworkIcon
								coin={address.coin()}
								network={address.network()}
								size="lg"
								iconSize={20}
								noShadow
							/>
						</TableCell>

						<TableCell
							className={
								index !== 0 && index !== contact.addresses().count() - 1
									? "border-b border-dashed border-theme-neutral-200"
									: ""
							}
						>
							<div className="flex items-center space-x-3">
								<Avatar address={address.address()} size="lg" noShadow />
								<Address address={address.address()} maxChars={isCondensed() ? 24 : undefined} />
							</div>
						</TableCell>

						{!isCondensed() && (
							<TableCell
								innerClassName={`space-x-2 text-sm font-bold text-center ${
									index !== 0 && index !== contact.addresses().count() - 1
										? "border-b border-dashed border-theme-neutral-200"
										: ""
								}`}
							>
								{address.hasSyncedWithNetwork() &&
									walletTypes.map((type: string) =>
										// @ts-ignore
										address[`is${type}`]() ? (
											<Tippy key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
												<Circle className="border-black" noShadow>
													<Icon name={type} width={25} height={25} />
												</Circle>
											</Tippy>
										) : null,
									)}
							</TableCell>
						)}

						<TableCell
							variant="end"
							innerClassName={`justify-end ${
								index !== 0 && index !== contact.addresses().count() - 1
									? "border-b border-dashed border-theme-neutral-200"
									: ""
							}`}
						>
							{index === 0 && options?.length > 1 && (
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

							{index === 0 && options?.length === 1 && (
								<Button
									data-testid={`ContactListItem__one-option-button-${index}`}
									className="float-right"
									variant="plain"
									onClick={() => onAction?.(options[0], address)}
								>
									{options[0]?.label}
								</Button>
							)}
						</TableCell>
					</TableRow>
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
