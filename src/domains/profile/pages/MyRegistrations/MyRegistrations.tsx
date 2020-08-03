import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks/env";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

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

const EmptyRegistrations = () => {
	const { t } = useTranslation();

	return (
		<Section className="flex-1">
			<div data-testid="my-registrations__empty-state" className="text-center">
				<RegisterBanner className="mx-auto" />

				<div className="mt-8 text-theme-neutral-dark">
					{t("PROFILE.PAGE_MY_REGISTRATIONS.NO_REGISTRATIONS_MESSAGE")}
				</div>
			</div>
		</Section>
	);
};

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
	const activeProfile = useActiveProfile();

	const history = useHistory();
	const { t } = useTranslation();

	const mountRegistrations = () =>
		registrations.map((registrationsBlock: any) => renderRegistration(registrationsBlock, handleDropdown));

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("PROFILE.PAGE_MY_REGISTRATIONS.TITLE")}
					subtitle={t("PROFILE.PAGE_MY_REGISTRATIONS.SUBTITLE")}
					extra={
						<div className="flex justify-end divide-theme-neutral-300 space-x-10 divide-x">
							<HeaderSearchBar onSearch={console.log} />
							<div className="pl-10">
								<Button
									onClick={() =>
										history.push(`/profiles/${activeProfile.id()}/transactions/registration`)
									}
								>
									{t("COMMON.REGISTER")}
								</Button>
							</div>
						</div>
					}
				/>
			</Section>

			{!registrations.length ? <EmptyRegistrations /> : mountRegistrations()}
		</Page>
	);
};

MyRegistrations.defaultProps = {
	registrations: [],
};
