export const defaultTableStyle = `

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
