import React from "react";

type Props = {
	children: React.ReactNode;
};

export const NewsCardBody = ({ children }: Props) => <div data-testid="NewsCardBody">{children}</div>;
