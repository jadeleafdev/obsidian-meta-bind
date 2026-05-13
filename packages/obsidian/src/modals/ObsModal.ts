import type { ModalOptions } from 'meta-bind-core/src/api/InternalAPI';
import type { IModal } from 'meta-bind-core/src/modals/IModal';
import type { ModalContent } from 'meta-bind-core/src/modals/ModalContent';
import { DomHelpers } from 'meta-bind-core/src/utils/Utils';
import type { ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import { Modal } from 'obsidian';

export class ObsModal extends Modal implements IModal {
	content: ModalContent;
	options: ModalOptions | undefined;

	constructor(mb: ObsMetaBind, content: ModalContent, options?: ModalOptions) {
		super(mb.app);

		this.options = options;
		this.content = content;
		content.setModal(this);
	}

	onOpen(): void {
		if (this.options?.title) {
			this.titleEl.setText(this.options.title);
		}

		if (this.options?.classes) {
			DomHelpers.addClasses(this.modalEl, this.options.classes);
		}

		this.content.mount(this.contentEl);
	}

	onClose(): void {
		this.content.unmount();
	}
}
