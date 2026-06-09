export abstract class DomHelpers {
	abstract get activeDocument(): Document;

	createElement<K extends keyof HTMLElementTagNameMap>(
		parent: HTMLElement,
		tagName: K,
		options?: {
			text?: string;
			class?: string;
		},
	): HTMLElementTagNameMap[K] {
		const el = parent.ownerDocument.createElement(tagName);
		if (options?.text) {
			el.innerText = options.text;
		}
		if (options?.class) {
			el.className = options.class;
		}
		parent.appendChild(el);
		return el;
	}

	showUnloadedMessage(container: HTMLElement, subject: string): void {
		this.empty(container);
		this.removeAllClasses(container);
		this.createElement(container, 'span', {
			text: `[MB_UNLOADED] ${subject}`,
			class: 'mb-warning mb-unloaded',
		});
	}

	addClass(el: HTMLElement, cls: string): void {
		el.classList.add(...cls.split(' '));
	}

	addClasses(el: HTMLElement, cls: string[]): void {
		el.classList.add(...cls);
	}

	removeClass(el: HTMLElement, cls: string): void {
		el.classList.remove(...cls.split(' '));
	}

	hasClass(el: HTMLElement, cls: string): boolean {
		return el.classList.contains(cls);
	}

	removeAllClasses(el: HTMLElement): void {
		el.className = '';
	}

	empty(el: HTMLElement): void {
		el.replaceChildren();
	}
}
