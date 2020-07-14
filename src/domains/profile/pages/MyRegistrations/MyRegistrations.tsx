import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import React from "react";

import { BlockchainTable } from "./components/BlockchainTable";
import { BusinessTable } from "./components/BusinessTable";
import { DelegateTable } from "./components/DelegateTable";

type Props = {
	registrations?: any;
	handleDropdown?: any;
};

type RegistrationProps = {
	type: string;
	registrations: any;
};

const { RegisterBanner } = images.common;

const EmptyRegistrations = (
	<Section className="flex-1">
		<div data-testid="my-registrations__empty-state" className="text-center">
			<RegisterBanner className="mx-auto" />

			<div className="mt-8 text-theme-neutral-dark">
				Register Business, Bridgechain and Delegate in the most convenient way.
			</div>
		</div>
	</Section>
);

const renderRegistration = ({ type, registrations }: RegistrationProps, handleDropdown: any) => {
	switch (type) {
		case "business":
			return (
				<BusinessTable
					key={type}
					data={registrations}
					handleDropdown={(option: any) => handleDropdown(type, option)}
				/>
			);
		case "blockchain":
			return (
				<BlockchainTable
					key={type}
					data={registrations}
					handleDropdown={(option: any) => handleDropdown(type, option)}
				/>
			);
		case "delegate":
			return (
				<DelegateTable
					key={type}
					data={registrations}
					handleDropdown={(option: any) => handleDropdown(type, option)}
				/>
			);

		default:
			return null;
	}
};

export const MyRegistrations = ({ registrations, handleDropdown }: Props) => {
	const mountRegistrations = () =>
		registrations.map((registrationsBlock: any) => {
			return renderRegistration(registrationsBlock, handleDropdown);
		});

	return (
		<Page>
			<Section>
				<Header
					title="My Registrations"
					subtitle="You can register a Delagate, Business and Bridgechain."
					extra={
						<div className="flex justify-end divide-theme-neutral-300 space-x-10 divide-x">
							<HeaderSearchBar onSearch={console.log} />
							<div className="pl-10">
								<Button>Register</Button>
							</div>
						</div>
					}
				/>
			</Section>

			{!registrations.length ? EmptyRegistrations : mountRegistrations()}
		</Page>
	);
};

MyRegistrations.defaultProps = {
	registrations: [],
};
