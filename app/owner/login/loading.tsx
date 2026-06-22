const Loading = () => {
  return (
    <main className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
      <section className="flex items-center justify-center bg-ink px-6 py-12 md:px-12">
        <div className="w-full max-w-sm">
          <div className="h-9 w-32 animate-pulse bg-paper/20" />
        </div>
      </section>
      <section className="flex items-center justify-center bg-paper px-6 py-12 md:px-12">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <div className="h-8 w-32 animate-pulse bg-ink/10" />
          <div className="h-3 w-48 animate-pulse bg-ink/10" />
          <div className="mt-6 h-10 animate-pulse bg-ink/10" />
          <div className="h-11 animate-pulse bg-ink/10" />
        </div>
      </section>
    </main>
  )
}

export default Loading
