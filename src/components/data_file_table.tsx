import { Button, Dropdown, Menu, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo } from 'react';
import { DvcFiles } from '../services/get_dvc_files';
import { DownOutlined } from '@ant-design/icons';

interface DataFileTableProps {
	dvcFiles: DvcFiles[];
	scrollY: number;
	handleGoInsideDir: (value: string) => any;
}

export function DataFileTable(props: DataFileTableProps) {
	const { dvcFiles, scrollY, handleGoInsideDir } = props;

	const columns = useMemo(() => {
		return getColumn(handleGoInsideDir);
	}, [handleGoInsideDir]);

	// console.log(dvcFiles);

	return (
		<Table
			columns={columns}
			dataSource={dvcFiles.sort((a, b) => (a.name > b.name ? 1 : -1))}
			bordered
			scroll={{ y: scrollY }}
		/>
	);
}

function getColumn(handleGoInsideDir: (value: string) => any) {
	const columns: ColumnsType<any> = [
		{
			title: 'File Name',
			dataIndex: 'name',
			width: 200,
			ellipsis: true,
			render: (value) => {
				return (
					<Tooltip placement='topLeft' title={value}>
						{value}
					</Tooltip>
				);
			},
		},
		{
			title: 'File Path',
			dataIndex: 'path',
			ellipsis: true,
			render: (value) => {
				return (
					<Tooltip placement='topLeft' title={value}>
						{value}
					</Tooltip>
				);
			},
		},
		{
			title: 'Is Directory',
			dataIndex: 'is_dir',
			width: 120,
			render: (value) => {
				return <div>{value ? 'Yes' : 'No'}</div>;
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 120,
			render: (value: DvcFiles, _, index) => {
				const menu = (
					<Menu>
						<Menu.Item
							key={index}
							disabled={!value.is_dir}
							onClick={() => {
								console.log(value.path);
								handleGoInsideDir(value.path);
							}}
						>
							Go Inside
						</Menu.Item>
					</Menu>
				);

				return (
					<Dropdown overlay={menu} trigger={['click']}>
						<Button>
							Actions <DownOutlined />
						</Button>
					</Dropdown>
				);
			},
		},
	];

	return columns;
}
