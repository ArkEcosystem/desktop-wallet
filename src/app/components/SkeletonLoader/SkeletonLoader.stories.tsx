import { defaultTableStyle } from "app/components/Table/Table.styles";
import React from "react";
import styled from "styled-components";

import { SkeletonLoader } from "./SkeletonLoader";

export default { title: "App / Components / SkeletonLoader" };

const TableWrapper = styled.div`
	${defaultTableStyle}
`;

export const Default = () => (
	<TableWrapper>
		<table className="table-auto">
			<tbody>
				<SkeletonLoader type="table" />
			</tbody>
		</table>
	</TableWrapper>
);
