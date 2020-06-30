import { SvgCollection } from "app/assets/svg";
import { Button } from "app/components/Button";
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
		className="flex flex-col items-center justify-center px-10 py-20 mt-4 bg-theme-background"
	>
		<SvgCollection.RegistrationsIllustration />
		<span className="text-sm mt-7 text-theme-neutral-600">
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
		<section className="bg-theme-neutral-100">
			<div className="px-10 py-14 bg-theme-background">
				<div className="flex justify-between">
					<div className="flex flex-col">
						<span className="text-3xl font-semibold">My Registrations</span>
						<span className="text-theme-neutral-600">
							You can register a Delagate, Business and Bridgechain.
						</span>
					</div>
					<Button className="self-end">Register</Button>
				</div>
			</div>
			{!registrations.length ? EmptyRegistrations : mountRegistrations()}
		</section>
	);
};

MyRegistrations.defaultProps = {
	registrations: [],
};
