import { describe, expect, test } from 'bun:test';
import { ButtonActionType, ButtonStyleType, type ButtonConfig } from 'meta-bind-core/src/config/ButtonConfig';
import { TestMetaBind } from '../__mocks__/TestPlugin';

const mb = new TestMetaBind();

const BUTTON_YAML = `label: Test Button
style: default
action:
  type: command
  command: test-command
`;

const EXPECTED_BUTTON_CONFIG: ButtonConfig = {
	label: 'Test Button',
	style: ButtonStyleType.DEFAULT,
	action: {
		type: ButtonActionType.COMMAND,
		command: 'test-command',
	},
};

describe('ButtonParser.parseConfig', () => {
	test('parses and validates plain button YAML', () => {
		expect(mb.buttonParser.parseConfig(BUTTON_YAML)).toEqual(EXPECTED_BUTTON_CONFIG);
	});

	test('parses and validates fenced button YAML with surrounding whitespace', () => {
		const input = `

\`\`\`yaml
${BUTTON_YAML}
\`\`\`

`;

		expect(mb.buttonParser.parseConfig(input)).toEqual(EXPECTED_BUTTON_CONFIG);
	});

	test('parses and validates fenced button meta-bind-button with surrounding whitespace', () => {
		const input = `

\`\`\`meta-bind-button
${BUTTON_YAML}
\`\`\`

`;

		expect(mb.buttonParser.parseConfig(input)).toEqual(EXPECTED_BUTTON_CONFIG);
	});

	test('throws for invalid button YAML', () => {
		expect(() =>
			mb.buttonParser.parseConfig(`label: Test Button
style: default
`),
		).toThrow();
	});
});

describe('ButtonParser.fromString', () => {
	test('returns a validated config for fenced button YAML', () => {
		const res = mb.buttonParser.fromString(`\`\`\`
${BUTTON_YAML}
\`\`\``);

		expect(res.errorCollection.hasErrors()).toBe(false);
		expect(res.config).toEqual(EXPECTED_BUTTON_CONFIG);
	});

	test('returns errors for invalid button YAML', () => {
		const res = mb.buttonParser.fromString(`label: Test Button
style: default
`);

		expect(res.errorCollection.hasErrors()).toBe(true);
		expect(res.config).toBeUndefined();
	});
});
