import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { EnvironmentContext } from "app/contexts";
import { ProfileCard } from "domains/profile/components/ProfileCard";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const commonAssets = images.common;
const { WelcomeBanner } = images.profile.pages.welcome;

export const Welcome = () => {
	const profileCardActions = [
		{ label: "Setting", value: "setting" },
		{ label: "Delete", value: "delete" },
	];
	const { env }: any = useContext(EnvironmentContext);
	const { t } = useTranslation();
	const history = useHistory();
	const [profiles, setProfiles] = useState([]);

	useEffect(() => {
		setProfiles(env.profiles().all());
	}, [env]);

	return (
		<div className="w-full h-full">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex items-center flex-shrink-0 h-20 md:h-24">
					<div className="flex p-2 rounded-lg bg-logo">
						<img src={commonAssets.ARKLogo} className="h-6 md:h-8 lg:h-10" alt="ARK Logo" />
					</div>
				</div>
			</div>

			<div className="container px-4 mx-auto text-center sm:px-6 lg:px-0">
				<h1 className="mb-8">{t("COMMON.WELCOME")}</h1>
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

							<div className="mt-6 mb-8 space-y-3">
								{profiles.map((profile: any, index: number) => (
									<ProfileCard
										handleClick={() => history.push(`/portfolio/${profile.id()}`)}
										key={index}
										profile={profile}
										actions={profileCardActions}
									/>
								))}
							</div>

							<Divider />
						</>
					)}
					<p className="mb-4 text-sm text-theme-neutral-dark md:text-base">
						Create a new Profile or login with your MarketSquare account to get started
					</p>
					<div className="flex flex-col md:space-x-3 md:flex-row">
						<Button className="w-full">
							<Icon name="Msq" width={20} height={20} />
							<span className="ml-2">Sign in to MarketSquare</span>
						</Button>
						<Button
							variant="plain"
							className="w-full mt-2 md:mt-0"
							onClick={() => history.push("/profiles/create")}
						>
							Create Profile
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
