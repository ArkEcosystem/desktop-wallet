import React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { imagesConfig } from "resources/assets/images";

// UI Elements
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { NavBar } from "app/components/NavBar";
import { ProfileCard } from "domains/profile/components/ProfileCard";

type WelcomeProps = {
	profiles: Array<any>;
} & WrappedComponentProps;

const profileAssets = imagesConfig.pages.profile;

const Welcome = injectIntl(({ intl: { formatMessage }, profiles }: WelcomeProps) => {
	return (
		<div className="w-full h-full">
			<NavBar />

			<div className="container px-4 mx-auto text-center sm:px-6 lg:px-0">
				<h1 className="text-2xl font-bold mb-8 md:text-3xl lg:text-4xl">
					{formatMessage({ id: "COMMON_WELCOME" })}
				</h1>
				<div className="mx-auto w-full lg:w-4/5 xl:w-2/3">
					<img src={profileAssets.OnboardingBanner} alt="Onboarding Banner" />
				</div>

				<div className="mx-auto max-w-lg md:max-w-xl my-8">
					{profiles.length > 0 && (
						<>
							<h2 className="mx-4 text-xl font-bold md:text-2xl">Select Profile</h2>
							<p className="text-sm text-theme-neutral-dark md:text-base">
								You already have a profile, you can choose any of them
							</p>

							<div className="mt-6 mb-8">
								{profiles.map((profile) => (
									<ProfileCard {...profile} key={profile.id} />
								))}
							</div>

							<Divider />
						</>
					)}
					<p className="text-sm text-theme-neutral-dark mb-4 md:text-base">
						Create a new Profile or login with your MarketSquare account to get started
					</p>
					<div className="flex flex-col md:flex-row">
						<Button color="primary" variant="solid" className="button-primary w-full mr-2">
							Sign in to MarketSquare
						</Button>
						<Button color="primary" variant="plain" className="button-secondary w-full mt-2 md:mt-0">
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
