import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { SearchContact } from "domains/contact/components/SearchContact";
import React, { useEffect, useState } from "react";

type SelectRecipientProps = {
	address?: string;
	profile: Profile;
	disabled?: boolean;
	isInvalid?: boolean;
	contactSearchTitle?: string;
	contactSearchDescription?: string;
	selectActionLabel?: string;
	onChange?: (params: any) => void;
} & Omit<React.InputHTMLAttributes<any>, "onChange">;

const ProfileAvatar = ({ address }: any) => {
	if (!address)
		return (
			<Circle
				className="mx-3 bg-theme-neutral-200 border-theme-neutral-300 dark:border-theme-neutral-800"
				size="sm"
				noShadow
			/>
		);
	return <Avatar address={address} size="sm" className="mx-3" noShadow />;
};

export const SelectRecipient = React.forwardRef<HTMLInputElement, SelectRecipientProps>(
	(
		{
			contactSearchTitle,
			contactSearchDescription,
			selectActionLabel,
			address,
			profile,
			disabled,
			isInvalid,
			onChange,
		}: SelectRecipientProps,
		ref,
	) => {
		const [isContactSearchOpen, setIsContactSearchOpen] = useState(false);
		const [selectedAddress, setSelectedAddress] = useState("");

		useEffect(() => {
			if (address) {
				setSelectedAddress(address);
			}
		}, [address, setSelectedAddress]);

		const onSelectProfile = (address: string) => {
			setSelectedAddress(address);
			setIsContactSearchOpen(false);
			onChange?.(address);
		};

		const openContacts = () => {
			if (disabled) return;
			setIsContactSearchOpen(true);
		};

		const onInputChange = (value: string) => {
			setSelectedAddress(value);
			onChange?.(value);
		};

		return (
			<div>
				<div data-testid="SelectRecipient__wrapper" className="relative flex items-center w-full text-left">
					<div className="absolute left-1">
						<ProfileAvatar address={selectedAddress} />
					</div>
					<Input
						className="pl-14 pr-11"
						data-testid="SelectRecipient__input"
						type="text"
						ref={ref}
						defaultValue={selectedAddress}
						onChange={(ev: any) => onInputChange(ev.target.value)}
						disabled={disabled}
						isInvalid={isInvalid}
					/>

					<div
						data-testid="SelectRecipient__select-contact"
						className="absolute flex items-center space-x-3 cursor-pointer right-4"
						onClick={openContacts}
					>
						<Icon name="User" width={20} height={20} />
					</div>
				</div>

				<SearchContact
					title={contactSearchTitle}
					description={contactSearchDescription}
					isOpen={isContactSearchOpen}
					profile={profile}
					options={[{ value: "select", label: selectActionLabel }]}
					onAction={(_, address: string) => onSelectProfile(address)}
					onClose={() => setIsContactSearchOpen(false)}
				/>
			</div>
		);
	},
);

SelectRecipient.defaultProps = {
	contactSearchTitle: "Recipient search",
	contactSearchDescription: "Find and select the recipient from your contacts",
	selectActionLabel: "Select",
};

SelectRecipient.displayName = "SelectRecipient";
