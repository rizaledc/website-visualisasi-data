import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, animate } from 'framer-motion'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      style={{
        background: '#1A1A1A',
        border: '1px solid #F47920',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '13px',
        color: '#F5F5F5',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '6px' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, marginTop: '3px' }}>
          {p.name}: <strong>{p.value?.toLocaleString('id-ID')}</strong>
        </div>
      ))}
    </div>
  )
}

function CountUpCard({ value, label, sublabel, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)

  const numericValue = parseFloat(String(value).replace(/[^0-9.-]/g, ''))

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, numericValue, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (Number.isInteger(numericValue)) {
          setDisplay(Math.round(v).toLocaleString('id-ID'))
        } else {
          setDisplay(v.toFixed(0))
        }
      },
    })
    return controls.stop
  }, [isInView, numericValue])

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      style={{
        background: '#1A1A1A',
        border: '1px solid rgba(244, 121, 32, 0.2)',
        borderRadius: '12px',
        padding: '28px 24px',
      }}
    >
      <div
        style={{
          fontSize: '40px',
          fontWeight: 800,
          color: '#F47920',
          lineHeight: 1,
          marginBottom: '8px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {prefix}{isInView ? display : '0'}{suffix}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F5', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '12px', color: '#888888' }}>{sublabel}</div>
    </motion.div>
  )
}

const stats = [
  { value: '924', label: 'Kejadian bencana tertinggi', sublabel: 'Jawa Tengah, 2019' },
  { value: '15', label: 'Penurunan produksi padi', sublabel: 'Jawa Tengah 2018–2024', prefix: '−', suffix: '%' },
  { value: '1161', label: 'Ribu hektare terbakar', sublabel: 'Nasional, 2023' },
  { value: '752', label: 'Gigagram emisi energi', sublabel: 'CO\u2082e, 2023', suffix: 'K' },
]

const findings = [
  {
    title: 'Bencana Iklim Meningkat',
    desc: 'Frekuensi bencana iklim di Jawa Tengah mencapai puncak 924 kejadian pada 2019. Tren menunjukkan volatilitas yang semakin tinggi dari tahun ke tahun.',
  },
  {
    title: 'Lumbung Pangan Terancam',
    desc: 'Jawa Tengah, salah satu produsen padi terbesar nasional, mencatat penurunan produksi konsisten sejak 2018. Korelasi dengan intensitas bencana iklim signifikan.',
  },
  {
    title: 'Emisi Terus Meningkat',
    desc: 'Sektor energi mendominasi emisi GRK nasional dan terus meningkat pasca pandemi. Tekanan terhadap ekosistem pertanian semakin besar.',
  },
]

