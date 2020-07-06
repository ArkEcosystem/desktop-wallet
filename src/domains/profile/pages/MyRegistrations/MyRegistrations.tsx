import { SvgCollection } from "app/assets/svg";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { NavigationBar } from "app/components/NavigationBar";
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

const EmptyRegistrations = (
	<div
		data-testid="my-registrations__empty-state"
		className="bg-theme-background flex flex-col items-center justify-center px-10 py-20 mt-4"
	>
		<SvgCollection.RegistrationsIllustration />
		<span className="mt-7 text-theme-neutral-600 text-sm">
			Register Business, Bridgechain and Delegate in the most convenient way.
		</span>
	</div>
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
		<div>
			<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

			<section className="bg-theme-neutral-100">
				<div className="bg-theme-background px-10 py-16">
					<Header
						title="My Registrations"
						subtitle="You can register a Delagate, Business and Bridgechain."
						extra={
							<div className="divide-theme-neutral-300 flex justify-end space-x-10 divide-x">
								<HeaderSearchBar onSearch={console.log} />
								<div className="pl-10">
									<Button>Register</Button>
								</div>
							</div>
						}
					/>
				</div>
				{!registrations.length ? EmptyRegistrations : mountRegistrations()}
			</section>
		</div>
	);
};

MyRegistrations.defaultProps = {
	registrations: [],
};
