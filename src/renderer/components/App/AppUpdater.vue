<template>
	<ModalWindow
		:allow-backdrop-click="false"
		:can-resize="isDownloadAuthorized"
		:title="title"
		:container-classes-minimized="`AppUpdater--minimized ${hasFooter ? 'AppUpdater--minimized--with-footer' : ''}`"
		container-classes="AppUpdater--maximized"
		portal-target="updater"
		class="AppUpdater"
		@close="emitClose"
	>
		<template #default="{ isMaximized }">
			<div class="AppUpdater__content">
				<section v-if="!isDownloadAuthorized">
					<!-- eslint-disable vue/no-v-html -->
					<div class="AppUpdater__release-notes" v-html="releaseNotes" />
					<!-- eslint-enable vue/no-v-html -->
				</section>

				<section v-else class="AppUpdater__authorized">
					<img :src="descriptionImage" class="AppUpdater__authorized__image" />
					<div class="AppUpdater__authorized__downloading">
						<div class="AppUpdater__authorized__downloading__header">
							<span class="AppUpdater__authorized__downloading__header__title">
								{{
									$t(isDownloadFinished ? "APP_UPDATER.DOWNLOADED" : "APP_UPDATER.DOWNLOADING", {
										version: availableRelease.version,
									})
								}}
							</span>
							<div
								v-if="progressUpdate.total > 0"
								class="AppUpdater__authorized__downloading__header__info"
							>
								<span class="font-semibold">{{ formattedPercentage }}</span>
								<span class="ml-2 truncate text-theme-page-text-light"
									>{{ formatter_bytes(progressUpdate.transferred) }} /
									{{ formatter_bytes(progressUpdate.total) }}</span
								>
							</div>
						</div>
						<div class="AppUpdater__progress-bar">
							<ProgressBar
								:size="isMaximized ? 'normal' : 'small'"
								:percent="progressUpdate.percent"
								:status="isDownloadFailed ? 'exception' : 'active'"
							/>
						</div>
					</div>
				</section>
			</div>

			<footer>
				<div v-if="!isDownloadAuthorized" class="AppUpdater__footer">
					<button class="mx-1 blue-button" @click="startDownload">
						{{ $t("APP_UPDATER.DOWNLOAD_NOW") }}
					</button>

					<button class="px-8 mx-1 action-button" @click="emitClose">
						{{ $t("APP_UPDATER.MAYBE_LATER") }}
					</button>
				</div>

				<div v-if="isDownloadFinished" class="AppUpdater__footer">
					<button class="mx-1 blue-button" @click="quitAndInstall">
						{{ $t("APP_UPDATER.QUIT_AND_INSTALL") }}
					</button>
				</div>
			</footer>
		</template>

		<template #footer>
			<footer v-if="isDownloadFailed">
				<div class="ModalWindow__container__footer--error">
					{{ errorMessage ? errorMessage : $t("APP_UPDATER.UNKNOWN_ERROR") }}
				</div>
			</footer>
		</template>
	</ModalWindow>
</template>

<script lang="ts">
import cheerio from "cheerio";
import { ipcRenderer } from "electron";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

import { ModalWindow } from "@/components/Modal";
import { ProgressBar } from "@/components/ProgressBar";
import { AppEvent } from "@/enums";
import releaseService from "@/services/release";

@Component({
	name: "AppUpdater",

	components: {
		ModalWindow,
		ProgressBar,
	},

	computed: { ...mapGetters("updater", ["availableRelease"]) },
})
export default class AppUpdater extends Vue {
	isDownloadAuthorized = false;
	isDownloadFinished = false;
	isDownloadFailed = false;
	isDownloadCancelled = false;

	errorMessage = undefined;

	progressUpdate = {
		bytesPerSecond: 0,
		delta: 0,
		percent: 0,
		total: 0,
		transferred: 0,
		timestamp: undefined,
	};

	inactivityListener = undefined;

	data() {
		return {
			errorMessage: undefined,
			inactivityListener: undefined,
		};
	}

	get formattedPercentage() {
		return `${(this.progressUpdate.percent || 0).toFixed(2)}%`;
	}

	get isLinux() {
		return ["freebsd", "linux", "sunos"].includes(process.platform);
	}

	get isAppImage() {
		return !!process.env.APPIMAGE;
	}

	get title() {
		if (this.isDownloadAuthorized) {
			return null;
		}

		// @ts-ignore
		return `${this.$t("APP_UPDATER.RELEASE_NOTES")} - ${this.availableRelease.version}`;
	}

	get releaseNotes() {
		// @ts-ignore
		return this.__formatReleaseNotes(this.availableRelease.releaseNotes);
	}

	get descriptionImage() {
		// @ts-ignore
		const image = this.session_hasDarkTheme ? "dark" : "light";
		// @ts-ignore
		return this.assets_loadImage(`pages/updater/computer-${image}.svg`);
	}

	get hasFooter() {
		return !this.isDownloadAuthorized || this.isDownloadFinished || this.isDownloadFailed;
	}

