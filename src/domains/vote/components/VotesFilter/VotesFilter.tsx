import { Checkbox } from "app/components/Checkbox";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
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
					<div className="cursor-pointer">
						<Icon name="Filters" width={20} height={20} />
					</div>
				}
			>
				<div className="py-4 px-6 w-64">
					<label
						className="block flex items-center px-2 pb-1 space-x-3 rounded-md cursor-pointer text-theme-secondary-text hover:bg-theme-secondary-100"
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
							className={`flex items-center block px-2 pb-1 space-x-3 rounded-md ${
								totalCurrentVotes > 0
									? "cursor-pointer text-theme-secondary-text hover:bg-theme-secondary-100"
									: "text-theme-secondary-400"
							}`}
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
