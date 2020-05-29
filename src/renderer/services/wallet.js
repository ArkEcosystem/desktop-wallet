import { Crypto, Identities } from "@arkecosystem/crypto";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { version as mainnetVersion } from "@config/networks/mainnet";

import { httpClient } from "@/plugins/http-client";
import store from "@/store";

export default class WalletService {
	/*
	 * Generate a wallet.
	 * It does not check if the wallet is new (no transactions on the blockchain)
	 * @param {Number} pubKeyHash - also known as address or network version
	 * @return {Object}
	 */
	static generate(pubKeyHash, language) {
		const passphrase = BIP39.generate(language);
		const publicKey = Identities.Keys.fromPassphrase(BIP39.normalize(passphrase)).publicKey;
		return {
			address: Identities.Address.fromPublicKey(publicKey, pubKeyHash),
			passphrase,
		};
	}

	/**
	 * Generates a new passphrase to be used for a second passphrase
	 */
	static generateSecondPassphrase(language) {
		return BIP39.generate(language);
	}

	/**
	 * Returns the address that correspond to a passphrase
	 * @param {String} passphrase
	 * @param {Number} pubKeyHash - also known as address or network version
	 * @return {String}
	 */
	static getAddress(passphrase, pubKeyHash) {
		return Identities.Address.fromPassphrase(BIP39.normalize(passphrase), pubKeyHash);
	}

	static getAddressFromPublicKey(publicKey, pubKeyHash) {
		return Identities.Address.fromPublicKey(publicKey, pubKeyHash);
	}

	/**
	 * Returns the address generated from a multi-signature registration.
	 * @param {Object} multiSignatureAsset
	 * @return {String}
	 */
	static getAddressFromMultiSignatureAsset(multiSignatureAsset) {
		return Identities.Address.fromMultiSignatureAsset(multiSignatureAsset);
	}

	/**
	 * Generates the public key belonging to a wallet
	 * @param {Object} wallet
	 * @return {String|null}
	 */
	static getPublicKeyFromWallet(wallet) {
		if (!wallet) {
			return null;
		}

		if (wallet.multiSignature) {
			return this.getPublicKeyFromMultiSignatureAsset(wallet.multiSignature);
		}

		return wallet.publicKey || null;
	}

	/**
	 * Generates the public key belonging to the given passphrase
	 * @param {String} passphrase
	 * @return {String}
	 */
	static getPublicKeyFromPassphrase(passphrase) {
		return Identities.PublicKey.fromPassphrase(BIP39.normalize(passphrase));
	}

	/**
	 * Generates the public key belonging to the given wif
	 * @param {String} wif
	 * @return {String}
	 */
	static getPublicKeyFromWIF(wif) {
		return Identities.PublicKey.fromWIF(wif);
	}

	/**
	 * Returns the public key generated from a multi-signature registration.
	 * @param {Object} multiSignatureAsset
	 * @return {String}
	 */
	static getPublicKeyFromMultiSignatureAsset(multiSignatureAsset) {
		return Identities.PublicKey.fromMultiSignatureAsset(multiSignatureAsset);
	}

	/**
	 * Check if a specific address contain data in the NEO Blockchain
	 * @param {String} address
	 * @returns {Boolean}
	 */
	static async isNeoAddress(address) {
		if (!WalletService.validateAddress(address, mainnetVersion)) {
			return false;
		}

		try {
			const response = await httpClient.get(
				`https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/${address}`,
			);

			return response && response.length > 0;
		} catch {
			return false;
		}
	}

	/**
	 * Check if a wallet can resign as a delegate
	 * @param {Object} wallet
	 * @returns {Boolean}
	 */
	static canResignDelegate(wallet) {
		if (!wallet.isDelegate) {
			return false;
		}

		return !wallet.isResigned;
	}

