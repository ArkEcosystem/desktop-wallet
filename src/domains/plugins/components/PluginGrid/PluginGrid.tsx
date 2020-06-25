import { PluginCard } from "domains/plugins/components/PluginCard";
import React from "react";

type PluginGridProps = {
	onDelete: any;
	onSelect: any;
	plugins: any[];
	className?: string;
};

export const PluginGrid = ({ className, onDelete, onSelect, plugins }: PluginGridProps) => {
	const entries = [];

	for (const plugin of plugins) {
		entries.push(
			<PluginCard
				key={plugin.id}
				plugin={plugin}
				onClick={() => onSelect(plugin)}
				onDelete={() => onDelete(plugin)}
			/>,
		);
	}

	return (
		<div data-testid="PluginGrid" className={`grid grid-cols-4 gap-5 ${className}`}>
			{entries}
		</div>
	);
};
