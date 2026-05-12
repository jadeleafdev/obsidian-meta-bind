import { Plugin } from 'obsidian';
import type { MetaBindPluginSettings } from 'packages/core/src/Settings';
import { DEFAULT_SETTINGS } from 'packages/core/src/Settings';
import { areObjectsEqual } from 'packages/core/src/utils/Utils';
import type { ObsAPI } from 'packages/obsidian/src/ObsAPI';
import { ObsMetaBind } from 'packages/obsidian/src/ObsMB';

// @ts-expect-error TS6133
import 'packages/obsidian/src/styles.css';

export default class ObsMetaBindPlugin extends Plugin {
	// @ts-expect-error TS2564
	mb: ObsMetaBind;
	// @ts-expect-error TS2564
	api: ObsAPI;
	// @ts-expect-error TS2564
	settings: MetaBindPluginSettings;

	async onload(): Promise<void> {
		MB_DEBUG && console.log(`meta-bind | Main >> loading`);
		MB_DEBUG && console.time('meta-bind | Main >> load-time');

		// settings
		await this.loadSettings();

		this.mb = new ObsMetaBind(this);
		this.api = this.mb.api;

		this.mb.updateInternalSettings(this.settings);

		MB_DEBUG && console.timeEnd('meta-bind | Main >> load-time');
	}

	onunload(): void {
		this.mb.destroy();

		MB_DEBUG && console.log(`meta-bind | Main >> unload`);
	}

	async loadSettings(): Promise<void> {
		MB_DEBUG && console.log(`meta-bind | Main >> loading settings`);

		const loadedSettings = ((await this.loadData()) ?? {}) as MetaBindPluginSettings;

		if (typeof loadedSettings === 'object' && loadedSettings != null) {
			// @ts-expect-error TS2339 remove old config field
			delete loadedSettings.inputTemplates;
			// @ts-expect-error TS2339 remove old config field
			delete loadedSettings.useUsDateInputOrder;
		}

		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedSettings);

		if (!areObjectsEqual(loadedSettings, this.settings)) {
			await this.saveSettings();
		}
	}

	async saveSettings(): Promise<void> {
		MB_DEBUG && console.log(`meta-bind | Main >> settings save`);

		await this.saveData(this.settings);
	}

	async onExternalSettingsChange(): Promise<void> {
		await this.loadSettings();
		this.mb.updateInternalSettings(this.settings);
	}
}
