// app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-white to-purple-50" />

      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #c7d2fe 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #ddd6fe 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite 2s' }} />

      <div className="w-full max-w-md relative z-10" style={{ animation: 'slideUp 0.5s ease forwards' }}>
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 shadow-lg mb-4">
            <span className="text-white text-xl font-bold">M</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Mémoire <span className="text-zinc-400 font-normal text-base">entre amis</span></h1>
          <p className="text-zinc-400 text-sm mt-1">Your private memory space</p>
        </div>
        {children}
      </div>
    </div>
  )
}