import { Environment, Storage } from "@arkecosystem/platform-sdk-profiles";
import React from "react";

export const EnvironmentContext = React.createContext<any>(undefined);

type Props = {
	children: React.ReactNode;
	env: Environment;
	storage?: Storage;
};

export const EnvironmentProvider = ({ children, env, storage }: Props) => {
	const [state, setState] = React.useState<any>({});
	const force = React.useCallback(() => setState({}), []);

	React.useEffect(() => {
		force();
	}, [storage]);

	return <EnvironmentContext.Provider value={{ env, state }}>{children}</EnvironmentContext.Provider>;
};

export const EnvironmentConsumer = EnvironmentContext.Consumer;
export const useEnvironment = (): Environment => React.useContext(EnvironmentContext).env;
export const useEnvironmentState = () => React.useContext(EnvironmentContext);
