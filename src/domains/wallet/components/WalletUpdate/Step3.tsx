import React from "react";
import { useTranslation } from "react-i18next";

export const ThirdStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="WalletUpdate__third-step">
			<div className="mb-6 text-center">
				<p className="text-sm md:text-base text-theme-secondary-text">
					{t("WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_2")}
				</p>
			</div>
		</section>
	);
};
