import cn from "./mergeClassName";


type SpinnerProps = {
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	color?: string;
	spinnerClassName?: string;
};

const CustomerSelectSpinner: React.FC<SpinnerProps> = ({
	size = "sm",
	color = "",
	spinnerClassName,
}) => {
	return (
		<div
			className={cn(
				` border-2 !border-t-transparent border-brand-red rounded-full animate-spin ease-in-out`,
				size === "xs" && "w-4 h-4",
				size === "sm" && "w-6 h-6",
				size === "md" && "w-10 h-10",
				size === "lg" && "w-12 h-12",
				size === "xl" && "w-16 h-16",
				color,
				spinnerClassName,
			)}
		></div>
	);
};

export default CustomerSelectSpinner;
