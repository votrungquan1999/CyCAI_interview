import axios from 'axios';
import { mustString } from '../utils/config';

interface DvcFilesResp {
	data: DvcFiles[];
	error?: {
		message: string;
	};
}

export interface DvcFiles {
	path: string;
	name: string;
	is_dir: boolean;
}

export async function getDvcFiles(repo: string) {
	const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

	try {
		const resp = await axios.get<DvcFilesResp>(`${baseURL}/api/dvc_files?repo=${repo}`, {
			responseType: 'json',

			validateStatus: (status) => status < 500,
		});

		if (resp.status !== 200) {
			console.log(resp.data);
			alert(`get dvc files failed due to ${resp.data.error?.message}`);
			return;
		}

		return resp.data.data;
	} catch (error) {
		console.log(error);
		alert(`get dvc files failed has internal server error`);
		return;
	}
}
