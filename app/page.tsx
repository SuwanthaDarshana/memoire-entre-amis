import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/* ── Inline SVG Icons ── */
function IconCamera({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
  )
}

function IconShield({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

function IconFilm({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  )
}

function IconUsers({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  )
}

function IconSparkles({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}

function IconArrowRight({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function IconPlay({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}

function IconHeart({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  const features = [
    {
      icon: <IconCamera className="w-7 h-7" />,
      title: 'Photo Albums',
      description: 'Organize memories by event, semester, or anything you want. Beautiful masonry grids make every photo shine.',
      color: 'from-indigo-500 to-blue-500',
      bgGlow: 'bg-indigo-500/10',
    },
    {
      icon: <IconFilm className="w-7 h-7" />,
      title: 'Video Moments',
      description: 'Upload and relive video highlights directly in the browser. Powered by Cloudinary for smooth playback.',
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/10',
    },
    {
      icon: <IconShield className="w-7 h-7" />,
      title: 'Private & Secure',
      description: 'Invite-only access for your friend group. Admin controls keep everything organized and safe.',
      color: 'from-emerald-500 to-teal-500',
      bgGlow: 'bg-emerald-500/10',
    },
    {
      icon: <IconUsers className="w-7 h-7" />,
      title: 'Built for Groups',
      description: 'Everyone contributes, everyone enjoys. A shared space built specifically for your crew.',
      color: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#faf9f7] noise-overlay">
      {/* ── Mesh gradient background ── */}
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />

      {/* ── Decorative grid ── */}
      <div className="absolute inset-0 dot-grid opacity-[0.35] pointer-events-none" />

      {/* ── Floating orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-2/3 -left-24 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite 2s',
          }}
        />
        <div
          className="absolute -bottom-24 right-1/4 w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.10) 0%, transparent 70%)',
            animation: 'float 12s ease-in-out infinite 4s',
          }}
        />
      </div>

      {/* ══════════════ NAVIGATION ══════════════ */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <span className="text-white text-sm font-black tracking-tighter">M</span>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 block leading-none">
              Mémoire
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">entre amis</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex btn-ghost text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="btn-primary text-sm glow-ring"
          >
            Get Started
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative z-10 px-6 pt-16 sm:pt-24 lg:pt-32 pb-20 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-lg border border-indigo-100/80 rounded-full px-5 py-2 mb-8 shadow-sm"
            style={{ animation: 'slideUp 0.6s ease forwards' }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-zinc-600 tracking-wide">Private &amp; Secure for Your Group</span>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-zinc-900"
            style={{ animation: 'slideUp 0.7s ease forwards 0.1s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Your Uni{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Memories</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C30 3 70 2 100 5C130 8 170 9 198 4" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            <span className="text-zinc-300">Together Forever</span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-8 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium"
            style={{ animation: 'slideUp 0.7s ease forwards 0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            A private space for you and your friends to collect, share, and relive the moments that made your university years unforgettable.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
            style={{ animation: 'slideUp 0.7s ease forwards 0.3s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <Link
              href="/login"
              className="relative inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold text-white rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 glow-ring"
              style={{ backgroundSize: '200% 100%', animation: 'gradient-flow 4s ease infinite' }}
            >
              Start Collecting Memories
              <IconArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-4 text-base font-semibold text-zinc-600 rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-zinc-300 transition-all duration-300"
            >
              <IconPlay className="w-4 h-4 text-indigo-500" />
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center justify-center gap-4 mt-12"
            style={{ animation: 'slideUp 0.7s ease forwards 0.4s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="flex -space-x-2">
              {['bg-indigo-400', 'bg-purple-400', 'bg-pink-400', 'bg-amber-400'].map((bg, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center`}
                >
                  <span className="text-white text-xs font-bold">{['A', 'M', 'S', 'K'][i]}</span>
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-800">Join your friends</p>
              <p className="text-xs text-zinc-400">Private group sharing</p>
            </div>
          </div>
        </div>

        {/* ── Hero Visual: App Mockup ── */}
        <div
          className="relative mt-20 lg:mt-28 max-w-5xl mx-auto"
          style={{ animation: 'slideUp 0.9s ease forwards 0.5s', opacity: 0, animationFillMode: 'forwards' }}
        >
          {/* Browser chrome */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-zinc-900/10 border border-white/60 overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-100/80 bg-zinc-50/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-zinc-100 rounded-lg px-4 py-1 text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Z" clipRule="evenodd" />
                  </svg>
                  memoire-entre-amis.app
                </div>
              </div>
            </div>

            {/* App content mockup */}
            <div className="p-6 sm:p-8">
              {/* Mock sidebar + grid */}
              <div className="flex gap-6">
                {/* Mini sidebar */}
                <div className="hidden sm:flex flex-col gap-2 w-40 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <IconCamera className="w-4 h-4" />
                    <span className="text-xs font-semibold">Albums</span>
                  </div>
                  {['Dashboard', 'Upload', 'Settings'].map((item) => (
                    <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-400">
                      <div className="w-4 h-4 rounded bg-zinc-100" />
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Photo grid mockup */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { color: 'from-indigo-200 via-indigo-100 to-blue-100', label: 'Graduation Day', span: 'sm:row-span-2' },
                    { color: 'from-purple-200 via-purple-100 to-pink-100', label: 'Campus Walk' },
                    { color: 'from-amber-200 via-amber-100 to-orange-100', label: 'Study Sessions' },
                    { color: 'from-emerald-200 via-emerald-100 to-teal-100', label: 'Road Trip' },
                    { color: 'from-rose-200 via-rose-100 to-pink-100', label: 'Farewell Party' },
                    { color: 'from-sky-200 via-sky-100 to-cyan-100', label: 'Movie Night' },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className={`relative rounded-2xl bg-linear-to-br ${card.color} overflow-hidden group cursor-pointer ${card.span || ''}`}
                      style={{
                        aspectRatio: card.span ? '1/1.2' : '4/3',
                        animation: `slideUp 0.5s ease forwards ${0.6 + i * 0.08}s`,
                        opacity: 0,
                        animationFillMode: 'forwards',
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-white text-xs font-semibold drop-shadow-md">{card.label}</span>
                      </div>
                      {/* Decorative photo icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <IconCamera className="w-8 h-8 text-zinc-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges around mockup */}
          <div
            className="absolute -left-6 top-1/4 hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-zinc-100 px-5 py-3"
            style={{ animation: 'float 7s ease-in-out infinite 1s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <IconCamera className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-800">248 Photos</p>
              <p className="text-[11px] text-zinc-400">This semester</p>
            </div>
          </div>

          <div
            className="absolute -right-6 top-2/3 hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-zinc-100 px-5 py-3"
            style={{ animation: 'float 7s ease-in-out infinite 2s' }}
          >
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <IconHeart className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-800">12 Friends</p>
              <p className="text-[11px] text-zinc-400">Sharing memories</p>
            </div>
          </div>

          {/* Glow behind mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full bg-indigo-400/5 blur-3xl pointer-events-none -z-10" />
        </div>
      </section>

      {/* ══════════════ LOGOS / TECH STRIP ══════════════ */}
      <section className="relative z-10 py-12 border-y border-zinc-100/60">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">Built with modern technologies</p>
          <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap opacity-40">
            {['Next.js', 'React', 'TypeScript', 'Supabase', 'Cloudinary', 'Tailwind'].map((tech) => (
              <span key={tech} className="text-sm font-bold text-zinc-600 tracking-tight">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES BENTO ══════════════ */}
      <section id="features" className="relative z-10 px-6 py-24 lg:py-32 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-indigo-600 mb-4"
            style={{ animation: 'slideUp 0.6s ease forwards' }}
          >
            <IconSparkles className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Features</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900"
            style={{ animation: 'slideUp 0.6s ease forwards 0.1s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Everything you need to{' '}
            <span className="gradient-text">preserve memories</span>
          </h2>
          <p
            className="mt-4 text-zinc-500 max-w-lg mx-auto text-lg"
            style={{ animation: 'slideUp 0.6s ease forwards 0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Simple, beautiful, and designed specifically for your friend group.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`bento-card group ${i === 0 ? 'md:row-span-2' : ''}`}
              style={{
                animation: `slideUp 0.5s ease forwards ${0.1 + i * 0.1}s`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${f.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {f.icon}
              </div>

              <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">{f.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{f.description}</p>

              {/* Decorative glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${f.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* First card gets an illustration */}
              {i === 0 && (
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    'from-indigo-200 to-blue-100',
                    'from-purple-200 to-pink-100',
                    'from-amber-200 to-orange-100',
                    'from-emerald-200 to-teal-100',
                    'from-rose-200 to-pink-100',
                    'from-sky-200 to-cyan-100',
                  ].map((gradient, j) => (
                    <div
                      key={j}
                      className={`aspect-square rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center`}
                      style={{ animation: `float ${5 + j}s ease-in-out infinite ${j * 0.3}s` }}
                    >
                      <IconCamera className="w-4 h-4 text-zinc-400/40" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="relative z-10 px-6 py-24 lg:py-32 bg-zinc-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900">
              Get started in{' '}
              <span className="gradient-text">3 steps</span>
            </h2>
            <p className="mt-4 text-zinc-500 text-lg">No complicated setup. Just memories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign In',
                description: 'Get your invite from the admin. One login and you&apos;re in.',
                accent: 'text-indigo-500 bg-indigo-50 border-indigo-100',
              },
              {
                step: '02',
                title: 'Upload & Organize',
                description: 'Drag and drop photos and videos into albums. Tag them, name them, love them.',
                accent: 'text-purple-500 bg-purple-50 border-purple-100',
              },
              {
                step: '03',
                title: 'Relive Together',
                description: 'Browse, share, and revisit your best moments with friends anytime.',
                accent: 'text-pink-500 bg-pink-50 border-pink-100',
              },
            ].map((step, i) => (
              <div
                key={step.step}
                className="relative text-center"
                style={{ animation: `slideUp 0.6s ease forwards ${0.1 + i * 0.15}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                {/* Step number */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 ${step.accent} text-2xl font-black mb-5`}>
                  {step.step}
                </div>

                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-zinc-200" />
                )}

                <h3 className="text-lg font-bold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA SECTION ══════════════ */}
      <section className="relative z-10 px-6 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl px-8 sm:px-16 py-16 sm:py-20 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white leading-tight">
                Ready to start{' '}
                <br className="hidden sm:block" />
                collecting memories?
              </h2>
              <p className="mt-5 text-zinc-400 text-lg max-w-md mx-auto">
                Your university years happen once. Make sure every moment is saved.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 mt-10 px-8 py-4 text-base font-bold text-zinc-900 bg-white rounded-2xl hover:bg-zinc-100 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started Now
                <IconArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="relative z-10 border-t border-zinc-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">M</span>
            </div>
            <span className="text-sm font-semibold text-zinc-500">Mémoire entre Amis</span>
          </div>
          <p className="text-xs text-zinc-400 flex items-center gap-1">
            Made with <IconHeart className="w-3.5 h-3.5 text-pink-400" /> for university memories
          </p>
        </div>
      </footer>
    </div>
  )
}
