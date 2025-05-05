import EmptyIcon from "@/assets/images/EmptyIcon.png";
import Image from "next/image";


const Empty = ({
  title,
  description,
}: {

  title: string;
  description?: string;
}) => {
  return (
    <div className="h-[50vh]  grid place-content-center bg-background rounded-2xl my-6 py-4">
      <div className="w-fit mx-auto mb-5">
        
        <Image
          src={EmptyIcon}
          alt="empty"
          className="w-[100px] h-[100px] "
        />
      </div>

      <h2 className="text-dark font-bold text-xl text-center mb-2">
        {title}
      </h2>

      <p className="text-[#757575] text-center">{description}</p>
    </div>
  );
};

export default Empty;
