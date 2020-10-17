import React from "react";
import { useTranslation } from "react-i18next";

export const FirstStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="WalletUpdate__first-step">
			<div className="mb-8 text-center">
				<p className="text-sm text-theme-secondary-text md:text-base">
					{t("WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_1")}
				</p>
			</div>
		</section>
	);
};
