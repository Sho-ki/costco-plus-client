import Image from "next/image";

export default function BrandHeader() {
  return (
    <div className="flex flex-col items-center md:items-start bg-black shadow-lg max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="relative w-52 h-20">
        <a href='/' >
        <Image
          src="/costco-plus-logo.webp"
          alt="Costco Hacker Logo"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
        </a>
      </div>

      <h1 className="text-blue-300 text-xl md:text-2xl font-bold mt-2 md:mt-4">
        <span className="text-red-500 block">コストコハッカープラス＋</span>
      </h1>
    </div>
  );
}
