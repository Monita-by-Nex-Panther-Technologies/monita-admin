
// import { LuXCircle } from "react-icons/lu";
import { X, XCircle } from "lucide-react";
import { useEffect } from "react";
import cn from "./mergeClassName";
import { Button } from "./button";

interface PopupWrapper {
	isActive: boolean;
	toggleIsActive: (activeState: boolean) => void;
	popupHeader?: string;
	modalClassName?: string;
	children: React.ReactNode;
}

const PopWrapper: React.FC<PopupWrapper> = ({
	isActive,
	toggleIsActive,
	popupHeader,
	modalClassName,
	children,
}) => {
	useEffect(() => {
		if (isActive) {
			document.querySelector("body")!.style!.overflow = "hidden";
		} else {
			document.querySelector("body")!.style!.overflow = "auto";
		}
	}, [isActive]);

	return (


		<div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50">
		<div className="bg-white rounded-lg w-full max-w-md -mt-20 overflow-hidden shadow-xl">
			{/* Header */}
			<div className="flex justify-between items-center p-6 border-b">
				<h2 className="text-xl font-semibold">{popupHeader}</h2>
				<Button
					variant="outline"
					size="icon"
					className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-gray-100 border-none"
					onClick={() => toggleIsActive(false)}
				>
					<X size={16} className="text-gray-500" />
				</Button>
			</div>

			<div className="p-6">{children}</div>
		</div>
	</div>

		// <div
		// 	className={`fixed inset-0 z-50 h-full w-full place-items-center gap-4  bg-black/50 backdrop-blur-[5px] duration-500 ease-linear overflow-y-auto ${
		// 		isActive
		// 			? "animate-fadeIn hidden lg:grid"
		// 			: "animate-fadeOut hidden"
		// 	}`}
		// >
		// 	<div
		// 		className={cn(
		// 			"h-auto z-50 my-6 max-h-[calc(100%-56px)] custom-scrollbar overflow-y-auto w-[calc(100%-10%)] grid gap-8 card px-6 py-6 min-[500px]:w-3/5 lg:w-2/5 xl:w-1/3",
		// 			modalClassName,
		// 		)}
		// 	>

		// <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50">
        //     <div className="bg-white rounded-lg w-full max-w-md -mt-20 overflow-hidden shadow-xl">


		// 		<div className="relative mb-3">
		// 			<h2 className="font-semibold text-xl dark:text-gray-300">
		// 				{popupHeader}
		// 			</h2>

		// 			<button
		// 				className="absolute right-0 dark:text-gray-300 top-[calc(1.25rem/4)]"
		// 				type="button"
		// 				onClick={() => toggleIsActive(false)}
		// 				aria-label="Close modal"
		// 			>
		// 				<XCircle
		// 					size={20}
		// 					strokeWidth={1}
		// 				/>
		// 			</button>
		// 		</div>


		// 		<div className="">{children}</div>
		// 	</div>
		// </div>
	);
};

export default PopWrapper;
