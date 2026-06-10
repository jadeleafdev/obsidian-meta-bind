import { MetaBindBuild } from 'meta-bind-core/src';
import { DEFAULT_SETTINGS, MAX_SYNC_INTERVAL, MIN_SYNC_INTERVAL, weekdays } from 'meta-bind-core/src/Settings';
import { DocsUtils } from 'meta-bind-core/src/utils/DocsUtils';
import type { ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import { MB_PLAYGROUND_VIEW_TYPE } from 'meta-bind-obsidian/src/playground/PlaygroundView';
import { ButtonTemplateSettings } from 'meta-bind-obsidian/src/settings/buttonTemplateSetting/ButtonTemplateSettings';
import { ExcludedFolderSettings } from 'meta-bind-obsidian/src/settings/excludedFoldersSetting/ExcludedFolderSettings';
import { InputFieldTemplateSettings } from 'meta-bind-obsidian/src/settings/inputFieldTemplateSetting/InputFieldTemplateSettings';
import type { MetaBindSettingKey } from 'meta-bind-obsidian/src/settings/SettingsTypes';
import type { App, Setting, SettingDefinitionItem } from 'obsidian';
import { PluginSettingTab } from 'obsidian';

export class MetaBindSettingTab extends PluginSettingTab {
	mb: ObsMetaBind;

	constructor(app: App, mb: ObsMetaBind) {
		super(app, mb.plugin);
		this.mb = mb;
	}

	getSettingDefinitions(): SettingDefinitionItem<MetaBindSettingKey>[] {
		const items: SettingDefinitionItem<MetaBindSettingKey>[] = [];
		const inputFieldTemplateSettings = new InputFieldTemplateSettings(this.app, this.mb, () => this.update());
		const buttonTemplateSettings = new ButtonTemplateSettings(this.mb, () => this.update());
		const excludedFolderSettings = new ExcludedFolderSettings(this.app, this.mb, () => this.update());

		if (this.mb.build === MetaBindBuild.DEV || this.mb.build === MetaBindBuild.CANARY) {
			items.push({
				name: 'Development build',
				desc: `You are using a ${this.mb.build} build (${MB_VERSION}). This build is not intended for production use. Use at your own risk.`,
				render: (setting: Setting): void => {
					setting.setClass('mb-error');
					setting.addButton(cb => {
						cb.setCta();
						cb.setButtonText('Learn about canary builds');
						cb.onClick(() => {
							DocsUtils.open(DocsUtils.linkToCanaryBuilds());
						});
					});
				},
			});
		}

		items.push(
			{
				name: 'Quick access',
				render: (setting: Setting): void => {
					this.addQuickAccessButtons(setting);
				},
			},
			{
				name: 'Enable syntax highlighting',
				desc: 'Enable syntax highlighting for meta bind syntax. Restart required.',
				control: { type: 'toggle', key: 'enableSyntaxHighlighting' },
			},
			{
				name: 'Enable editor right-click menu',
				desc: 'Enable a meta bind menu section in the editor right-click menu. Restart required.',
				control: { type: 'toggle', key: 'enableEditorRightClickMenu' },
			},
			{
				name: 'Enable JavaScript',
				desc: "Enable features that run user written JavaScript. This is potentially DANGEROUS, thus it's disabled by default. Restart required.",
				control: { type: 'toggle', key: 'enableJs' },
			},
			{
				name: 'View fields display null as empty',
				desc: 'Display nothing instead of null, if the frontmatter value is empty, in text view fields.',
				control: { type: 'toggle', key: 'viewFieldDisplayNullAsEmpty' },
			},
			{
				type: 'page',
				name: 'Input field templates',
				desc: 'You can specify input field templates here, and access them using `INPUT[template_name][overrides (optional)]` in your notes.',
				displayValue: inputFieldTemplateSettings.getDisplayValue(),
				status: inputFieldTemplateSettings.getStatus(),
				items: inputFieldTemplateSettings.getDefinitions(),
			},
			{
				type: 'page',
				name: 'Button templates',
				desc: 'You can specify button field templates here, and access them in inline buttons.',
				displayValue: buttonTemplateSettings.getDisplayValue(),
				status: buttonTemplateSettings.getStatus(),
				items: buttonTemplateSettings.getDefinitions(),
			},
			{
				type: 'page',
				name: 'Excluded folders',
				desc: 'You can specify excluded folders here. The plugin will not work within excluded folders.',
				displayValue: excludedFolderSettings.getDisplayValue(),
				status: excludedFolderSettings.getStatus(),
				items: excludedFolderSettings.getDefinitions(),
			},
			{
				type: 'group',
				heading: 'Date and time',
				items: [
					{
						name: 'Date format',
						desc: 'The date format to be used by this plugin. Changing this setting will break the parsing of existing date inputs. Here is a list of all available date tokes https://momentjs.com/docs/#/displaying/.',
						control: { type: 'text', key: 'preferredDateFormat' },
					},
					{
						name: 'First weekday',
						desc: 'Specify the first weekday for the datepicker.',
						control: {
							type: 'dropdown',
							key: 'firstWeekday',
							options: Object.fromEntries(weekdays.map(weekday => [weekday.name, weekday.name])),
						},
					},
				],
			},
			{
				type: 'group',
				heading: 'Advanced',
				items: [
					{
						name: 'Dev mode',
						desc: 'Enable dev mode. Not recommended unless you want to debug this plugin.',
						control: { type: 'toggle', key: 'devMode' },
					},
					{
						name: 'Disable code block restrictions',
						desc: 'Disable restrictions on which input fields can be created in which code blocks. Not recommended unless you know what you are doing.',
						control: { type: 'toggle', key: 'ignoreCodeBlockRestrictions' },
					},
					{
						name: 'Sync interval',
						desc: `The interval in milli-seconds between disk writes. Changing this number is not recommended except if your hard drive is exceptionally slow. Standard: ${DEFAULT_SETTINGS.syncInterval}; Minimum: ${MIN_SYNC_INTERVAL}; Maximum: ${MAX_SYNC_INTERVAL}`,
						control: {
							type: 'number',
							key: 'syncInterval',
							defaultValue: DEFAULT_SETTINGS.syncInterval,
							min: MIN_SYNC_INTERVAL,
							max: MAX_SYNC_INTERVAL,
							step: 1,
							validate: (value: number): string | void => {
								if (value < MIN_SYNC_INTERVAL || value > MAX_SYNC_INTERVAL) {
									return `Sync interval must be between ${MIN_SYNC_INTERVAL} and ${MAX_SYNC_INTERVAL}.`;
								}
							},
						},
					},
				],
			},
		);

		return items;
	}

	getControlValue(key: MetaBindSettingKey): unknown {
		return this.mb.getSettings()[key];
	}

	setControlValue(key: MetaBindSettingKey, value: unknown): void {
		this.mb.updateSettings(settings => {
			settings[key] = value as never;
		});
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('p', {
			text: 'Meta Bind settings require Obsidian 1.13.0 or newer. This app appears to be running an older version.',
		});
	}

	private addQuickAccessButtons(setting: Setting): void {
		setting
			.addButton(cb => {
				cb.setCta();
				cb.setButtonText('Docs');
				cb.onClick(() => {
					DocsUtils.open(DocsUtils.linkToHome());
				});
			})
			.addButton(cb => {
				cb.setButtonText('Open FAQ');
				cb.onClick(() => {
					void this.mb.activateView(MB_PLAYGROUND_VIEW_TYPE);
				});
			})
			.addButton(cb => {
				cb.setButtonText('GitHub');
				cb.onClick(() => {
					DocsUtils.open(DocsUtils.linkToGithub());
				});
			})
			.addButton(cb => {
				cb.setButtonText('Report issue');
				cb.onClick(() => {
					DocsUtils.open(DocsUtils.linkToIssues());
				});
			});
	}
}
