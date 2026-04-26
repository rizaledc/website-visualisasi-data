import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
  Cell,
} from 'recharts'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const COLORS = ['#F47920', '#F9A25C', '#FDC98A', '#C45A10', '#8B3A08', '#E8651A']
const SEKTOR_COLORS = {
  energi: '#F47920',
  pertanian: '#F9A25C',
  kehutanan: '#FDC98A',
  industri: '#C45A10',
  limbah: '#8B3A08',
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
        maxWidth: '260px',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '6px' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color || '#F47920', marginTop: '3px' }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString('id-ID') : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

function ChartCard({ title, insight, children, innerRef }) {
  const isInView = useInView(innerRef, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={innerRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}
    >
      <div className="chart-title">{title}</div>
      <div className="chart-insight">{insight}</div>
      {children}
    </motion.div>
  )
}

export default function KebakararanEmisi() {
  const [kebakaran, setKebakaran] = useState([])
  const [emisi, setEmisi] = useState([])
  const [loading, setLoading] = useState(true)

  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('/data/kebakaran_hutan.json').then((r) => r.json()),
      fetch('/data/emisi_grk.json').then((r) => r.json()),
    ]).then(([k, e]) => {
      setKebakaran(k)
      setEmisi(e)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-state">Memuat data...</div>
      </div>
    )
  }

  const byProvinsi = kebakaran.reduce((acc, row) => {
    const key = row.provinsi
    if (!acc[key]) acc[key] = 0
    acc[key] += Number(row.luas_terbakar || 0)
    return acc
  }, {})

  const top10Provinsi = Object.entries(byProvinsi)
    .map(([provinsi, luas]) => ({ provinsi, luas }))
    .sort((a, b) => b.luas - a.luas)
    .slice(0, 10)

  const byTahun = kebakaran.reduce((acc, row) => {
    const key = row.tahun
    if (!acc[key]) acc[key] = 0
    acc[key] += Number(row.luas_terbakar || 0)
    return acc
  }, {})

  const trenTahun = Object.entries(byTahun)
    .map(([tahun, luas]) => ({ tahun: Number(tahun), luas }))
    .sort((a, b) => a.tahun - b.tahun)

  const sektorKeys = emisi.length > 0 ? Object.keys(emisi[0]).filter((k) => k !== 'tahun') : []

  const maxLuas = top10Provinsi[0]?.luas || 1

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <div className="page-label">Analisis Kebakaran & Emisi</div>
          <h1 className="page-title">Kebakaran Hutan & Emisi Gas Rumah Kaca</h1>
          <p className="page-desc">
            Peta persebaran kebakaran hutan, tren nasional luas terbakar, dan dinamika emisi GRK per sektor di Indonesia.
          </p>
        </div>

        <ChartCard
          innerRef={ref1}
          title="Top 10 Provinsi — Total Luas Kebakaran Hutan"
          insight="Kalimantan Tengah dan Sumatera Selatan secara konsisten mencatat luas kebakaran tertinggi secara kumulatif."
        >
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={top10Provinsi}
              layout="vertical"
              margin={{ top: 0, right: 80, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="provinsi"
                tick={{ fill: '#CCCCCC', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="luas" name="Luas Terbakar (ha)" radius={[0, 4, 4, 0]}>
                {top10Provinsi.map((entry, i) => (
                  <Cell key={entry.provinsi} fill={i === 0 ? '#F47920' : '#F9A25C'} />
                ))}
                <LabelList
                  dataKey="luas"
                  position="right"
                  formatter={(v) => v.toLocaleString('id-ID')}
                  style={{ fill: '#F9A25C', fontSize: '11px', fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          innerRef={ref2}
          title="Tren Luas Kebakaran Hutan Nasional per Tahun"
          insight="Lonjakan luar biasa terjadi pada 2015 dan 2019, bertepatan dengan tahun El Nino yang memperpanjang musim kemarau."
        >
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={trenTahun} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="tahun" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="orangeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F47920" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F47920" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="luas"
                name="Luas Terbakar (ha)"
                stroke="#F47920"
                strokeWidth={2.5}
                fill="url(#orangeFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          innerRef={ref3}
          title="Emisi GRK per Sektor per Tahun"
          insight="Sektor energi mendominasi emisi dan terus meningkat pasca pandemi, menandai deviasi dari target penurunan emisi nasional."
        >
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={emisi} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="tahun" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#888888', fontSize: '12px', paddingTop: '16px' }} />
              {sektorKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                  stackId="a"
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
