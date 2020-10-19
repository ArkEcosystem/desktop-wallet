import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { SearchRecipient } from "domains/transaction/components/SearchRecipient";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type SelectRecipientProps = {
	address?: string;
	profile: Profile;
	disabled?: boolean;
	isInvalid?: boolean;
	onChange?: (address: string) => void;
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
	({ address, profile, disabled, isInvalid, onChange }: SelectRecipientProps, ref) => {
		const { t } = useTranslation();

		const [isRecipientSearchOpen, setIsRecipientSearchOpen] = useState(false);
		const [selectedAddress, setSelectedAddress] = useState("");

		useEffect(() => {
			if (address) {
				setSelectedAddress(address);
			}
		}, [address, setSelectedAddress]);

		const fieldContext = useFormField();
		const isInvalidField = fieldContext?.isInvalid || isInvalid;

		const onSelectProfile = (address: string) => {
			setSelectedAddress(address);
			setIsRecipientSearchOpen(false);
			onChange?.(address);
		};

		const openRecipients = () => {
			if (disabled) return;
			setIsRecipientSearchOpen(true);
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
						isInvalid={isInvalidField}
					/>

					<div
						data-testid="SelectRecipient__select-recipient"
						className="absolute flex items-center space-x-3 cursor-pointer right-4"
						onClick={openRecipients}
					>
						<Icon name="User" width={20} height={20} />
					</div>
				</div>

				<SearchRecipient
					isOpen={isRecipientSearchOpen}
					profile={profile}
					options={[{ value: "select", label: t("COMMON.SELECT") }]}
					onAction={(_, address: string) => onSelectProfile(address)}
					onClose={() => setIsRecipientSearchOpen(false)}
				/>
			</div>
		);
	},
);

SelectRecipient.displayName = "SelectRecipient";
