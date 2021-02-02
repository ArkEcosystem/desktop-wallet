import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { SearchWallet } from "domains/wallet/components/SearchWallet";
import { SelectedWallet } from "domains/wallet/components/SearchWallet/SearchWallet.models";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SelectAddressWrapper } from "./SelectAddress.styles";

type SelectAddressProps = {
	address?: string;
	wallets: ReadWriteWallet[];
	disabled?: boolean;
	isInvalid?: boolean;
	isVerified?: boolean;
	onChange?: (address: string) => void;
} & React.InputHTMLAttributes<any>;

const ProfileAvatar = ({ address }: any) => {
	if (!address) {
		return (
			<Circle
				className="mr-3 ml-4 bg-theme-secondary-200 dark:bg-theme-secondary-700 border-theme-secondary-200 dark:border-theme-secondary-700"
				size="sm"
				noShadow
			/>
		);
	}
	return <Avatar address={address} size="sm" className="mx-4" noShadow />;
};

export const SelectAddress = React.forwardRef<HTMLInputElement, SelectAddressProps>(
	({ address, wallets, disabled, isInvalid, isVerified, onChange }: SelectAddressProps, ref) => {
		const [searchWalletIsOpen, setSearchWalletIsOpen] = useState(false);
		const [selectedAddress, setSelectedAddress] = useState(address);

		useEffect(() => setSelectedAddress(address), [address]);

		const fieldContext = useFormField();
		const isInvalidField = fieldContext?.isInvalid || isInvalid;

		const { t } = useTranslation();

		const handleSelectWallet = ({ address }: SelectedWallet) => {
			setSelectedAddress(address);
			setSearchWalletIsOpen(false);
			onChange?.(address);
		};

		return (
			<div>
				<SelectAddressWrapper
					data-testid="SelectAddress__wrapper"
					className={`SelectAddress ${disabled ? "is-disabled" : ""} ${isInvalidField ? "is-invalid" : ""}`}
					type="button"
					onClick={() => setSearchWalletIsOpen(true)}
					disabled={disabled}
				>
					<ProfileAvatar address={selectedAddress} />
					<Address maxChars={30} address={selectedAddress} />
					<div className="flex absolute right-4 items-center space-x-3 text-theme-primary-300 dark:text-theme-secondary-600">
						{isVerified && (
							<div className="rounded-full text-theme-success-400 bg-theme-success-100">
								<Icon name="Checkmark" width={18} height={18} />
							</div>
						)}
						<Icon name="User" width={20} height={20} />
					</div>
				</SelectAddressWrapper>

				<Input
					data-testid="SelectAddress__input"
					ref={ref}
					value={selectedAddress || ""}
					className="hidden"
					readOnly
					isInvalid={isInvalidField}
				/>

				<SearchWallet
					isOpen={searchWalletIsOpen}
					title={t("PROFILE.MODAL_SELECT_SENDER.TITLE")}
					description={t("PROFILE.MODAL_SELECT_SENDER.DESCRIPTION")}
					searchPlaceholder={t("PROFILE.MODAL_SELECT_SENDER.SEARCH_PLACEHOLDER")}
					wallets={wallets}
					size="4xl"
					showFiatValue={false}
					showNetwork={false}
					onSelectWallet={handleSelectWallet}
					onClose={() => setSearchWalletIsOpen(false)}
				/>
			</div>
		);
	},
);

SelectAddress.displayName = "SelectAddress";
