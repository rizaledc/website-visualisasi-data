export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#111111',
        borderTop: '1px solid rgba(244, 121, 32, 0.2)',
        padding: '48px 24px 32px',
        marginTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#F47920',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
            }}
          >
            Satria Data 2026
          </div>
          <p
            style={{
              fontSize: '13.5px',
              color: '#888888',
              lineHeight: '1.75',
              maxWidth: '320px',
            }}
          >
            Visualisasi data untuk mendukung kajian Kerentanan Pangan terhadap Iklim di Indonesia. Dibuat untuk mendorong kesadaran dan kebijakan berbasis data.
          </p>
        </div>

        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#F47920',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Sumber Data
          </div>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {['BPS — Badan Pusat Statistik', 'BNPB — Badan Nasional Penanggulangan Bencana', 'KLHK — Kementerian Lingkungan Hidup dan Kehutanan', 'Dewan Ketahanan Pangan'].map((s) => (
              <li
                key={s}
                style={{
                  fontSize: '13px',
                  color: '#888888',
                  paddingLeft: '12px',
                  borderLeft: '2px solid rgba(244, 121, 32, 0.4)',
                  lineHeight: 1.5,
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#555555' }}>
          &copy; 2026 Satria Data 2026 — Semua data bersumber dari lembaga resmi pemerintah Indonesia.
        </span>
        <span style={{ fontSize: '12px', color: '#555555' }}>
          Data periode 2018–2025
        </span>
      </div>
    </footer>
  )
}
