import dedent from "dedent";

export class BranchError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "BranchError";
	}
}

export class BranchExistsError extends BranchError {
	constructor(args: { name: string }) {
		super(dedent`
The branch with id "${args.name}" already exists.

`);
		this.name = "BranchAlreadyExistsError";
	}
}
