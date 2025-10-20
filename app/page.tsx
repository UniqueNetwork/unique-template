import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.svg"
              alt="Unique Network"
              width={120}
              height={120}
              priority
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to Unique Network
          </h1>
          <a
            href="https://docs.unique.network/build"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
