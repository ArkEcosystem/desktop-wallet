import { Checkbox } from "app/components/Checkbox";
import { ControlButton } from "app/components/ControlButton";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";

import { FilterProps } from "./";

export const VotesFilter = ({ onChange, selectedOption = "all", totalCurrentVotes }: FilterProps) => {
	const { t } = useTranslation();

	return (
		<div data-testid="VotesFilter">
			<Dropdown
				position="right"
				toggleContent={
					<ControlButton isChanged={selectedOption !== "all"}>
						<div className="flex items-center justify-center h-5 w-5">
							<Icon name="Filters" width={17} height={19} />
						</div>
					</ControlButton>
				}
			>
				<div className="py-4 px-6 w-64">
					<label
						className="flex items-center px-2 pb-1 space-x-3 rounded-md cursor-pointer text-theme-secondary-text hover:bg-theme-secondary-100"
						data-testid="VotesFilter__option--all"
					>
						<span>
							<Checkbox
								name="all"
								className="rounded-lg"
								checked={selectedOption === "all"}
								onChange={() => onChange?.("all")}
							/>
						</span>
						<span>{t("VOTE.FILTERS.ALL")}</span>
					</label>

					<Tooltip
						placement="bottom-start"
						content={totalCurrentVotes === 0 && "You have not yet voted for delegates"}
					>
						<label
							className={cn("flex items-center px-2 pb-1 space-x-3 rounded-md", {
								"cursor-pointer text-theme-secondary-text hover:bg-theme-secondary-100": totalCurrentVotes,
								"text-theme-secondary-400": !totalCurrentVotes,
							})}
							data-testid="VotesFilter__option--current"
						>
							<span>
								<Checkbox
									disabled={totalCurrentVotes === 0}
									name="current"
									className="rounded-lg"
									checked={selectedOption === "current"}
									onChange={() => onChange?.("current")}
								/>
							</span>
							<span className="pt-px">{t("VOTE.FILTERS.CURRENT_VOTES")}</span>
						</label>
					</Tooltip>
				</div>
			</Dropdown>
		</div>
	);
};
