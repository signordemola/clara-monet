import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <p className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          404
        </p>
        <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
          Page not found
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="border border-ink bg-ink px-6 py-3 text-[11px] tracking-[0.24em] text-paper uppercase transition hover:border-clay hover:bg-clay"
        >
          Back to studio
        </Link>
      </div>
    </main>
  )
}
