import Link from "next/link";
import Image from "next/image";
import AuthLinks from "../authLinks/authLink";

export const Navbar = () => {
  return (
    <div className="flex flex-wrap items-center justify-between sm:text-xl py-3 px-4 mb-8 shadow-md rounded-b-xl ">
      <div className="font-bold">
        <Link href="/">
          BLOG<sup>S</sup>
        </Link>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Link href="/">Home</Link>
        <AuthLinks />
      </div>
    </div>
  );
};