	mounted() {
		ipcRenderer.on(AppEvent.UpdaterDownloadProgress, (_, data) => {
			// @ts-ignore
			this.progressUpdate.timestamp = Date.now();
			Object.assign(this.progressUpdate, data);
		});

		ipcRenderer.on(AppEvent.UpdaterUpdateDownloaded, () => {
			Vue.set(this.progressUpdate, "percent", 100);
			this.isDownloadFinished = true;
		});

		ipcRenderer.on(AppEvent.UpdaterError, (error) => {
			this.isDownloadFailed = true;
			// @ts-ignore
			this.errorMessage = error instanceof Error ? error.message : undefined;
		});

		// @ts-ignore
		this.inactivityListener = setInterval(() => {
			this.verifyInactivity();
		}, 30000);
	}

	destroyed() {
		clearInterval(this.inactivityListener);
		if (this.isDownloadCancelled) {
			// Recreate the cancellation token
			setTimeout(() => ipcRenderer.send("updater:check-for-updates"), 200);
		}
	}

	emitClose() {
		if (this.isDownloadAuthorized && !this.isDownloadFinished && !this.isDownloadFailed) {
			// Cancel if file is being downloaded
			this.cancel();
		}
		this.$emit("close");
	}

	cancel() {
		this.isDownloadCancelled = true;
		ipcRenderer.send("updater:cancel");
	}

	startDownload() {
		// Auto update is only supported for AppImage files on Linux
		if (this.isLinux && !this.isAppImage) {
			// @ts-ignore
			this.electron_openExternal(releaseService.latestReleaseUrl);
			this.emitClose();
			return;
		}

		this.isDownloadAuthorized = true;
		ipcRenderer.send("updater:download-update");
	}

	quitAndInstall() {
		ipcRenderer.send("updater:quit-and-install");
	}

	verifyInactivity() {
		if (!this.progressUpdate.timestamp || this.isDownloadFinished || this.isDownloadFailed) {
			return;
		}
		// Is the download idle for >1min?
		// @ts-ignore
		const diff = Date.now() - this.progressUpdate.timestamp;
		if (diff >= 60000) {
			this.isDownloadFailed = true;
			// @ts-ignore
			this.errorMessage = this.$t("APP_UPDATER.NETWORK_ERROR");
			this.cancel();
		}
	}

	__formatReleaseNotes(notes) {
		const $ = cheerio.load(notes);
		const hashTable = $("table").last();
		hashTable.prev("h3").remove(); // Hash title
		hashTable.remove();
		// Convert anchor to span elements
		$("a").each((_, item) => (item.tagName = "span"));
		return $.html();
	}
}
</script>

<style lang="postcss">
.AppUpdater__release-notes {
	max-height: 400px;
	@apply overflow-y-auto;
}
.AppUpdater__release-notes h3 {
	@apply my-4 text-lg;
}
.AppUpdater__release-notes li {
	@apply text-sm text-base leading-tight;
}

.AppUpdater__footer {
	@apply flex flex-row justify-center;
}
.AppUpdater__content + footer {
	@apply mt-5;
}

.AppUpdater--maximized {
	min-width: 40rem;
}

.AppUpdater--minimized {
	width: 24rem;
	height: 9rem;
}

.AppUpdater--minimized--with-footer {
	width: 24rem;
	height: 13rem;
}

.AppUpdater__progress-bar {
	@apply w-full;
}

.AppUpdater__authorized {
	@apply flex;
}
.AppUpdater__authorized__downloading__header {
	@apply flex;
}
.AppUpdater__authorized__downloading__header__title {
	@apply font-semibold;
}
.AppUpdater__authorized__downloading__header__info {
	@apply flex;
}

.AppUpdater--maximized .AppUpdater__authorized {
	@apply flex-col justify-center;
}
.AppUpdater--maximized .AppUpdater__authorized__downloading {
	@apply flex flex-col;
}
.AppUpdater--maximized .AppUpdater__authorized__downloading__header {
	@apply flex-col;
}
.AppUpdater--maximized .AppUpdater__authorized__downloading__header__title {
	@apply text-xl my-4 text-center;
}
.AppUpdater--maximized .AppUpdater__authorized__downloading__header__info {
	@apply my-2 justify-center;
}

.AppUpdater--minimized .AppUpdater__authorized {
	@apply flex-row items-center;
}
.AppUpdater--minimized .AppUpdater__authorized__downloading {
	@apply flex-1;
}
.AppUpdater--minimized .AppUpdater__authorized__downloading__header {
	@apply flex-row items-end justify-between;
}
.AppUpdater--minimized .AppUpdater__authorized__downloading__header__info {
	@apply flex-col text-right text-sm;
}

.AppUpdater--minimized .ModalWindow__container__content {
	@apply flex-1;
}
.AppUpdater--minimized .AppUpdater__footer {
	@apply text-sm;
}

.AppUpdater--maximized .AppUpdater__authorized__image {
	width: 30rem;
	@apply mx-auto;
}
.AppUpdater--minimized .AppUpdater__authorized__image {
	@apply hidden;
}
</style>
