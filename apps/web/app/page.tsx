export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <h1 className="text-6xl font-bold tracking-tight text-zinc-800 sm:text-7xl">
          Create <span className="text-blue-600">Next.js</span> App
        </h1>
        <p className="mt-6 text-xl text-zinc-600 sm:text-2xl">
          Get started by editing&nbsp;
          <code className="bg-zinc-100 rounded-md p-3 font-mono text-sm">
            app/page.tsx
          </code>
        </p>
      </main>
    </div>
  );
}
