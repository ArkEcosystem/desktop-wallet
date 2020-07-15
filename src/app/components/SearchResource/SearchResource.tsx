import { Modal } from "app/components/Modal";
import { SearchBar } from "app/components/SearchBar";
import React from "react";

type SearchResourceProps = {
	isOpen: boolean;
	title: string;
	description?: string;
	placeholder?: string;
	searchBarExtra?: React.ReactNode;
	children?: React.ReactNode;
	onClose?: any;
	onSearch?: any;
};

export const SearchResource = ({
	isOpen,
	title,
	description,
	placeholder,
	searchBarExtra,
	children,
	onClose,
	onSearch,
}: SearchResourceProps) => (
	<Modal title={title} description={description} isOpen={isOpen} onClose={onClose} size="4xl">
		<div className="-mx-12">
			<SearchBar placeholder={placeholder} className="mt-8" onSearch={onSearch}>
				{searchBarExtra}
			</SearchBar>
		</div>

		<div className="mt-8">{children}</div>
	</Modal>
);
