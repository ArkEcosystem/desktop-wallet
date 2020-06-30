import { InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import React from "react";

type InputFeeProps = {
	defaultValue: number;
	min: number;
	max: number;
	step: number;
	selectionBarState: any;
};

export const InputFee = ({ defaultValue, min, max, step, selectionBarState }: InputFeeProps) => (
	<div className="flex space-x-2">
		<div className="flex-1">
			<InputRange name="fee" defaultValue={defaultValue} min={min} max={max} step={step} />
		</div>
		<div>
			<SelectionBar>
				<SelectionBarOption value={1} {...selectionBarState}>
					Last
				</SelectionBarOption>
				<SelectionBarOption value={2} {...selectionBarState}>
					Min
				</SelectionBarOption>
				<SelectionBarOption value={3} {...selectionBarState}>
					Average
				</SelectionBarOption>
			</SelectionBar>
		</div>
	</div>
);
