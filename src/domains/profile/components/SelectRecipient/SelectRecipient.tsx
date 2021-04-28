import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { Select } from "app/components/SelectDropdown";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import { useWalletAlias } from "app/hooks/use-wallet-alias";
import { useProfileAddresses } from "domains/profile/hooks/use-profile-addresses";
import { SearchRecipient } from "domains/transaction/components/SearchRecipient";
import React, { useEffect, useState } from "react";

type SelectRecipientProps = {
	network?: Coins.Network;
	address?: string;
	profile: Contracts.IProfile;
	disabled?: boolean;
	isInvalid?: boolean;
	contactSearchTitle?: string;
	contactSearchDescription?: string;
	placeholder?: string;
	onChange?: (address: string) => void;
} & Omit<React.InputHTMLAttributes<any>, "onChange">;

const ProfileAvatar = ({ address }: any) => {
	if (!address) {
		return (
			<Circle
				className="bg-theme-secondary-200 dark:bg-theme-secondary-700 border-theme-secondary-200 dark:border-theme-secondary-700"
				size="sm"
				noShadow
			/>
		);
	}
	return <Avatar address={address} size="sm" noShadow />;
};

const OptionLabel = ({ option, profile }: { option: any; profile: Contracts.IProfile }) => {
	const address = option.value;
	const alias = useWalletAlias({ address, profile });

	return (
		<div className="flex items-center space-x-2 overflow-hidden whitespace-nowrap">
			<Avatar size="sm" address={address} className="flex-shrink-0" noShadow />
			{alias ? (
				<div className="w-full flex items-center space-x-2">
					<div className="truncate font-medium" style={{ maxWidth: "17rem" }}>
						{alias}
					</div>
					<span>
						(<TruncateMiddle text={address} maxChars={16} className="pl-0" />)
					</span>
				</div>
			) : (
				<span>{address}</span>
			)}
		</div>
	);
};

export const SelectRecipient = React.forwardRef<HTMLInputElement, SelectRecipientProps>(
	({ address, profile, disabled, isInvalid, network, placeholder, onChange }: SelectRecipientProps, ref) => {
		const [isRecipientSearchOpen, setIsRecipientSearchOpen] = useState(false);
		const [selectedAddress, setSelectedAddress] = useState(address);
		const fieldContext = useFormField();

		const isInvalidValue = isInvalid || fieldContext?.isInvalid;

		useEffect(() => {
			if (address === selectedAddress) {
				return;
			}

			setSelectedAddress(address);
		}, [address, setSelectedAddress]); // eslint-disable-line react-hooks/exhaustive-deps

		const { allAddresses } = useProfileAddresses({ profile, network });
		const recipientAddresses = allAddresses.map(({ address }) => ({
			label: address,
			value: address,
		}));

		const handleSelectAddress = (changedAddress: string) => {
			if (selectedAddress === changedAddress) {
				return;
			}

			setSelectedAddress(changedAddress);
			setIsRecipientSearchOpen(false);
			onChange?.(changedAddress);
		};

		const openRecipients = () => {
			if (disabled) {
				return;
			}

			setIsRecipientSearchOpen(true);
		};

		const onInputChange = (changedAddress: string) => {
			if (selectedAddress === changedAddress) {
				return;
			}

			setSelectedAddress(changedAddress);
			onChange?.(changedAddress);
		};

		return (
			<div>
				<div data-testid="SelectRecipient__wrapper" className="flex relative items-center w-full text-left">
					<Select
						showCaret={false}
						isInvalid={isInvalidValue}
						disabled={disabled}
						defaultValue={selectedAddress}
						placeholder={placeholder}
						ref={ref}
						options={recipientAddresses}
						allowFreeInput={true}
						onChange={(option: any) => onInputChange(option.value)}
						addons={{
							start: <ProfileAvatar address={selectedAddress} />,
							end: (
								<div
									data-testid="SelectRecipient__select-recipient"
									className="flex items-center cursor-pointer"
									onClick={openRecipients}
								>
									<Icon name="User" width={20} height={20} />
								</div>
							),
						}}
						renderLabel={(option) => <OptionLabel option={option} profile={profile} />}
					/>
				</div>

				<SearchRecipient
					network={network}
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
