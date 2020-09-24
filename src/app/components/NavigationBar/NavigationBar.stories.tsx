import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { NavigationBar } from "./NavigationBar";

export default { title: "App / Components / NavigationBar" };

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Test profile");

export const Default = () => {
	const notifications = {
		plugins: [
			{
				logoClassName: "w-8 h-8 p-2 mr-4 rounded-lg bg-logo",
				title: "ARK Explorer",
				description: "- update v2.5.6",
				action: {
					label: "Update now",
					value: "update",
				},
			},
		],
		transactions: [
			{
				id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
				confirmations: "100",
				timestamp: "17 Mar 2020 10:22:05",
				type: "secondSignature",
				sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				amount: "0",
				fee: "0.1",
				isSent: true,
			},
			{
				id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
				confirmations: "100",
				timestamp: "17 Mar 2020 10:22:05",
				type: "vote",
				sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				amount: "0",
				fee: "0.1",
				isSent: true,
			},
		],
	};

	return (
		<EnvironmentProvider env={env}>
			<NavigationBar
				profile={profile}
				onUserAction={(action: any) => alert(action.label)}
				onNotificationAction={(actionName: string) => alert(actionName)}
			/>
		</EnvironmentProvider>
	);
};

export const EmptyNotifications = () => (
		<EnvironmentProvider env={env}>
			<NavigationBar
				profile={profile}
				onUserAction={(action: any) => alert(action.label)}
				onNotificationAction={(actionName: string) => alert(actionName)}
			/>
		</EnvironmentProvider>
	);
