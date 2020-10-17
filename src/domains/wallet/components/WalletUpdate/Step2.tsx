import { CircularProgressBar } from "app/components/CircularProgressBar";
import React from "react";
import { useTranslation } from "react-i18next";

export const SecondStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="WalletUpdate__second-step">
			{/* TODO: Remove the class name `mb-8` in the functional code */}
			<div className="flex w-2/5 mx-auto mb-8">
				<div className="flex-1">
					<p className="text-sm font-semibold text-theme-neutral-light">{t("COMMON.DOWNLOADED")}</p>
					<p className="text-sm font-bold text-theme-secondary-text">154 KB / 154 KB</p>
				</div>
				<div className="flex-1">
					<div className="flex justify-center">
						<CircularProgressBar value={78} size={50} strokeWidth={5} fontSize={0.8} />
					</div>
				</div>
			</div>
		</section>
	);
};
