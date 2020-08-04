import { matchPath } from "react-router-dom";
import { Middleware, MiddlewareParams } from "router/interfaces";

export class WalletMiddleware implements Middleware {
	handler({ location, redirect, env }: MiddlewareParams) {
		const match = matchPath<{ profileId: string; walletId: string }>(location.pathname, {
			path: "/profiles/:profileId/wallets/:walletId",
		});

		if (match) {
			const { profileId, walletId } = match.params;

			if (["create", "import"].includes(walletId)) {
				return true;
			}

			try {
				const wallet = env.profiles().findById(profileId).wallets().findById(walletId);
				return !!wallet;
			} catch {
				redirect(`/profiles/${profileId}/dashboard`);
				return false;
			}
		}

		return true;
	}
}
