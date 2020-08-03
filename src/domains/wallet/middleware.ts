import { matchPath } from "react-router-dom";
import { Middleware, MiddlewareParams } from "router/interfaces";

export class WalletMiddleware implements Middleware {
	handler({ location, redirect, env }: MiddlewareParams) {
		const match = matchPath<{ profileId: string; walletId: string }>(location.pathname, {
			path: "/profiles/:profileId/wallets/:walletId",
		});

		if (match) {
			try {
				const wallet = env
					.profiles()
					.findById(match.params.profileId)
					.wallets()
					.findById(match.params.walletId);
				return !!wallet;
			} catch {
				redirect(`/profiles/${match.params.profileId}/dashboard`);
				return false;
			}
		}

		return true;
	}
}
