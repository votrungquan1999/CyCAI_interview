import { isNil } from 'lodash/fp';

export function mustString(key: string) {
	const value = process.env[key];

	if (key === 'NEXT_PUBLIC_BASE_URL') {
		console.log({
			...process.env,
		});
	}

	if (isNil(value)) {
		throw Error(`missing environment variable ${key}`);
	}

	return value;
}
