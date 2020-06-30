import React from "react";

import { Pagination } from "./Pagination";

export default { title: "App / Components / Pagination" };

export const Default = () => <Pagination totalCount={12} itemsPerPage={4} onSelectPage={console.log} currentPage={1} />;
