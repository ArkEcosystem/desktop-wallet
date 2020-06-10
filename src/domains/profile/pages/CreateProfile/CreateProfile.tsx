import React from "react";
import { useForm } from "react-hook-form";

// UI Elements
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormLabel, FormField, FormHelperText } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { ListDivided } from "app/components/ListDivided";
import { NavBar } from "app/components/NavBar";
import { Select } from "app/components/Select";
import { Toggle } from "app/components/Toggle";

type CreateProfileProps = {
	onSubmit?: any;
};

export const CreateProfile = ({ onSubmit }: CreateProfileProps) => {
	const form = useForm();
	const { register } = form;

	const personalDetails = [
		{
			isFloatingLabel: true,
			label: "New Profile",
			labelDescription: "Select Profile Image",
			labelClass: "text-3xl font-bold",
			labelDescriptionClass: "mt-3",
			content: (
				<div className="flex flex-row mt-2">
					<div className="flex items-center justify-center w-24 h-24 mr-6 border-2 border-theme-neutral-light border-dashed rounded">
						<button
							type="button"
							className="flex items-center justify-center w-20 h-20 bg-theme-primary-contrast rounded-full"
						>
							<Icon name="Upload" />
						</button>
					</div>
					<div className="relative w-24 h-24 bg-theme-neutral-light rounded">
						<img
							src="https://randomuser.me/api/portraits/men/3.jpg"
							className="object-cover rounded"
							alt="random avatar"
						/>
						<button className="absolute flex items-center justify-center w-6 h-6 p-1 bg-theme-danger-contrast text-theme-danger rounded -top-3 -right-3">
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
					<span className="text-sm text-theme-neutral-dark w-3/4">Want to set the wallet to dark mode?</span>
					<div className="-mt-2">
						<Toggle />
					</div>
				</div>
			),
		},
	];

	return (
		<div className="w-full h-full">
			<NavBar />

			<div className="container mx-auto">
				<div className="mx-auto my-8 md:w-3/4 lg:w-3/5 xl:w-1/2">
					<h1 className="mx-4 md:mx-8 xl:mx-16">Create Profile</h1>
					<div className="mx-4 mt-2 text-theme-neutral-dark md:mx-8 xl:mx-16">
						Create a new Profile or login with your MarketSquare account to get started.
					</div>

					<div className="mx-4 mt-5 md:mx-8 xl:mx-16">
						<Button color="primary" variant="solid" className="w-full mb-5">
							Login with MarketSquare
						</Button>
						<Divider />
					</div>

					<Form id="create-profile__form" context={form} onSubmit={onSubmit}>
						<div className="mx-4 mt-5 md:mx-8 xl:mx-16">
							<ListDivided items={personalDetails} />

							<FormField name="name">
								<FormLabel label="Name" />
								<Input ref={register({ required: true })} />
								<FormHelperText />
							</FormField>

							<FormField className="mt-10" name="market-provider">
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

							<FormField className="mt-10" name="currency">
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

							<div className="mt-5">
								<ListDivided items={otherItems} />
							</div>
						</div>

						<div className="mx-4 mt-5 mb-10 md:mx-8 xl:mx-16">
							<Button color="primary" variant="plain">
								Back
							</Button>
							<Button color="primary" variant="solid" className="ml-2">
								Complete
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};
