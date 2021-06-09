import React from "react";

interface Props {
	onChange: (value: string) => void;
	value: string;
}

export const InputFeeAdvanced = ({ onChange, value }: Props) => <p>advanced</p>;
