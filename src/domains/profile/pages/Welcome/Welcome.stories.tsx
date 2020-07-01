import { EnvironmentContext } from "app/contexts";
import React from "react";

import { Welcome } from "./Welcome";

export default {
	title: "Domains / Profile / Pages / Welcome",
};

export const Default = () => {
	const env = {
		profiles: () => ({
			all: () => [],
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

export const WithProfiles = () => {
	const env = {
		profiles: () => ({
			all: () => [
				{
					id: () => "fdda765f-fc57-5604-a269-52a7df8164ec",
					name: () => "Oleg Gelo",
					balance: () => "234,500.46 USD",
					avatar: () =>
						'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>circle{mix-blend-mode:soft-light;}</style><rect fill="rgb(33, 150, 243)" width="100" height="100"/><circle r="40" cx="60" cy="50" fill="rgb(255, 87, 34)"/><circle r="55" cx="80" cy="40" fill="rgb(205, 220, 57)"/><circle r="35" cx="50" cy="70" fill="rgb(255, 193, 7)"/></svg>',
				},
				{
					id: () => "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
					name: () => "Olga Aglo",
					balance: () => "234,500.46 USD",
					avatar: () =>
						'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>circle{mix-blend-mode:soft-light;}</style><rect fill="rgb(233, 30, 99)" width="100" height="100"/><circle r="40" cx="70" cy="50" fill="rgb(205, 220, 57)"/><circle r="50" cx="20" cy="30" fill="rgb(139, 195, 74)"/><circle r="55" cx="100" cy="40" fill="rgb(76, 175, 80)"/></svg>',
				},
			],
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
