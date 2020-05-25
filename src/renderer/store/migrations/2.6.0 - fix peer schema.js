import { StoreBinding, StoreCommit } from "@/enums";

// Update the schema of peers to v2
export default (store) => {
	for (const networkId of Object.keys(store.state.peer.all)) {
		const peerData = store.state.peer.all[networkId];

		let peers = peerData.peers;
		if (!peers.length) {
			continue;
		}

		peers = peers.map((peer) => {
			if (peer.latency) {
				return { ...peer };
			}

			return { ...peer, latency: peer.delay || 0 };
		});

		store.commit(StoreCommit.PeerSetPeers, { peers, networkId });
	}

	// All successful migrations should update this property
	store.dispatch(StoreBinding.AppSetLatestAppliedMigration, "2.6.0");
};
