import React from "react";

import { VoteList } from "./VoteList";

export default { title: "Domains / Vote / Components / VoteList" };

const votes = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 1",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 2",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		delegateName: "Delegate 3",
	},
];

export const Default = () => <VoteList votes={votes} />;
