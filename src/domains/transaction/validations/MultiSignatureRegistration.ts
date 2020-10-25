export const multiSignatureRegistration = (t: any) => ({
	participants: () => ({
		required: true,
		validate: (value: any[]) => Array.isArray(value) && value.length > 1,
	}),
	minParticipants: (participants: any[]) => ({
		required: true,
		min: 2,
		max: Math.max(2, participants?.length || 0),
	}),
});
