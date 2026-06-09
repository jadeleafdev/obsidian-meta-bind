import type { MetaBind } from 'meta-bind-core/src';
import type { MetaBindDate } from 'meta-bind-core/src/api/MetaBindDate';

export class DateParser {
	private readonly mb: MetaBind;

	constructor(mb: MetaBind) {
		this.mb = mb;
	}

	public stringify(date: MetaBindDate): string {
		return date.format(this.mb.getSettings().preferredDateFormat);
	}

	public parse(dateString: string): MetaBindDate {
		return this.mb.internal.createDate(dateString, this.mb.getSettings().preferredDateFormat);
	}

	public getDefaultDate(): MetaBindDate {
		return this.mb.internal.createDate();
	}

	public fromDate(date: Date): MetaBindDate {
		return this.mb.internal.createDate(date);
	}

	public getDefaultDay(): number {
		return new Date().getDate();
	}

	public getDefaultMonth(): number {
		return 1;
	}

	public getDefaultYear(): number {
		return new Date().getFullYear();
	}
}
