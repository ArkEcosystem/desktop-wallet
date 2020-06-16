import { EnvironmentContext } from "app/contexts";
import React from "react";

import { Welcome } from "./Welcome";

export default {
	title: "Profile / Pages / Welcome",
};

export const Default = () => (
	<div className="w-full h-full">
		<Welcome />
	</div>
);

export const WithProfiles = () => {
	const env = {
		profiles: () => ({
			all: async () =>
				new Promise((resolve) => {
					resolve([
						{
							id: 1,
							name: "Oleg Gelo",
							balance: "234,500.46 USD",
							avatar: "https://www.w3schools.com/howto/img_avatar.png",
						},
					]);
				}),
		}),
	};

	return (
		<div className="w-full h-full">
			<EnvironmentContext.Provider value={{ env }}>
				<Welcome />
			</EnvironmentContext.Provider>
		</div>
	);
};
