import { EnvironmentContext } from "app/contexts";
import React from "react";

import { Welcome } from "./Welcome";

export default {
	title: "Profile / Pages / Welcome",
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
						"conic-gradient(from 187.72581227416637deg at 30.1638449037714% 95.32529532320164%, #5A67D8, calc(0 * 100% / 5), transparent 0),conic-gradient(from 558.707766537648deg at 46.03080213730888% 38.46592977959059%, #5A67D8, calc(1 * 100% / 5), transparent 0),conic-gradient(from 516.9414793664271deg at 39.167124811695444% 79.64845715708326%, #F56565, calc(2 * 100% / 5), transparent 0),conic-gradient(from 376.2750614900723deg at 50.22626869147718% 35.94486056666646%, #FBD38D, calc(3 * 100% / 5), transparent 0),conic-gradient(from 236.40405792077317deg at 49.52461095825791% 48.75349635638091%, #4FD1C5, calc(4 * 100% / 5), transparent 0)",
				},
				{
					id: () => "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
					name: () => "Olga Aglo",
					balance: () => "234,500.46 USD",
					avatar: () =>
						"conic-gradient(from 563.0994526095722deg at 61.30912648246909% 46.81975843807331%, #38B2AC, calc(0 * 100% / 5), transparent 0),conic-gradient(from 294.38309754735315deg at 88.91090203024753% 17.816036868182323%, #667EEA, calc(1 * 100% / 5), transparent 0),conic-gradient(from 65.81466950915895deg at 65.51454886029188% 50.65188897318522%, #2C7A7B, calc(2 * 100% / 5), transparent 0),conic-gradient(from 580.9432051169158deg at 80.22717273388874% 41.13220228901832%, #C05621, calc(3 * 100% / 5), transparent 0),conic-gradient(from 1.1299125739654967deg at 98.99025162686485% 1.118550902425505%, #DD6B20, calc(4 * 100% / 5), transparent 0)",
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
