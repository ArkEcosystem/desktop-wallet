// Assets
import { images } from "app/assets/images";
// UI Elements
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { NavBar } from "app/components/NavBar";
// Contexts
import { EnvironmentContext } from "app/contexts";
import { ProfileCard } from "domains/profile/components/ProfileCard";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const WelcomeBanner = images.profile.pages.welcome.WelcomeBanner;

const Welcome = () => {
	const profileCardActions = [
		{ label: "Setting", value: "setting" },
		{ label: "Delete", value: "delete" },
	];
	const { env }: any = useContext(EnvironmentContext);
	const { t } = useTranslation();
	const [profiles, setProfiles] = useState([]);

	const loadProfiles = async () => {
		const profiles = await env.profiles().all();

		setProfiles(profiles);
	};

	useEffect(() => {
		loadProfiles();
	}, []);

	return (
		<div className="w-full h-full">
			<NavBar />

			<div className="container px-4 mx-auto text-center sm:px-6 lg:px-0">
				<h1 className="mb-8 font-bold">{t("COMMON.WELCOME")}</h1>
				<div className="w-full mx-auto lg:w-4/5 xl:w-2/3">
					<WelcomeBanner />
				</div>

				<div className="max-w-lg mx-auto my-8 md:max-w-xl">
					{profiles.length > 0 && (
						<>
							<h2 className="mx-4 text-xl font-bold md:text-2xl">Select Profile</h2>
							<p className="text-sm text-theme-neutral-dark md:text-base">
								You already have a profile, you can choose any of them
							</p>

							<div className="mt-6 mb-8">
								{profiles.map((profile: any) => (
									<ProfileCard {...profile} key={profile.id} actions={profileCardActions} />
								))}
							</div>

							<Divider />
						</>
					)}
					<p className="mb-4 text-sm text-theme-neutral-dark md:text-base">
						Create a new Profile or login with your MarketSquare account to get started
					</p>
					<div className="flex flex-col md:flex-row">
						<Button
							color="primary"
							variant="solid"
							className="flex items-center justify-center w-full mr-2"
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
};

export { Welcome };
