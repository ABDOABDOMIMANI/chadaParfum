import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'شذى للعطور'
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffc107 0%, #ffd740 100%)',
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            fontSize: 280,
            fontWeight: 'bold',
            color: '#1e40af',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          ش
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
