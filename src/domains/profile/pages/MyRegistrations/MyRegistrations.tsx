import { SvgCollection } from "app/assets/svg";
import { Button } from "app/components/Button";
import React from "react";

import { BlockchainTable } from "./components/BlockchainTable";
import { BusinessTable } from "./components/BusinessTable";
import { DelegateTable } from "./components/DelegateTable";

type Props = {
	registrations?: any;
};

type RegistrationProps = {
	type: string;
	registrations: any;
};

const EmptyRegistrations = (
	<div
		data-testid="my-registrations__empty-state"
		className="flex flex-col justify-center items-center mt-4 px-10 py-20 bg-theme-background"
	>
		<SvgCollection.RegistrationsIllustration />
		<span className="mt-7 text-sm text-theme-neutral-600">
			Register Business, Bridgechain and Delegate in the most convenient way.
		</span>
	</div>
);

const renderRegistration = ({ type, registrations }: RegistrationProps) => {
	switch (type) {
		case "business":
			return <BusinessTable key={type} data={registrations} />;
		case "blockchain":
			return <BlockchainTable key={type} data={registrations} />;
		case "delegate":
			return <DelegateTable key={type} data={registrations} />;

		default:
			return null;
	}
};

export const MyRegistrations = ({ registrations }: Props) => {
	const mountRegistrations = () =>
		registrations.map((registrationsBlock: any) => {
			return renderRegistration(registrationsBlock);
		});

	return (
		<section className="bg-theme-neutral-100">
			<div className="px-10 py-14 bg-theme-background">
				<div className="flex justify-between">
					<div className="flex flex-col">
						<span className="font-semibold text-3xl">My Registrations</span>
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
