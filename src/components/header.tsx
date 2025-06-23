import { Sparkles } from "lucide-react";
import Link from "next/link";

import HeaderClient from "./headerClient";

export default function Header() {
  return (
    <header className="sticky z-50 flex justify-center items-center top-0 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100 w-full">
      <div className="container justify-between flex items-center h-14 sm:h-16 px-4 sm:px-6 lg:px-8 xl:px-24">
        <Link className="flex items-center gap-2" href="/">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500" />
          <span className="text-lg sm:text-xl font-bold text-teal-900">
            WordCraft
          </span>
        </Link>

        {/* <HeaderClient /> */}
      </div>
    </header>
  );
}
