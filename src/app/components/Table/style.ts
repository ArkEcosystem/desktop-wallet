import { styled } from "twin.macro";

export const TableWrapper = styled.div`
	padding: 1rem;

	table {
		margin: 0;
		padding: 0;
		width: 100%;
		border: none;

		th {
			margin: 0;
		}
		td {
			vertical-align: middle;
		}

		tbody:before {
			content: "-";
			display: block;
			line-height: 1.4em;
			color: transparent;
		}
	}
`;
