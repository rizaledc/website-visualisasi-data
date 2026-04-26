import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
  Legend,
  Cell,
} from 'recharts'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
        maxWidth: '240px',
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

export default function ProduksiPadi() {
  const [nasional, setNasional] = useState([])
  const [provinsi, setProvinsi] = useState([])
  const [kontribusi, setKontribusi] = useState([])
  const [loading, setLoading] = useState(true)

  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('/data/padi_nasional.json').then((r) => r.json()),
      fetch('/data/padi_provinsi.json').then((r) => r.json()),
      fetch('/data/kontribusi_jateng.json').then((r) => r.json()),
    ]).then(([n, p, k]) => {
      setNasional(n)
      setProvinsi(p)
      setKontribusi(k)
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

  const top10Provinsi = [...provinsi]
    .sort((a, b) => b.produksi - a.produksi)
    .slice(0, 10)

  const avgKontribusi = kontribusi.length
    ? kontribusi.reduce((s, r) => s + (Number(r.kontribusi_persen) || 0), 0) / kontribusi.length
    : 0

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <div className="page-label">Analisis Produksi Padi</div>
          <h1 className="page-title">Produksi Padi Nasional & Regional</h1>
          <p className="page-desc">
            Tren produksi padi nasional, distribusi antarprovinsi, dan peran strategis Jawa Tengah dalam ketahanan pangan Indonesia.
          </p>
        </div>

        <ChartCard
          innerRef={ref1}
          title="Tren Produksi Padi Nasional 2018–2025"
          insight="Produksi nasional menunjukkan fluktuasi dengan penurunan pada 2020–2021 dan pemulihan bertahap setelahnya."
        >
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={nasional} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="tahun" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="padiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F47920" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F47920" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="produksi"
                name="Produksi (juta ton)"
                stroke="#F47920"
                strokeWidth={2.5}
                fill="url(#padiGrad)"
              >
                <LabelList
                  dataKey="produksi"
                  position="top"
                  formatter={(v) => (typeof v === 'number' ? v.toFixed(1) : v)}
                  style={{ fill: '#F9A25C', fontSize: '10px', fontWeight: 600 }}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          innerRef={ref2}
          title="Top 10 Provinsi Produsen Padi 2024"
          insight="Jawa Timur, Jawa Tengah, dan Jawa Barat menjadi tiga provinsi dengan kontribusi produksi padi terbesar secara nasional."
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
              <Bar dataKey="produksi" name="Produksi (juta ton)" radius={[0, 4, 4, 0]}>
                {top10Provinsi.map((entry, i) => (
                  <Cell key={entry.provinsi} fill={i === 0 ? '#F47920' : '#F9A25C'} />
                ))}
                <LabelList
                  dataKey="produksi"
                  position="right"
                  formatter={(v) => (typeof v === 'number' ? v.toFixed(2) : v)}
                  style={{ fill: '#F9A25C', fontSize: '11px', fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          innerRef={ref3}
          title="Kontribusi Jawa Tengah terhadap Produksi Padi Nasional"
          insight="Kontribusi Jawa Tengah cenderung menurun, mengindikasikan tekanan struktural pada produktivitas daerah lumbung pangan utama ini."
        >
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={kontribusi} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="tahun" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#888888', fontSize: '12px', paddingTop: '16px' }} />
              {avgKontribusi > 0 && (
                <ReferenceLine
                  y={avgKontribusi}
                  stroke="rgba(244,121,32,0.5)"
                  strokeDasharray="4 3"
                  label={{ value: `Rata-rata ${avgKontribusi.toFixed(1)}%`, fill: '#F9A25C', fontSize: 11, position: 'insideTopRight' }}
                />
              )}
              <Bar dataKey="kontribusi_persen" name="Kontribusi (%)" fill="#F47920" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="kontribusi_persen"
                name="Tren"
                stroke="#8B3A08"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
