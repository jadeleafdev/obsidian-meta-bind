export interface MetaBindDate {
	date(): number;
	format(format: string): string;
	isValid(): boolean;
	month(): number;
	year(): number;
}
