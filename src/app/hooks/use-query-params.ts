import { useLocation } from "react-router-dom";

// A custom `react-router-dom` hook that is based on `useLocation` to parse
export const useQueryParams = () => new URLSearchParams(useLocation().search);