	/**
	 * Check if a wallet is a business wallet
	 * @param {Object} wallet
	 * @param {Boolean} ignoreResigned
	 * @returns {Boolean}
	 */
	static isBusiness(wallet, ignoreResigned = true) {
		if (!wallet.business) {
			return false;
		}

		if (ignoreResigned) {
			return !!wallet.business.name;
		}

		return !wallet.business.resigned;
	}

	/**
	 * Check if a wallet can resign as a business
	 * @param {Object} wallet
	 * @returns {Boolean}
	 */
	static canResignBusiness(wallet) {
		if (!wallet.business) {
			return false;
		}

		return !wallet.business.resigned;
	}

	/**
	 * Check if a wallet business has bridgechains
	 * @param {Object} wallet
	 * @returns {Boolean}
	 */
	static async hasBridgechains(wallet, vm) {
		try {
			const bridegchains = await vm.$client.fetchBusinessBridgechains(wallet.address);

			return bridegchains.data.filter((bridgechain) => !bridgechain.isResigned).length > 0;
		} catch (error) {
			//
		}

		return false;
	}

	/**
	 * Signs a message by using the given passphrase.
	 * @param {String} message
	 * @param {String} passphrase
	 * @return {String}
	 */
	static signMessage(message, passphrase) {
		return Crypto.Message.sign(message, BIP39.normalize(passphrase));
	}

	/**
	 * Signs a message by using the given wif.
	 * @param {String} message
	 * @param {Number} wif
	 * @param {Object} [network]
	 * @return {String}
	 */
	static signMessageWithWif(message, wif, network) {
		return Crypto.Message.signWithWif(message, wif, network);
	}

	/**
	 * Verify a given message based on the given public key and signature.
	 * @param {String} message
	 * @param {String} publicKey
	 * @param {String} signature
	 * @return {String}
	 */
	static verifyMessage(message, publicKey, signature) {
		return Crypto.Message.verify({ message, publicKey, signature });
	}

	/**
	 * Check that an address is valid.
	 * @param {Number} pubKeyHash - also known as address or network version
	 * @return {Boolean}
	 */
	static validateAddress(address, pubKeyHash) {
		return Identities.Address.validate(address, pubKeyHash);
	}

	/**
	 * TODO: Is this necessary? A passphrase is always valid as long as it's a string.
	 *
	 * Check that a passphrase is valid.
	 * @param {String} passhrase
	 * @param {Number} pubKeyHash - also known as address or network version
	 * @return {Boolean}
	 */
	static validatePassphrase(passphrase, pubKeyHash) {
		const publicKey = Identities.Keys.fromPassphrase(BIP39.normalize(passphrase)).publicKey;
		return Identities.PublicKey.validate(publicKey, pubKeyHash);
	}

	/**
	 * Check that a passphrase is valid bip39 passphrase.
	 * @param {String} passhrase
	 * @param {Number} language - bip39 wordlist language
	 * @return {Boolean}
	 */
	static isBip39Passphrase(passphrase, language) {
		return BIP39.validate(passphrase, language);
	}

	/**
	 * Check that a username is valid
	 *
	 * @param {String} username
	 * @return {Object} { errors: Array, passes: Boolean }
	 */
	static validateUsername(username) {
		const errors = [];

		if (username.length < 1) {
			errors.push({ type: "empty" });
		}

		if (username.length > 20) {
			errors.push({ type: "maxLength" });
		}

		if (store.getters["delegate/byUsername"](username)) {
			errors.push({ type: "exists" });
			// Regex from `@arkecosystem/crypto`
		}

		if (!username.match(/^[a-z0-9!@$&_.]+$/)) {
			errors.push({ type: "invalidFormat" });
		}

		return {
			errors,
			passes: errors.length === 0,
		};
	}

	/**
	 * Check that a password match an address
	 * @param {String} address
	 * @param {String} passhrase
	 * @param {Number} pubKeyHash - also known as address or network version
	 * @return {Boolean}
	 */
	static verifyPassphrase(address, passphrase, pubKeyHash) {
		return address === WalletService.getAddress(BIP39.normalize(passphrase), pubKeyHash);
	}
}
