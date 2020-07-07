import React from "react";

type Props = {
	asset?: any;
	author?: string;
	date?: string;
	category?: string;
};

export const NewsCardHeader = ({ asset, author, date, category }: Props) => <p>NewsCardHeader</p>;

NewsCardHeader.defaultProps = {};
