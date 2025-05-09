interface Props {
	row: number;
	col: number;
}




const TableLoading: React.FC<Props> = ({ row, col }) => {
	return (
		<div className="bg-background rounded-2xl my-6 p-4 ">
			{[...Array(col)].map((_, colIndex) => (
				<div
					key={colIndex}
					className="flex flex-col gap-2 "
				>
					<div className=" flex flex-row justify-between items-center ">
						{[...Array(row)].map((_, rowIndex) => (
							<div
								key={rowIndex}
								className="leading-relaxed mb-2 h-5 animate-pulse bg-gray-300"
								style={{ width: `calc(${100 / row}% - 1rem)` }}
							></div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default TableLoading;
