import Image from "next/image";
import HomePage from "./home/page";

export default function Home({ params, searchParams }) {
  return (
    <main>
      <HomePage searchParams={searchParams} />
    </main>
  );
}
