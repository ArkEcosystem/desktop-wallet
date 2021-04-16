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
				variant="votesFilter"
				dropdownClass="shadow-votes-filter"
				position="right"
				toggleContent={
					<ControlButton isChanged={selectedOption !== "all"} isActive={selectedOption !== "all"}>
						<div className="flex items-center justify-center w-5 h-5">
							<Icon name="Filters" width={17} height={19} />
						</div>
					</ControlButton>
				}
			>
				<div className="w-56 flex flex-col space-y-5 px-10 py-7 text-theme-secondary-700 dark:text-theme-secondary-200">
					<label
						className="h-5 flex items-center space-x-3 rounded-md cursor-pointer"
						data-testid="VotesFilter__option--all"
					>
						<Checkbox name="all" checked={selectedOption === "all"} onChange={() => onChange?.("all")} />
						<span className="text-base font-medium">{t("VOTE.FILTERS.ALL")}</span>
					</label>

					<Tooltip
						placement="bottom-start"
						content={totalCurrentVotes === 0 && "You have not yet voted for delegates"}
					>
						<label
							className={cn("h-5 flex items-center space-x-3 rounded-md", {
								"cursor-pointer": totalCurrentVotes,
								"text-theme-secondary-500 dark:text-theme-secondary-700": !totalCurrentVotes,
							})}
							data-testid="VotesFilter__option--current"
						>
							<Checkbox
								disabled={totalCurrentVotes === 0}
								name="current"
								checked={selectedOption === "current"}
								onChange={() => onChange?.("current")}
							/>
							<span className="text-base font-medium">{t("VOTE.FILTERS.CURRENT_VOTES")}</span>
						</label>
					</Tooltip>
				</div>
			</Dropdown>
		</div>
	);
};
