import { CircularProgressBar } from "app/components/CircularProgressBar";
import { DownloadProgress } from "app/hooks";
import prettyBytes from "pretty-bytes";
import React from "react";
import { useTranslation } from "react-i18next";

export const SecondStep = ({ transferred, total, percent }: DownloadProgress) => {
	const { t } = useTranslation();

	return (
		<section data-testid="WalletUpdate__second-step">
			<div className="flex w-2/5 mx-auto items-center">
				<div className="flex-1">
					<p className="text-sm font-semibold text-theme-secondary-400">
						{percent ? t("COMMON.DOWNLOADED") : t("COMMON.DOWNLOADING")}
					</p>

					{!!percent && (
						<p className="text-sm font-bold text-theme-secondary-text">
							{prettyBytes(total)} / {prettyBytes(transferred)}
						</p>
					)}
				</div>
				<div>
					<div className="flex justify-center">
						<div className={percent ? "" : "animate-spin"}>
							<CircularProgressBar
								showValue={!!percent}
								value={percent ? parseInt(percent.toFixed(0)) : 20}
								size={50}
								strokeWidth={5}
								fontSize={0.8}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

SecondStep.defaultProps = {
	transferred: 0,
	total: 0,
	percent: 0,
};
