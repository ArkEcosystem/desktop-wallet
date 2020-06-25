import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/Select";
import { Toggle } from "app/components/Toggle";
import React from "react";
import { useForm } from "react-hook-form";

type CreateProfileProps = {
	onSubmit?: any;
};

const commonAssets = images.common;

export const CreateProfile = ({ onSubmit }: CreateProfileProps) => {
	const form = useForm();
	const { register } = form;

	const personalDetails = [
		{
			isFloatingLabel: true,
			label: "New Profile",
			labelDescription: "Select Profile Image",
			labelClass: "text-xl font-bold",
			labelDescriptionClass: "font-semibold mt-3 text-theme-neutral-dark",
			content: (
				<div className="flex flex-row mb-4 -mt-2">
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
				<div className="flex flex-row justify-between">
					<span className="w-3/4 -mt-4 text-sm text-theme-neutral-dark">
						Want to set the wallet to dark mode?
					</span>
					<div className="-mt-11">
						<Toggle />
					</div>
				</div>
			),
		},
	];

	return (
		<div className="w-full h-full">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex items-center flex-shrink-0 h-20 md:h-24">
					<div className="flex p-2 rounded-lg bg-logo">
						<img src={commonAssets.ARKLogo} className="h-6 md:h-8 lg:h-10" alt="ARK Logo" />
					</div>
				</div>
			</div>

			<div className="container mx-auto">
				<div className="max-w-lg mx-auto xl:max-w-xl">
					<h1 className="mx-4 md:mx-8 xl:mx-16">Create Profile</h1>
					<div className="mx-4 text-theme-neutral-dark md:mx-8 xl:mx-16">
						Create a new Profile or login with your MarketSquare account to get started.
					</div>

					<div className="mx-4 mt-8 md:mx-8 xl:mx-16">
						<Button className="w-full mb-6">
							<Icon name="Msq" width={20} height={20} />
							<span className="ml-2">Login with MarketSquare</span>
						</Button>
						<Divider />
					</div>

					<Form id="create-profile__form" className="-mt-6" context={form} onSubmit={onSubmit}>
						<div className="mx-4 md:mx-8 xl:mx-16">
							<ListDivided items={personalDetails} />

							<div className="flex flex-col space-y-8">
								<FormField name="name">
									<FormLabel label="Name" />
									<Input ref={register({ required: true })} />
									<FormHelperText />
								</FormField>

								<FormField name="market-provider">
									<FormLabel label="Market Provider" />
									<Select
										name="market-provider"
										placeholder="Select Market Provider"
										ref={register({ required: true })}
									>
										<option value="option1">Option 1</option>
										<option value="option2">Option 2</option>
										<option value="option3">Option 3</option>
									</Select>
									<FormHelperText />
								</FormField>

								<FormField name="currency">
									<FormLabel label="Currency" />
									<Select
										name="currency"
										placeholder="Select Currency"
										ref={register({ required: true })}
									>
										<option value="option1">Option 1</option>
										<option value="option2">Option 2</option>
										<option value="option3">Option 3</option>
									</Select>
									<FormHelperText />
								</FormField>
							</div>

							<div className="mb-4">
								<ListDivided items={otherItems} />
							</div>

							<Divider dashed />
						</div>

						<div className="flex justify-end mx-4 mt-12 mb-16 space-x-3 md:mx-8 xl:mx-16">
							<Button variant="plain">Back</Button>
							<Button>Complete</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};
