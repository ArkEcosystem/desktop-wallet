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

export const ContactListItem = ({ contact, variant, type, onAction, options }: ContactListItemProps) => {
	const { t } = useTranslation();

	// TODO: add "Business", "Bridgechain"
	const contactTypes: string[] = ["Delegate"];

	const isCondensed = () => variant === "condensed";

	const renderWalletRow = (contact: any) => (
		<TableRow key={contact.id()} border>
			<TableCell variant="start" className="w-1">
				<div className="mr-4">
					<AvatarWrapper data-testid="ContactListItem__user--avatar" size="lg" noShadow>
						<img
							src={`data:image/svg+xml;utf8,${contact.avatar()}`}
							title={contact.alias()}
							alt={contact.alias()}
						/>
						<span className="absolute text-sm font-semibold text-theme-background">
							{contact.alias().slice(0, 2).toUpperCase()}
						</span>
					</AvatarWrapper>
				</div>
			</TableCell>

			<TableCell>
				<span className="font-semibold" data-testid="ContactListItem__name">
					{contact.alias()}
				</span>
			</TableCell>

			<TableCell innerClassName="justify-center">
				<NetworkIcon coin={contact.coinId()} network={contact.networkId()} size="lg" noShadow />
			</TableCell>

			<TableCell className={`w-1`}>
				<Avatar className="mr-4" address={contact.address()} size="lg" noShadow />
			</TableCell>

			<TableCell className="">
				<Address address={contact.address()} maxChars={24} />
			</TableCell>

			{!isCondensed() && (
				<TableCell className={""} innerClassName="space-x-2 text-sm font-bold justify-center">
					{contact.hasSyncedWithNetwork() &&
						contactTypes.map(
							(type: string) =>
								// @ts-ignore
								contact[`is${type}`]() && (
									<Tippy key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
										<Circle className="border-black" noShadow>
											<Icon name={type} width={25} height={25} />
										</Circle>
									</Tippy>
								),
						)}
				</TableCell>
			)}

			<TableCell
				variant="end"
				className="border-b border-dashed border-theme-neutral-200"
				innerClassName="justify-end"
			>
				<Button
					data-testid={`ContactListItem__one-option-button-${contact.id()}`}
					className="float-right"
					variant="plain"
					onClick={() => onAction?.(options[0], contact.address())}
				>
					{options[0]?.label}
				</Button>
			</TableCell>
		</TableRow>
	);

	if (type === "wallet") {
		return renderWalletRow(contact);
	}

	return (
		<>
			{contact
				.addresses()
				.values()
				.map((address: ContactAddress, index: number) => {
					const borderClasses = () =>
						index !== 0 && index !== contact.addresses().count() - 1
							? "border-b border-dashed border-theme-neutral-200"
							: "";

					return (
						<TableRow key={index} border={index === 0 || index === contact.addresses().count() - 1}>
							<TableCell variant="start" className="w-1">
								{index === 0 && (
									<div className="mr-4">
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
									</div>
								)}
							</TableCell>

							<TableCell>
								{index === 0 && (
									<span className="font-semibold" data-testid="ContactListItem__name">
										{contact.name()}
									</span>
								)}
							</TableCell>

							<TableCell innerClassName="justify-center">
								<NetworkIcon coin={address.coin()} network={address.network()} size="lg" noShadow />
							</TableCell>

							<TableCell
								className={`w-1 ${borderClasses()}
								`}
							>
								<Avatar className="mr-4" address={address.address()} size="lg" noShadow />
							</TableCell>

							<TableCell className={borderClasses()}>
								<Address address={address.address()} maxChars={isCondensed() ? 24 : undefined} />
							</TableCell>

							{!isCondensed() && (
								<TableCell
									className={borderClasses()}
									innerClassName="space-x-2 text-sm font-bold justify-center"
								>
									{address.hasSyncedWithNetwork() &&
										contactTypes.map(
											(type: string) =>
												// @ts-ignore
												address[`is${type}`]() && (
													<Tippy key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
														<Circle className="border-black" noShadow>
															<Icon name={type} width={25} height={25} />
														</Circle>
													</Tippy>
												),
										)}
								</TableCell>
							)}

							<TableCell variant="end" className={borderClasses()} innerClassName="justify-end">
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
										onSelect={(action: Option) => onAction?.(action, address.address())}
									/>
								)}

								{index === 0 && options?.length === 1 && (
									<Button
										data-testid={`ContactListItem__one-option-button-${index}`}
										className="float-right"
										variant="plain"
										onClick={() => onAction?.(options[0], address.address())}
									>
										{options[0]?.label}
									</Button>
								)}
							</TableCell>
						</TableRow>
					);
				})}
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
