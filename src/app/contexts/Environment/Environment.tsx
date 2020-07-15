import { Environment } from "@arkecosystem/platform-sdk-profiles";
import React from "react";

export const EnvironmentContext = React.createContext<Environment | undefined>(undefined);

type Props = {
	children: React.ReactNode;
	env: Environment;
};

export const EnvironmentProvider = ({ children, env }: Props) => {
	const ref = React.useRef(env);
	return <EnvironmentContext.Provider value={ref.current}>{children}</EnvironmentContext.Provider>;
};

export const EnvironmentConsumer = EnvironmentContext.Consumer;
export const useEnvironment = () => React.useContext(EnvironmentContext);
