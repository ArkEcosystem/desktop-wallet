import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import { useEnvironment } from "app/contexts";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

type CreateProfileProps = {
	onSubmit?: (profile: Profile) => void;
};

export const CreateProfile = ({ onSubmit }: CreateProfileProps) => {
	const env: any = useEnvironment();
	const form = useForm();
	const history = useHistory();
	const { register } = form;

	const personalDetails = [
		{
			isFloatingLabel: true,
			label: "New Profile",
			labelDescription: "Select Profile Image",
			labelClass: "text-2xl font-semibold",
			labelDescriptionClass: "my-1 text-theme-neutral-dark",
			content: (
				<div className="flex flex-row mt-4 mb-8">
					<div className="flex items-center justify-center w-24 h-24 mr-6 border-2 border-dashed rounded border-theme-neutral-300">
						<button
							type="button"
							className="flex items-center justify-center w-20 h-20 rounded-full bg-theme-primary-contrast"
						>
							<Icon name="Upload" />
						</button>
					</div>
					<div className="relative w-24 h-24 rounded bg-theme-neutral-light">
						<img
							src="https://randomuser.me/api/portraits/men/3.jpg"
							className="object-cover rounded"
							alt="random avatar"
						/>
						<button className="absolute flex items-center justify-center w-6 h-6 p-1 rounded bg-theme-danger-contrast text-theme-danger -top-3 -right-3">
							<Icon name="Close" height={12} width={12} />
						</button>
					</div>
				</div>
			),
		},
	];

	const otherItems = [
		{
			isFloatingLabel: true,
			label: "Dark Theme",
			labelClass: "text-xl font-bold text-theme-neutral-dark",
			content: (
				<div className="flex flex-row items-center justify-between">
					<span className="mt-2 text-sm text-theme-neutral-dark">Want to set the wallet to dark mode?</span>
					<div className="-mt-8">
						<Toggle ref={register()} name="isDarkMode" />
					</div>
				</div>
			),
		},
	];

	const submitForm = async ({ name, currency, isDarkMode, marketProvider }: any) => {
		const profile = env.profiles().create(name);
		profile.settings().set(ProfileSetting.MarketProvider, marketProvider);
		profile.settings().set(ProfileSetting.ChartCurrency, currency);
		profile.settings().set(ProfileSetting.Theme, isDarkMode ? "dark" : "light");

		await env.persist();

		if (onSubmit) {
			onSubmit(profile);
		}
	};

	return (
		<Page navbarStyle="logo-only">
			<Section className="flex flex-col justify-center flex-1 text-center">
				<div className="max-w-lg mx-auto md:max-w-xl">
					<h1 className="mb-0 md:text-4xl">Create Profile</h1>
					<div className="text-theme-neutral-dark">
						Create a new Profile or login with your MarketSquare account to get started.
					</div>

					<div className="pb-4 mt-8">
						<Button className="w-full">
							<Icon name="Msq" width={20} height={20} />
							<span className="ml-2">Login with MarketSquare</span>
						</Button>
					</div>
					<Divider />

					<Form data-testid="CreateProfile__form" className="mt-4" context={form} onSubmit={submitForm}>
						<div className="">
							<ListDivided items={personalDetails} />

							<div className="relative space-y-8">
								<FormField name="name">
									<FormLabel label="Name" />
									<Input ref={register({ required: true })} />
									<FormHelperText />
								</FormField>

								<FormField name="marketProvider">
									<FormLabel label="Market Provider" />
									<Select
										placeholder="Select Market Provider"
										ref={register({ required: true })}
										options={[
											{ label: "Option 1", value: "option1" },
											{ label: "Option 2", value: "option2" },
										]}
									/>
									<FormHelperText />
								</FormField>

								<FormField name="currency">
									<FormLabel label="Currency" />
									<Select
										placeholder="Select Currency"
										ref={register({ required: true })}
										options={[
											{ label: "Option 1", value: "option1" },
											{ label: "Option 2", value: "option2" },
										]}
									/>
									<FormHelperText />
								</FormField>
							</div>

							<div className="mt-8">
								<ListDivided items={otherItems} />
							</div>

							<Divider dashed />
						</div>

						<div className="flex justify-end mt-8 space-x-3">
							<Button variant="plain" onClick={() => history.go(-1)}>
								Back
							</Button>
							<Button data-testid="CreateProfile__submit-button" type="submit">
								Complete
							</Button>
						</div>
					</Form>
				</div>
			</Section>
		</Page>
	);
};
