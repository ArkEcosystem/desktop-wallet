import { useEnvironment } from "app/contexts/Environment";
import React from "react";
import { useParams } from "react-router-dom";

export const useActiveProfile = () => {
	const env = useEnvironment();
	const { profileId } = useParams();

	return React.useMemo(() => {
		if (process.env.NODE_ENV === "test") return profileId ? { id: () => profileId } : undefined;

		if (env) {
			try {
				return env.profiles().get(profileId);
			} catch {
				return undefined;
			}
		}
	}, [env, profileId]);
};
