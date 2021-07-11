import { NextApiResponse } from 'next';

export function throwError(res: NextApiResponse, message: string, code: number): never {
	res.status(code).json({
		error: {
			message,
		},
	});

	throw 'custom_error';
}
