import { Address } from "app/components/Address";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputAddonEnd, InputGroup } from "app/components/Input";
import { Select } from "app/components/Select";
import React from "react";

export const ProfileFormField = ({
	className,
	register,
	profiles,
	selectedProfile,
	formName,
	formLabel,
	disabled,
	withoutAdditional,
}: any) => {
	return (
		<FormField name={formName} className={`relative h-20 ${className || ""}`}>
			<div className="mb-2">
				<FormLabel label={formLabel} />
			</div>

			<InputGroup className="ProfileFormField__select-contact select-transparent">
				<Select
					data-testid={`ProfileFormField__select-${formName}`}
					disabled={disabled}
					placeholder=" "
					name={formName}
					ref={register}
				>
					{profiles &&
						profiles.map((profile: any, index: number) => (
							<option key={index} value={profile.address} data-testid="ProfileFormField__profile-select">
								{profile.formatted}
							</option>
						))}
				</Select>
				{!withoutAdditional && (
					<InputAddonEnd>
						<button className="px-3 pr-2 text-theme-primary-300 focus:outline-none">
							<Icon name="User" width={20} height={20} />
						</button>
						<Divider type="vertical" />
						<button className="pl-2 pr-4 text-theme-primary-300 focus:outline-none">
							<Icon name="Receive" width={20} height={20} />
						</button>
					</InputAddonEnd>
				)}
			</InputGroup>

			{!selectedProfile && (
				<div className="absolute ml-4 -mt-10">
					<Circle className="mt-px bg-theme-neutral-200 border-theme-neutral-200" size="sm" noShadow />
				</div>
			)}
			{selectedProfile && (
				<div className="flex ml-4 -mt-10">
					<Circle
						avatarId={selectedProfile?.address}
						className="bg-theme-neutral-300 border-theme-neutral-300"
						size="sm"
						noShadow
					/>
					<div className="mt-1 ml-4 text-theme-neutral-800">
						<Address
							maxChars={30}
							address={selectedProfile?.address}
							walletName={selectedProfile?.walletName}
							fontWeight="normal"
						/>
					</div>
				</div>
			)}
		</FormField>
	);
};

ProfileFormField.defaultProps = {
	withoutAdditional: false,
};
