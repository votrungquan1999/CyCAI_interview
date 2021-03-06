// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { spawnSync, execSync } from 'child_process';
import { identity, isNil, negate } from 'lodash/fp';
import fs from 'fs';
import path from 'path';
import { mustString } from '../../src/utils/config';
import { throwError } from '../../src/utils/errors';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		await handleRequest(req, res);
	} catch (error) {
		if (error === 'custom_error') {
			return;
		}
		res.status(500).json({
			error: {
				message: `internal server error ${error.message}`,
			},
		});
	}
}

async function handleRequest(req: NextApiRequest, res: NextApiResponse<any>) {
	if (!req.method || req.method !== 'GET') {
		throwError(res, `method ${req.method} is not allow`, 405);
	}

	const repo = req.query['repo'];

	if (typeof repo !== 'string') {
		throwError(res, 'repo only accept 1 value', 400);
	}

	const fileList = await getAllFiles(repo, res);

	res.status(200).json({
		data: fileList,
	});
}

interface DvcListCmdResponse {
	isout: boolean;
	isdir: boolean;
	isexec: boolean;
	path: string;
}

async function getAllFiles(repo: string, res: NextApiResponse) {
	try {
		const childProcess = execSync(`dvc list ${repo} --dvc-only --show-json`);

		// if (!isNil(childProcess.error)) {
		// 	throw childProcess.error;
		// }

		// const { output } = childProcess;

		const files = JSON.parse(childProcess.toString()) as DvcListCmdResponse[]; //.map((item) => item.path);

		return processFiles(files, repo);
	} catch (error) {
		throwError(res, error.message, 400);
	}
}

async function processFiles(files: DvcListCmdResponse[], repo: string) {
	const fileResponse = [];

	for (const file of files) {
		const filePath = await getFileName(file.path, repo);

		// const fileSize = await getFileSize(file, filePath, repo);

		fileResponse.push({
			path: filePath,
			name: file.path,
			is_dir: file.isdir,
		});
	}

	return fileResponse;
}

async function getFileName(file: string, repo: string) {
	const newPath = repo.includes(' ') ? path.join(repo, file).replace(':/', '://') : repo + ' ' + file;
	return newPath;
}

async function getFileSize(fileName: string, filePath: string, repo: string) {
	const localFileName = nanoid();
	const command = `dvc get ${filePath} -o data/${fileName}`;
	console.log(command);
	const data = execSync(command);
}
