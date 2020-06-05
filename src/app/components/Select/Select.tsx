import React from "react";

type SelectProps = React.SelectHTMLAttributes<any>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props: SelectProps, ref) => {
	return (
		<select
			data-testid="select-input"
			ref={ref}
			className="appearance-none block w-full form-select transition-colors duration-200"
			{...props}
		/>
	);
});

Select.displayName = "Select";
