import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { SearchRecipient } from "domains/transaction/components/SearchRecipient";
import React, { useEffect, useState } from "react";

type SelectRecipientProps = {
	address?: string;
	profile: Profile;
	disabled?: boolean;
	isInvalid?: boolean;
	contactSearchTitle?: string;
	contactSearchDescription?: string;
	selectActionLabel?: string;
	onChange?: (address: string) => void;
} & Omit<React.InputHTMLAttributes<any>, "onChange">;

const ProfileAvatar = ({ address }: any) => {
	if (!address) {
		return (
			<Circle
				className="mx-3 bg-theme-secondary-200 dark:bg-theme-secondary-700 border-theme-secondary-200 dark:border-theme-secondary-700"
				size="sm"
				noShadow
			/>
		);
	}
	return <Avatar address={address} size="sm" className="mx-3" noShadow />;
};

export const SelectRecipient = React.forwardRef<HTMLInputElement, SelectRecipientProps>(
	({ address, profile, disabled, isInvalid, onChange }: SelectRecipientProps, ref) => {
		const [isRecipientSearchOpen, setIsRecipientSearchOpen] = useState(false);
		const [selectedAddress, setSelectedAddress] = useState("");

		useEffect(() => {
			if (address) {
				setSelectedAddress(address);
			}
		}, [address, setSelectedAddress]);

		const handleSelectAddress = (address: string) => {
			setSelectedAddress(address);
			setIsRecipientSearchOpen(false);
			onChange?.(address);
		};

		const openRecipients = () => {
			if (disabled) {
				return;
			}
			setIsRecipientSearchOpen(true);
		};

		const onInputChange = (value: string) => {
			setSelectedAddress(value);
			onChange?.(value);
		};

		return (
			<div>
				<div data-testid="SelectRecipient__wrapper" className="flex relative items-center w-full text-left">
					<div className="absolute left-1">
						<ProfileAvatar address={selectedAddress} />
					</div>
					<Input
						className="pr-11 pl-14"
						data-testid="SelectRecipient__input"
						type="text"
						ref={ref}
						defaultValue={selectedAddress}
						onChange={(ev: any) => onInputChange(ev.target.value)}
						disabled={disabled}
						isInvalid={isInvalid}
					/>

					<div
						data-testid="SelectRecipient__select-recipient"
						className="flex absolute right-4 items-center space-x-3 cursor-pointer text-theme-primary-300 dark:text-theme-secondary-600"
						onClick={openRecipients}
					>
						<Icon name="User" width={20} height={20} />
					</div>
				</div>

				<SearchRecipient
					isOpen={isRecipientSearchOpen}
					profile={profile}
					onAction={(address: string) => handleSelectAddress(address)}
					onClose={() => setIsRecipientSearchOpen(false)}
				/>
			</div>
		);
	},
);

SelectRecipient.displayName = "SelectRecipient";
