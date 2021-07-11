import { Input, Spin } from 'antd';
import { isNil } from 'lodash/fp';
import { useRouter } from 'next/dist/client/router';
import React, { useCallback, useMemo } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { DataFileTable } from '../src/components/data_file_table';
import { DvcFiles, getDvcFiles } from '../src/services/get_dvc_files';

const { Search } = Input;

export default function Home() {
	const [dvcFiles, setDvcFiles] = useState<DvcFiles[]>([]);
	const [repo, setRepo] = useState<string>();
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState<string>();

	const router = useRouter();

	useEffect(() => {
		const currentRepo = router.query['repo'];

		if (!isNil(currentRepo) && typeof currentRepo !== 'string') {
			return;
		}

		setSearchValue(currentRepo);
		setRepo(currentRepo);
	}, [router]);

	useEffect(() => {
		async function getAndSetDvcFiles() {
			if (!repo) {
				setDvcFiles([]);
				return;
			}

			setLoading(true);

			const dvcFiles = await getDvcFiles(repo);
			if (isNil(dvcFiles)) {
				setLoading(false);
				setDvcFiles([]);
				return;
			}
			setDvcFiles(dvcFiles);
			setLoading(false);
		}

		getAndSetDvcFiles();
	}, [repo]);

	const handleSearch = useCallback(
		(value: string) => {
			let url = process.env.NEXT_PUBLIC_BASE_URL;

			if (value) {
				url += `?repo=${value}`;
			}
			router.push(`${url}`);
		},
		[router],
	);

	const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
		setSearchValue(e.target.value);
	}, []);

	const handleGoInsideDir = useCallback(
		(value: string) => {
			let url = process.env.NEXT_PUBLIC_BASE_URL;

			if (value) {
				url += `?repo=${value}`;
			}
			router.push(`${url}`);
		},
		[router],
	);

	const searchBar = useMemo(() => {
		return (
			<Search
				// placeholder='Input Repo URL here'
				value={searchValue}
				onChange={handleSearchChange}
				enterButton='Search'
				size='large'
				onSearch={handleSearch}
				loading={loading}
				disabled={loading}
			/>
		);
	}, [searchValue, handleSearch, loading, handleSearchChange]);

	if (typeof window === 'undefined') {
		return <div></div>;
	}

	return (
		<div className='h-screen'>
			<div className='h-full p-5 pb-0 flex flex-col gap-y-5 items-center'>
				<div className='w-full'>{searchBar}</div>
				<div className='w-full h-full'>
					<Spin size='large' spinning={loading} style={{ maxHeight: 'unset' }}>
						<DataFileTable
							dvcFiles={dvcFiles}
							scrollY={window.innerHeight - 199}
							handleGoInsideDir={handleGoInsideDir}
						/>
					</Spin>
				</div>
			</div>
		</div>
	);
}
