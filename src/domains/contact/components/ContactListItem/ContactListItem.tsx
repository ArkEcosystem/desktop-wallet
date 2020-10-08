import { ContactAddress, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { AvatarWrapper } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { ContactListItemProps, Option } from "./ContactListItem.models";

export const ContactListItem = ({ item, variant, type, onAction, options }: ContactListItemProps) => {
	const { t } = useTranslation();

	// TODO: add "Business", "Bridgechain"
	const contactTypes: string[] = ["Delegate"];

	const isCondensed = () => variant === "condensed";

	const renderWalletRow = (wallet: ReadWriteWallet) => (
		<TableRow key={wallet.id()} border>
			<TableCell variant="start" className="w-1">
				<div className="mr-4">
					<AvatarWrapper data-testid="ContactListItem__user--avatar" size="lg" noShadow>
						<img
							src={`data:image/svg+xml;utf8,${wallet.avatar()}`}
							title={wallet.alias()}
							alt={wallet.alias()}
						/>
						{wallet && wallet.alias && (
							<span className="absolute text-sm font-semibold text-theme-background">
								{wallet?.alias()?.slice(0, 2)?.toUpperCase()}
							</span>
						)}
					</AvatarWrapper>
				</div>
			</TableCell>

			<TableCell className="">
				<Address address={wallet.address()} maxChars={24} />
			</TableCell>

			<TableCell>
				<span data-testid="ContactListItem__name">{wallet.alias()}</span>
			</TableCell>

			<TableCell>
				<span data-testid="ContactListItem__type">{t("COMMON.MY_WALLET")}</span>
			</TableCell>

			{!isCondensed() && (
				<TableCell className={""} innerClassName="space-x-2 text-sm font-bold justify-center">
					{wallet.hasSyncedWithNetwork() &&
						contactTypes.map(
							(type: string) =>
								// @ts-ignore
								wallet[`is${type}`]() && (
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
					data-testid={`ContactListItem__one-option-button-${wallet.id()}`}
					className="float-right"
					variant="plain"
					onClick={() => onAction?.(options[0], wallet.address())}
				>
					{options[0]?.label}
				</Button>
			</TableCell>
		</TableRow>
	);

	if (type === "wallet") {
		return renderWalletRow(item);
	}

	return (
		<>
			{item
				.addresses()
				.values()
				.map((address: ContactAddress, index: number) => {
					const borderClasses = () =>
						index !== 0 && index !== item.addresses().count() - 1
							? "border-b border-dashed border-theme-neutral-200"
							: "";

					return (
						<TableRow key={index} border={index === 0 || index === item.addresses().count() - 1}>
							<TableCell variant="start" className="w-1">
								<div className="mr-4">
									<AvatarWrapper data-testid="ContactListItem__user--avatar" size="lg" noShadow>
										<img
											src={`data:image/svg+xml;utf8,${item.avatar()}`}
											title={item.name()}
											alt={item.name()}
										/>
										<span className="absolute text-sm font-semibold text-theme-background">
											{item.name().slice(0, 2).toUpperCase()}
										</span>
									</AvatarWrapper>
								</div>
							</TableCell>

							<TableCell className={borderClasses()}>
								<Address address={address.address()} maxChars={isCondensed() ? 24 : undefined} />
							</TableCell>

							<TableCell>
								<span data-testid="ContactListItem__name">{item.name()}</span>
							</TableCell>

							<TableCell>
								<span data-testid="ContactListItem__type">{t("COMMON.CONTACT")}</span>
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
								{options?.length > 1 && (
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

								{options?.length === 1 && (
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
