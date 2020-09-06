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
		td:first-child {
			padding: 0;
		}

		th:last-child,
		td:last-child {
			padding: 0;
		}

		td:first-child,
		td:last-child {
			height: 1px;
		}

		td:first-child > div {
			border-top-left-radius: 0.5rem;
    		border-bottom-left-radius: 0.5rem;
    		margin-left: -2rem;
    		height: 100%;
		}

		td:last-child > div {
			border-top-right-radius: 0.5rem;
    		border-bottom-right-radius: 0.5rem;
    		margin-right: -2rem;
    		height: 100%;
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
