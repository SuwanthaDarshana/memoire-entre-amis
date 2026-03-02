import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mémoire entre Amis — University Memories Together'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-2px',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          Mémoire entre Amis
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          University Memories Together
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            opacity: 0.7,
            borderTop: '1px solid rgba(255,255,255,0.3)',
            paddingTop: 20,
          }}
        >
          Photos · Videos · Moments — All in one place
        </div>
      </div>
    ),
    { ...size }
  )
}
