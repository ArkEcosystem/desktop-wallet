import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { SearchAddress } from "domains/profile/components/SearchAddress";
import React, { useEffect, useState } from "react";

import { SelectAddressWrapper } from "./SelectAddress.styles";

type SelectAddressProps = {
	address?: string;
	isVerified?: boolean;
	wallets: Wallet[];
	disabled?: boolean;
	isInvalid?: boolean;
	contactSearchTitle?: string;
	contactSearchDescription?: string;
	selectActionLabel?: string;
	onChange?: (address: string) => void;
} & React.InputHTMLAttributes<any>;

const ProfileAvatar = ({ address }: any) => {
	if (!address) return <Circle className="mx-4 bg-theme-neutral-200 border-theme-neutral-200" size="sm" noShadow />;
	return <Avatar address={address} size="sm" className="mx-4" noShadow />;
};

export const SelectAddress = React.forwardRef<HTMLInputElement, SelectAddressProps>(
	(
		{
			contactSearchTitle,
			contactSearchDescription,
			address,
			wallets,
			disabled,
			isInvalid,
			onChange,
			isVerified,
		}: SelectAddressProps,
		ref,
	) => {
		const [isContactSearchOpen, setIsContactSearchOpen] = useState(false);
		const [selectedAddress, setSelectedAddress] = useState(address);
		useEffect(() => setSelectedAddress(address), [address]);

		const fieldContext = useFormField();
		const isInvalidField = fieldContext?.isInvalid || isInvalid;

		const onSelectProfile = (address: any) => {
			setSelectedAddress(address);
			setIsContactSearchOpen(false);
			onChange?.(address);
		};

		const openContacts = () => {
			if (disabled) return;
			setIsContactSearchOpen(true);
		};

		return (
			<div>
				<SelectAddressWrapper
					data-testid="SelectAddress__wrapper"
					className={`SelectAddress ${disabled ? "is-disabled" : ""} ${isInvalidField ? "is-invalid" : ""}`}
					type="button"
					onClick={openContacts}
					disabled={disabled}
				>
					<ProfileAvatar address={selectedAddress} />
					<Address maxChars={30} address={selectedAddress} />
					<div className="absolute flex items-center right-4 space-x-3">
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
					type="text"
					ref={ref}
					value={selectedAddress || ""}
					className="hidden"
					readOnly
					isInvalid={isInvalidField}
				/>

				<SearchAddress
					title={contactSearchTitle}
					description={contactSearchDescription}
					isOpen={isContactSearchOpen}
					wallets={wallets}
					onAction={(_, address: any) => onSelectProfile(address)}
					onClose={() => setIsContactSearchOpen(false)}
				/>
			</div>
		);
	},
);

SelectAddress.defaultProps = {
	contactSearchTitle: "Select sender",
	contactSearchDescription: "Find and select the sender from your wallets",
};

SelectAddress.displayName = "SelectAddress";
