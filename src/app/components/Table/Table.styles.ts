export const defaultTableStyle = `
	table {
		margin: 0;
		padding: 0;
		width: 100%;
		border: none;

		th {
			margin: 0;
			padding-bottom: 12px;
			font-weight: 600;
		}

		th:first-child,
		th:last-child {
			padding: 0;
		}

		tbody {
			tr {

				td:first-child, td:last-child {
					border-bottom: none;
				}

				&:last-child, &:last-child > td {
		            border-bottom: none;
		        }
			}
		}
	}
`;
