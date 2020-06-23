import { PluginCard } from "domains/plugins/components/PluginCard";
import React from "react";

type PluginGridProps = {
	onDelete: any;
	onSelect: any;
	plugins: any[];
};

export const PluginGrid = ({ onDelete, onSelect, plugins }: PluginGridProps) => {
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

	return <div className="grid grid-cols-4 gap-5">{entries}</div>;
};
