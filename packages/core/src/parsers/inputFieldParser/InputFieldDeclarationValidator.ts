import type { MetaBind } from 'meta-bind-core/src';
import { InputFieldArgumentType, InputFieldType } from 'meta-bind-core/src/config/FieldConfigs';
import type { AbstractInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/AbstractInputFieldArgument';
import { InputFieldArgumentContainer } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/InputFieldArgumentContainer';
import { InputFieldArgumentFactory } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/InputFieldArgumentFactory';
import type { BindTargetScope } from 'meta-bind-core/src/metadata/BindTargetScope';
import type { BindTargetDeclaration } from 'meta-bind-core/src/parsers/bindTargetParser/BindTargetDeclaration';
import type {
	InputFieldDeclaration,
	UnvalidatedInputFieldDeclaration,
} from 'meta-bind-core/src/parsers/inputFieldParser/InputFieldDeclaration';
import type { ParsingResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';
import { ParsingValidationError } from 'meta-bind-core/src/parsers/ParsingError';
import { ErrorCollection } from 'meta-bind-core/src/utils/errors/ErrorCollection';
import { ErrorLevel } from 'meta-bind-core/src/utils/errors/MetaBindErrors';

export class InputFieldDeclarationValidator {
	unvalidatedDeclaration: UnvalidatedInputFieldDeclaration;
	errorCollection: ErrorCollection;
	filePath: string;
	mb: MetaBind;

	constructor(mb: MetaBind, unvalidatedDeclaration: UnvalidatedInputFieldDeclaration, filePath: string) {
		this.mb = mb;
		this.unvalidatedDeclaration = unvalidatedDeclaration;
		this.filePath = filePath;

		this.errorCollection = new ErrorCollection('input field declaration');
	}

	public validate(scope: BindTargetScope | undefined): InputFieldDeclaration {
		const inputFieldType = this.validateInputFieldType();
		const bindTarget = this.validateBindTarget(scope);
		const argumentContainer = this.validateArguments(inputFieldType);

		const declaration: InputFieldDeclaration = {
			declarationString: this.unvalidatedDeclaration.declarationString,
			inputFieldType: inputFieldType,
			bindTarget: bindTarget,
			argumentContainer: argumentContainer,
			errorCollection: this.errorCollection.merge(this.unvalidatedDeclaration.errorCollection),
		};

		this.checkForDeprecation(declaration);

		return declaration;
	}

	private validateInputFieldType(): InputFieldType {
		const inputFieldType = this.unvalidatedDeclaration.inputFieldType;

		for (const entry of Object.entries(InputFieldType)) {
			if (entry[1] === inputFieldType?.value) {
				return entry[1];
			}
		}

		this.errorCollection.add(
			new ParsingValidationError(
				ErrorLevel.ERROR,
				'Declaration Validator',
				`Encountered invalid identifier. Expected an input field type but received '${inputFieldType?.value}'.`,
				this.unvalidatedDeclaration.declarationString,
				inputFieldType?.position,
			),
		);

		return InputFieldType.INVALID;
	}

	private checkForDeprecation(_declaration: InputFieldDeclaration): void {
		// nothing to check atm
	}

	private validateBindTarget(scope: BindTargetScope | undefined): BindTargetDeclaration | undefined {
		if (this.unvalidatedDeclaration.bindTarget !== undefined) {
			try {
				return this.mb.bindTargetParser.validate(
					this.unvalidatedDeclaration.declarationString,
					this.unvalidatedDeclaration.bindTarget,
					this.filePath,
					scope,
				);
			} catch (e) {
				this.errorCollection.add(e);
			}
		}
		return undefined;
	}

	private validateArguments(inputFieldType: InputFieldType): InputFieldArgumentContainer {
		const argumentContainer = new InputFieldArgumentContainer();

		for (const argument of this.unvalidatedDeclaration.arguments) {
			const argumentType = this.validateArgumentType(argument.name);
			if (argumentType === InputFieldArgumentType.INVALID) {
				continue;
			}

			const inputFieldArgument: AbstractInputFieldArgument =
				InputFieldArgumentFactory.createInputFieldArgument(argumentType);

			if (!inputFieldArgument.isAllowed(inputFieldType)) {
				this.errorCollection.add(
					new ParsingValidationError(
						ErrorLevel.WARNING,
						'Declaration Validator',
						`Failed to parse input field arguments. Argument "${
							argument.name.value
						}" is only applicable to "${inputFieldArgument.getAllowedFieldsAsString()}" input fields.`,
						this.unvalidatedDeclaration.declarationString,
						argument.name.position,
					),
				);

				continue;
			}

			try {
				inputFieldArgument.parseValue(argument.value);
			} catch (e) {
				this.errorCollection.add(e);
				continue;
			}

			argumentContainer.add(inputFieldArgument);
		}

		try {
			argumentContainer.validate();
		} catch (e) {
			this.errorCollection.add(e);
		}

		return argumentContainer;
	}

	private validateArgumentType(argumentType: ParsingResultNode): InputFieldArgumentType {
		for (const entry of Object.entries(InputFieldArgumentType)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
			if (entry[1] === argumentType.value) {
				return entry[1];
			}
		}

		this.errorCollection.add(
			new ParsingValidationError(
				ErrorLevel.WARNING,
				'Declaration Validator',
				`Encountered invalid identifier. Expected an input field argument type but received '${argumentType.value}'.`,
				this.unvalidatedDeclaration.declarationString,
				argumentType.position,
			),
		);

		return InputFieldArgumentType.INVALID;
	}
}
