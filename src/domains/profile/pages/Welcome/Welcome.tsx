import React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { imagesConfig } from "resources/assets/images";

// UI Elements
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { NavBar } from "app/components/NavBar";
import { ProfileCard } from "domains/profile/components/ProfileCard";

type WelcomeProps = {
	profiles: Array<any>;
} & WrappedComponentProps;

const profileAssets = imagesConfig.pages.profile;

const Welcome = injectIntl(({ intl: { formatMessage }, profiles }: WelcomeProps) => {
	const profileCardActions = [
		{ label: "Setting", value: "setting" },
		{ label: "Delete", value: "delete" },
	];

	return (
		<div className="w-full h-full">
			<NavBar />

			<div className="container mx-auto text-center px-4 sm:px-6 lg:px-0">
				<h1 className="mb-8 font-bold">{formatMessage({ id: "COMMON_WELCOME" })}</h1>
				<div className="mx-auto w-full lg:w-4/5 xl:w-2/3">
					<img src={profileAssets.OnboardingBanner} alt="Onboarding Banner" />
				</div>

				<div className="max-w-lg mx-auto md:max-w-xl my-8">
					{profiles.length > 0 && (
						<>
							<h2 className="mx-4 text-xl font-bold md:text-2xl">Select Profile</h2>
							<p className="text-sm text-theme-neutral-dark md:text-base">
								You already have a profile, you can choose any of them
							</p>

							<div className="mt-6 mb-8">
								{profiles.map((profile) => (
									<ProfileCard {...profile} key={profile.id} actions={profileCardActions} />
								))}
							</div>

							<Divider />
						</>
					)}
					<p className="text-sm text-theme-neutral-dark mb-4 md:text-base">
						Create a new Profile or login with your MarketSquare account to get started
					</p>
					<div className="flex flex-col md:flex-row">
						<Button
							color="primary"
							variant="solid"
							className="flex justify-center items-center w-full mr-2"
						>
							<Icon name="Msq" width={20} height={20} />
							<span className="ml-2">Sign in to MarketSquare</span>
						</Button>
						<Button color="primary" variant="plain" className="w-full mt-2 md:mt-0">
							Create Profile
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
});

Welcome.defaultProps = {
	profiles: [],
};

export { Welcome };
