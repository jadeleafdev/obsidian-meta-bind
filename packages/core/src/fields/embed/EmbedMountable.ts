import type { MetaBind } from 'meta-bind-core/src';
import { EMBED_MAX_DEPTH } from 'meta-bind-core/src/config/FieldConfigs';
import { FieldMountable } from 'meta-bind-core/src/fields/FieldMountable';
import { MDLinkParser } from 'meta-bind-core/src/parsers/MarkdownLinkParser';
import { ErrorCollection } from 'meta-bind-core/src/utils/errors/ErrorCollection';

export class EmbedMountable extends FieldMountable {
	depth: number;
	content: string;
	markdownUnloadCallback: (() => void) | undefined;

	constructor(mb: MetaBind, uuid: string, filePath: string, depth: number, content: string) {
		super(mb, uuid, filePath);

		this.depth = depth;
		this.content = content;
	}

	async parseContent(): Promise<{ content?: string; error?: string }> {
		const lines = this.content
			.split('\n')
			.map(line => line.trim())
			.filter(line => line.length > 0);

		if (lines.length === 0) {
			return { content: '' };
		}
		if (lines.length > 1) {
			return { error: 'Embed may only contain one link' };
		}

		const firstLine = lines[0];
		const link = MDLinkParser.parseLink(firstLine);
		if (!link.internal) {
			return { error: `${firstLine} is not an internal link` };
		}
		const filePath = this.mb.file.getPathByName(link.target, this.getFilePath());
		if (filePath === undefined) {
			return { error: `"${link.target}" is not created yet` };
		}
		return { content: await this.mb.file.read(filePath) };
	}

	exceedsMaxDepth(): boolean {
		return this.depth > EMBED_MAX_DEPTH;
	}

	createEmbedMessage(target: HTMLElement, message: string): void {
		this.mb.domHelpers.createElement(target, 'span', {
			text: message,
			class: 'mb-embed-message',
		});
	}

	async renderContent(target: HTMLElement): Promise<void> {
		try {
			if (this.exceedsMaxDepth()) {
				this.createEmbedMessage(target, 'Max embed depth exceeded');
				return;
			}

			const content = await this.parseContent();
			if (content.error) {
				this.createEmbedMessage(target, content.error);
				return;
			}
			if (content.content === undefined) {
				this.createEmbedMessage(target, 'Embed content not found');
				return;
			}

			const renderContent = content.content.replace(
				/(```+|~~~+)meta-bind-embed.*/g,
				`$1meta-bind-embed-internal-${this.depth + 1}`,
			);

			this.markdownUnloadCallback = await this.mb.internal.renderMarkdown(
				renderContent,
				target,
				this.getFilePath(),
			);
		} catch (e) {
			const errorCollection = new ErrorCollection('Embed');
			errorCollection.add(e);

			this.mb.internal.createErrorIndicator(target, {
				errorCollection: errorCollection,
			});
		}
	}

	protected onMount(targetEl: HTMLElement): void {
		if (MB_DEBUG) console.debug('meta-bind | EmbedMountable >> mount', this.content);
		super.onMount(targetEl);

		this.mb.domHelpers.addClass(targetEl, 'mb-embed');

		void this.renderContent(targetEl);
	}

	protected onUnmount(targetEl: HTMLElement): void {
		if (MB_DEBUG) console.debug('meta-bind | EmbedMountable >> unmount', this.content);
		super.onUnmount(targetEl);

		this.mb.domHelpers.removeClass(targetEl, 'mb-embed');

		this.markdownUnloadCallback?.();

		this.mb.domHelpers.showUnloadedMessage(targetEl, 'Embed');
	}
}
