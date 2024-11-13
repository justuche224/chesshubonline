import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

export const Header = ({ label }: { label: string }) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1
        className={cn(
          "text-3xl font-semibold flex justify-center items-center gap-x-2",
          font.className
        )}
      >
        <Image
          src="https://i.postimg.cc/MpMMYSTX/chesshub.png"
          width={44}
          height={44}
          alt="loo"
        />
        <span>CHESSHUB</span>
      </h1>
      <p className=" text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