export default function Home() {
  const [chartData, setChartData] = useState([])
  const [loadingChart, setLoadingChart] = useState(true)

  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const findingsRef = useRef(null)
  const chartRef = useRef(null)
  const ctaRef = useRef(null)

  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })
  const findingsInView = useInView(findingsRef, { once: true, margin: '-60px' })
  const chartInView = useInView(chartRef, { once: true, margin: '-60px' })
  const ctaInView = useInView(ctaRef, { once: true, margin: '-60px' })

  useEffect(() => {
    fetch('/data/bencana_vs_padi_jateng.json')
      .then((r) => r.json())
      .then((d) => { setChartData(d); setLoadingChart(false) })
      .catch(() => setLoadingChart(false))
  }, [])

  return (
    <div style={{ paddingTop: '64px' }}>
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(ellipse 60% 60% at 90% 90%, rgba(244,121,32,0.06) 0%, transparent 70%), #0D0D0D',
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{ textAlign: 'center', maxWidth: '800px', padding: '0 24px' }}
        >
          <motion.div
            variants={fadeInUp}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: '#F47920',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Analisis Data Iklim & Ketahanan Pangan
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 800,
              color: '#F5F5F5',
              lineHeight: 1.05,
              marginBottom: '16px',
              letterSpacing: '-0.03em',
            }}
          >
            Ketika Bumi Lapar
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            style={{
              fontSize: 'clamp(16px, 2.5vw, 22px)',
              color: '#F9A25C',
              fontWeight: 500,
              marginBottom: '20px',
            }}
          >
            Krisis Pangan di Balik Bencana Iklim Indonesia
          </motion.p>

          <motion.p
            variants={fadeInUp}
            style={{
              fontSize: '15px',
              color: '#999999',
              lineHeight: '1.75',
              maxWidth: '560px',
              margin: '0 auto 36px',
            }}
          >
            Data dari 2018 hingga 2025 mengungkap korelasi mengkhawatirkan antara eskalasi bencana iklim dan penurunan ketahanan pangan nasional.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Link
              to="/bencana"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                border: '1.5px solid #F47920',
                borderRadius: '8px',
                color: '#F47920',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                transition: 'background 0.25s ease, color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F47920'
                e.currentTarget.style.color = '#0D0D0D'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#F47920'
              }}
            >
              Jelajahi Data
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {stats.map((s) => (
              <CountUpCard key={s.label} {...s} />
            ))}
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '20px 0 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            ref={findingsRef}
            initial="hidden"
            animate={findingsInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {findings.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(244,121,32,0.12)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  background: '#1A1A1A',
                  borderLeft: '3px solid #F47920',
                  borderRadius: '8px',
                  padding: '28px',
                }}
              >
                <div
                  style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#F5F5F5',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                  }}
                >
                  {f.title}
                </div>
                <p style={{ fontSize: '13.5px', color: '#888888', lineHeight: '1.75' }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '0 0 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            ref={chartRef}
            initial="hidden"
            animate={chartInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            <div style={{ marginBottom: '24px' }}>
              <div className="page-label">Preview Data</div>
              <h2
                style={{
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 800,
                  color: '#F5F5F5',
                  marginBottom: '8px',
                }}
              >
                Gambaran Awal: Bencana vs Produksi Padi
              </h2>
              <p style={{ fontSize: '14px', color: '#999999', marginBottom: '24px' }}>
                Perbandingan total kejadian bencana iklim dan produksi padi di Jawa Tengah, 2018–2024.
              </p>
            </div>

            <div
              style={{
                background: '#1A1A1A',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              {loadingChart ? (
                <div className="loading-state">Memuat data...</div>
              ) : (
                <ResponsiveContainer width="100%" height={380}>
                  <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="tahun" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#888888', fontSize: '12px', paddingTop: '16px' }} />
                    <Bar yAxisId="left" dataKey="total_bencana" name="Total Bencana" fill="#F47920" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="produksi_padi" name="Produksi Padi (ton)" stroke="#8B3A08" strokeWidth={2.5} dot={{ fill: '#8B3A08', r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>

            <Link
              to="/bencana"
              style={{
                display: 'inline-block',
                padding: '10px 28px',
                border: '1.5px solid #F47920',
                borderRadius: '8px',
                color: '#F47920',
                fontSize: '13.5px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                transition: 'background 0.25s ease, color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F47920'
                e.currentTarget.style.color = '#0D0D0D'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#F47920'
              }}
            >
              Lihat Analisis Lengkap
            </Link>
          </motion.div>
        </div>
      </section>

      <section
        ref={ctaRef}
        style={{
          backgroundColor: '#111111',
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial="hidden"
          animate={ctaInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
          style={{ maxWidth: '700px', margin: '0 auto' }}
        >
          <div
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              color: '#F5F5F5',
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            Data tidak berbohong.
          </div>
          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#888888',
              lineHeight: '1.75',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            Indonesia membutuhkan kebijakan iklim yang secara eksplisit melindungi sistem ketahanan pangan nasional.
          </p>
        </motion.div>
      </section>
    </div>
  )
}
