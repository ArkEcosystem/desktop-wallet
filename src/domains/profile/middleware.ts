import { matchPath } from "react-router-dom";
import { Middleware, MiddlewareParams } from "router/interfaces";

export class ProfileMiddleware implements Middleware {
	handler({ location, env }: MiddlewareParams) {
		const match = matchPath<{ profileId: string }>(location.pathname, {
			path: "/profiles/:profileId",
		});

		if (match) {
			const { profileId } = match.params;

			if (profileId === "create") {
				return true;
			}

			try {
				const profile = env.profiles().findById(profileId);
				return !!profile;
			} catch {
				return false;
			}
		}

		return true;
	}
}
