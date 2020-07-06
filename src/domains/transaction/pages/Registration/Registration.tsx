import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { NavigationBar } from "app/components/NavigationBar";
import { Select } from "app/components/Select";
import { SelectAsset } from "app/components/SelectAsset";
import { useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { ProfileFormField } from "domains/profile/components/ProfileFormField";
import { InputFee } from "domains/transaction/components/InputFee";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";
import { styled } from "twin.macro";

type RegistrationProps = {
	addresses: any;
	formDefaultData: any;
	onDownload: any;
	networks: any;
	registrationTypes: any;
};

type Network = { name: string; label: string; value: string; icon: string; iconClass: string };
type RegistrationType = { label: string; value: string };

const FormWrapper = styled.div`
	.select-transparent {
		> div:first-child {
			width: 100%;
		}

		select {
			&:not([disabled]) {
				background-color: transparent;
				color: transparent;
			}
			option {
				color: var(--theme-color-neutral-900);
			}
		}
	}
`;

const RegistrationTypeDropdown = ({ className, register, registrationTypes, selectedType }: any) => (
	<FormField data-testid="Registration__type" name="registrationType" className={`relative h-20 ${className}`}>
		<div className="mb-2">
			<FormLabel label="Registration Type" />
		</div>
		<div>
			<Select placeholder=" " ref={register} data-testid="Registration__type-select">
				{registrationTypes &&
					registrationTypes.map((registrationType: any, index: number) => (
						<option key={index} value={registrationType.value} data-testid="Registration__type-option">
							{registrationType.label}
						</option>
					))}
			</Select>

			{selectedType && (
				<div data-testid="Registration__type-selected" className="-mt-9 flex items-center ml-4 leading-tight">
					{selectedType.label}
				</div>
			)}
		</div>
	</FormField>
);

const getAddressInfo = (addresses: any[], address: string) => {
	return addresses.find((profile: any) => profile.address === address);
};

const getRegistrationByName = (registrationTypes: any[], registrationType: string) => {
	return registrationTypes.find((type: any) => type.value === registrationType);
};

const FirstStep = ({
	addresses,
	form,
	networks,
	registrationTypes,
}: {
	addresses: any;
	form: any;
	networks: Network[];
	registrationTypes: RegistrationType[];
}) => {
	const { register } = form;
	const { address, registrationType } = form.watch();

	return (
		<div data-testid="Registration__first-step">
			<h1 className="mb-0">Registration</h1>
			<div className="text-theme-neutral-700">
				Select the type of registration and the address you want to register with.
			</div>

			<FormWrapper className="mt-8">
				<FormField name="network">
					<FormLabel>Network</FormLabel>
					<SelectAsset assets={networks} />
				</FormField>

				<ProfileFormField
					formName="address"
					formLabel="Address"
					profiles={addresses}
					selectedProfile={getAddressInfo(addresses, address)}
					register={register}
					withoutAdditional={true}
					className="mt-8"
				/>

				<RegistrationTypeDropdown
					selectedType={getRegistrationByName(registrationTypes, registrationType)}
					registrationTypes={registrationTypes}
					className="mt-8"
					register={register}
				/>
			</FormWrapper>
		</div>
	);
};

const SecondStep = ({ form }: { form: any }) => {
	const { register } = form;
	const selectionBarState = useSelectionState(1);

	return (
		<div data-testid="Registration__second-step">
			<h1 className="mb-0">Register Business</h1>
			<div className="text-theme-neutral-700">
				Select the type of registration and the address you want to register with.
			</div>

			<div>
				<TransactionDetail border={false} className="mt-2 mb-8">
					<FormField name="name" className="font-normal">
						<FormLabel required>Name</FormLabel>
						<Input type="text" ref={register} />
					</FormField>

					<FormField name="description" className="mt-8 font-normal">
						<FormLabel required>Description</FormLabel>
						<TextArea ref={register} />
					</FormField>

					<FormField name="website" className="mt-8 font-normal">
						<FormLabel>Website</FormLabel>
						<Input type="website" ref={register} />
					</FormField>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkCollection
						title="Repository"
						description="Show your projects through your repository"
						types={[
							{ label: "BitBucket", value: "bitbucket" },
							{ label: "GitHub", value: "github" },
							{ label: "GitLab", value: "gitlab" },
						]}
						typeName="repository"
					/>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkCollection
						title="Social Media"
						description="Tell people more about yourself through social media"
						types={[
							{ label: "Facebook", value: "facebook" },
							{ label: "Twitter", value: "twitter" },
							{ label: "LinkedIn", value: "linkedin" },
						]}
						typeName="media"
					/>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkCollection
						title="Photo and Video"
						description="Get more users and add more information about yourself"
						types={[
							{ label: "YouTube", value: "youtube" },
							{ label: "Vimeo", value: "vimeo" },
							{ label: "Flickr", value: "flickr" },
						]}
						typeName="files"
						selectionTypes={["flickr"]}
						selectionTypeTitle="Avatar"
					/>
				</TransactionDetail>

				<TransactionDetail label="Fee ARK" className="mt-4">
					<InputFee selectionBarState={selectionBarState} defaultValue={25} min={1} max={100} step={1} />
				</TransactionDetail>
			</div>
		</div>
	);
};

const ThirdStep = () => {
	const links = [
		{
			link: "http://github.com/robank",
			type: "github",
		},
		{
			link: "http://gitlab.com/robank",
			type: "gitlab",
		},
		{
			link: "http://bitbucket.com/robank",
			type: "bitbucket",
		},
		{
			link: "http://npmjs.com/robank",
			type: "npm",
		},
	];

	return (
		<div data-testid="Registration__third-step">
			<div>
				<h1 className="mb-0">Transaction Review</h1>
				<p className="text-theme-neutral-dark">Check the information again before voting</p>
			</div>
			<div className="grid grid-flow-row gap-2 mt-4">
				<TransactionDetail
					border={false}
					label="Network"
					extra={
						<div className="text-theme-danger-500 ml-1">
							<Circle className="bg-theme-background border-theme-danger-200" size="lg">
								<Icon name="Ark" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<div className="text-theme-neutral-800 max-w-24 flex-auto font-semibold truncate">
						ARK Ecosystem
					</div>
				</TransactionDetail>

				<TransactionDetail
					label=" "
					extra={
						<div>
							<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
						</div>
					}
				>
					<div className="text-theme-neutral-500 mb-2 text-sm font-semibold">
						<span className="mr-1">Sender</span>
						<Label color="warning">
							<span className="text-sm">Your address</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				<TransactionDetail
					label="Type"
					extra={
						<div>
							<Circle className="bg-theme-background border-black" size="lg">
								<Icon name="Business" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					Business Registration
				</TransactionDetail>

				<TransactionDetail label="Name">ROBank Eco</TransactionDetail>

				<TransactionDetail label="Description">Not a trustworthy bank</TransactionDetail>

				<TransactionDetail label="Website">
					<a href="http://robank.com" target="_blank" rel="noreferrer" className="link">
						http://robank.com
					</a>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkList
						title="Repository"
						description="Show your projects through the repository"
						links={links}
					/>
				</TransactionDetail>

				<div>
					<TotalAmountBox transactionAmount="0.00" transactionFee="0.09660435" />
				</div>
			</div>
		</div>
	);
};

const FourthStep = ({ form, passwordType }: { form: any; passwordType: "mnemonic" | "password" | "ledger" }) => {
	const { register } = form;

	return (
		<div data-testid="Registration__fourth-step">
			{passwordType !== "ledger" && (
				<div>
					<h1 className="mb-0">Authenticate</h1>
					<div className="text-theme-neutral-700">
						Enter your twelve word mnemonic to authenticate the transaction.
					</div>

					<div className="mt-8">
						<FormField name="name">
							<FormLabel>{passwordType === "mnemonic" ? "Mnemonic" : "Encryption Password"}</FormLabel>
							<InputPassword name={passwordType} ref={register} />
						</FormField>

						<FormField name="name" className="mt-8">
							<FormLabel>2nd Mnemonic</FormLabel>
							<InputPassword name="secondMnemonic" ref={register} />
						</FormField>
					</div>
				</div>
			)}

			{passwordType === "ledger" && (
				<div>
					<h1>Confirm Your Transaction</h1>
					<LedgerConfirmation />
				</div>
			)}
		</div>
	);
};

export const FifthStep = () => (
	<TransactionSuccessful>
		<TransactionDetail
			label="Transaction Type"
			extra={
				<Circle className="border-black" size="lg">
					<Icon name="Business" width={20} height={20} />
				</Circle>
			}
		>
			Business Registration
		</TransactionDetail>
		<TransactionDetail label="Name">ROBank Eco</TransactionDetail>
		<TransactionDetail label="Description">Not a trustworthy bank</TransactionDetail>
		<TransactionDetail label="Website">
			<a href="http://robank.com" target="_blank" rel="noreferrer" className="link">
				http://robank.com
			</a>
		</TransactionDetail>
		<TransactionDetail
			label="Amount"
			className="pb-0"
			extra={
				<div className="text-theme-danger ml-1">
					<Circle className="bg-theme-background border-theme-danger-200" size="lg">
						<Icon name="Sent" width={50} height={50} />
					</Circle>
				</div>
			}
		>
			1.09660435 ARK
		</TransactionDetail>
	</TransactionSuccessful>
);

export const Registration = ({
	addresses,
	formDefaultData,
	onDownload,
	networks,
	registrationTypes,
}: RegistrationProps) => {
	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const [activeTab, setActiveTab] = React.useState(1);
	const { formState } = form;
	const { isValid } = formState;

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div data-testid="Registration">
			<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

			<div className="max-w-xl py-16 mx-auto">
				<Form context={form} onSubmit={(data: any) => onDownload(data)}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={7} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep
									addresses={addresses}
									form={form}
									networks={networks}
									registrationTypes={registrationTypes}
								/>
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep form={form} />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep form={form} passwordType="mnemonic" />
							</TabPanel>
							<TabPanel tabId={5}>
								<FourthStep form={form} passwordType="password" />
							</TabPanel>
							<TabPanel tabId={6}>
								<FourthStep form={form} passwordType="ledger" />
							</TabPanel>
							<TabPanel tabId={7}>
								<FifthStep />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 7 && (
									<Button
										disabled={activeTab === 1}
										data-testid="Registration__back-button"
										variant="plain"
										onClick={handleBack}
									>
										Back
									</Button>
								)}

								{activeTab < 4 && (
									<Button
										data-testid="Registration__continue-button"
										disabled={!isValid}
										onClick={handleNext}
									>
										Continue
									</Button>
								)}

								{activeTab >= 4 && activeTab < 7 && (
									<Button
										data-testid="Registration__send-button"
										disabled={!isValid}
										onClick={handleNext}
									>
										<Icon name="Send" className="mr-2" width={20} height={20} />
										Send
									</Button>
								)}

								{activeTab === 7 && (
									<div className="flex justify-end space-x-3">
										<Button data-testid="Registration__wallet-button" variant="plain">
											Back to wallet
										</Button>

										<Button
											type="submit"
											data-testid="Registration__download-button"
											variant="plain"
										>
											<Icon name="Download" className="mr-2" />
											Download
										</Button>
									</div>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</div>
		</div>
	);
};
