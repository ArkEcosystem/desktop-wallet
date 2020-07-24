import { InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import React from "react";
import { useTranslation } from "react-i18next";

type InputFeeProps = {
	defaultValue: number;
	min: number;
	max: number;
	step: number;
	selectionBarState: any;
};

export const InputFee = ({ defaultValue, min, max, step, selectionBarState }: InputFeeProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex space-x-2">
			<div className="flex-1">
				<InputRange name="fee" defaultValue={defaultValue} min={min} max={max} step={step} />
			</div>
			<div>
				<SelectionBar>
					<SelectionBarOption value={1} {...selectionBarState}>
						{t("TRANSACTION.FEES.LAST")}
					</SelectionBarOption>
					<SelectionBarOption value={2} {...selectionBarState}>
						{t("TRANSACTION.FEES.MIN")}
					</SelectionBarOption>
					<SelectionBarOption value={3} {...selectionBarState}>
						{t("TRANSACTION.FEES.AVERAGE")}
					</SelectionBarOption>
				</SelectionBar>
			</div>
		</div>
	);
};
