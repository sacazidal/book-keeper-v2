import { poppins } from "@/utils/fonts";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="py-2 border-b-2 shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-3 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-1">
          <Image
            src={"/logo.webp"}
            alt="logo"
            width={35}
            height={35}
            className="w-auto h-auto filter invert dark:invert-0"
            priority
          />
          <h1 className={`${poppins.className} text-xl font-bold`}>
            BookKeeper
          </h1>
        </Link>
        <Button asChild className="bg-red-400 hover:bg-red-500 font-semibold">
          <Link href={"/admin"}>Админка</Link>
        </Button>
      </div>
    </header>
  );
};
export default Header;
