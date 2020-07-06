import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { useEnvironment } from "app/contexts";
import { ProfileCard } from "domains/profile/components/ProfileCard";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const commonAssets = images.common;
const { WelcomeBanner } = images.profile.pages.welcome;

export const Welcome = () => {
	const profileCardActions = [
		{ label: "Setting", value: "setting" },
		{ label: "Delete", value: "delete" },
	];
	const env = useEnvironment();
	const { t } = useTranslation();
	const history = useHistory();
	const [profiles, setProfiles] = React.useState<Profile[]>([]);

	React.useEffect(() => {
		setProfiles(env!.profiles().all());
	}, [env]);

	return (
		<div className="w-full h-full">
			<div className="sm:px-6 lg:px-8 px-4">
				<div className="md:h-24 flex items-center flex-shrink-0 h-20">
					<div className="bg-logo flex p-2 rounded-lg">
						<img src={commonAssets.ARKLogo} className="md:h-8 lg:h-10 h-6" alt="ARK Logo" />
					</div>
				</div>
			</div>

			<div className="sm:px-6 lg:px-0 container px-4 mx-auto text-center">
				<h1 className="mb-8 font-bold">{t("COMMON.WELCOME")}</h1>
				<div className="lg:w-4/5 xl:w-2/3 w-full mx-auto">
					<WelcomeBanner />
				</div>

				<div className="md:max-w-xl max-w-lg mx-auto my-8">
					{profiles.length > 0 && (
						<>
							<h2 className="md:text-2xl mx-4 text-xl font-bold">Select Profile</h2>
							<p className="text-theme-neutral-dark md:text-base text-sm">
								You already have a profile, you can choose any of them
							</p>

							<div className="mt-6 mb-8 space-y-3">
								{profiles.map((profile: any, index: number) => (
									<ProfileCard
										handleClick={() => history.push(`/profiles/${profile.id()}/portfolio`)}
										key={index}
										profile={profile}
										actions={profileCardActions}
									/>
								))}
							</div>

							<Divider />
						</>
					)}
					<p className="text-theme-neutral-dark md:text-base mb-4 text-sm">
						Create a new Profile or login with your MarketSquare account to get started
					</p>
					<div className="md:space-x-3 md:flex-row flex flex-col">
						<Button className="w-full">
							<Icon name="Msq" width={20} height={20} />
							<span className="ml-2">Sign in to MarketSquare</span>
						</Button>
						<Button
							variant="plain"
							className="md:mt-0 w-full mt-2"
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
