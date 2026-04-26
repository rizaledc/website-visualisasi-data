import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
  Legend,
} from 'recharts'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const LINE_COLORS = ['#F47920', '#F9A25C', '#FDC98A', '#C45A10', '#8B3A08', '#E8651A', '#FFB347']

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

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
          {p.name}: <strong>{p.value?.toLocaleString('id-ID')}</strong>
        </div>
      ))}
    </div>
  )
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const d = payload[0]?.payload
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
      <div style={{ fontWeight: 600, marginBottom: '6px' }}>{d?.tahun}</div>
      <div>Curah Hujan: <strong>{d?.curah_hujan?.toLocaleString('id-ID')} mm</strong></div>
      <div>Produktivitas: <strong>{d?.produktivitas?.toLocaleString('id-ID')} ton/ha</strong></div>
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

export default function CurahHujan() {
  const [curahHujan, setCurahHujan] = useState([])
  const [curahProduk, setCurahProduk] = useState([])
  const [loading, setLoading] = useState(true)

  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('/data/curah_hujan.json').then((r) => r.json()),
      fetch('/data/curah_vs_produktivitas.json').then((r) => r.json()),
    ]).then(([ch, cp]) => {
      setCurahHujan(ch)
      setCurahProduk(cp)
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

  const years = curahHujan.length > 0 ? Object.keys(curahHujan[0]).filter((k) => k !== 'bulan') : []

  const monthlyAvg = BULAN.map((nama, i) => {
    const row = curahHujan.find((r) => r.bulan === i + 1 || r.bulan === nama) || curahHujan[i]
    if (!row) return { bulan: nama, rata_rata: 0 }
    const vals = years.map((y) => Number(row[y] || 0)).filter(Boolean)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { bulan: nama, rata_rata: Math.round(avg) }
  })

  const medianX = curahProduk.length
    ? [...curahProduk].sort((a, b) => a.curah_hujan - b.curah_hujan)[Math.floor(curahProduk.length / 2)]?.curah_hujan
    : 0
  const medianY = curahProduk.length
    ? [...curahProduk].sort((a, b) => a.produktivitas - b.produktivitas)[Math.floor(curahProduk.length / 2)]?.produktivitas
    : 0

  const lineData = BULAN.map((nama, i) => {
    const row = curahHujan[i] || {}
    const entry = { bulan: nama }
    years.forEach((y) => { entry[y] = Number(row[y] || 0) })
    return entry
  })

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <div className="page-label">Analisis Curah Hujan</div>
          <h1 className="page-title">Curah Hujan & Produktivitas Padi</h1>
          <p className="page-desc">
            Pola curah hujan bulanan, variasi antar tahun, dan korelasinya terhadap produktivitas padi nasional.
          </p>
        </div>

        <ChartCard
          innerRef={ref1}
          title="Curah Hujan Bulanan Multi-Tahun"
          insight="Setiap garis mewakili satu tahun. Pola musiman terlihat jelas dengan puncak curah hujan di awal dan akhir tahun."
        >
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="bulan" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#888888', fontSize: '12px', paddingTop: '16px' }} />
              {years.map((y, i) => (
                <Line
                  key={y}
                  type="monotone"
                  dataKey={y}
                  name={y}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  strokeWidth={1.8}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          innerRef={ref2}
          title="Rata-rata Curah Hujan per Bulan"
          insight="Januari dan Desember memiliki rata-rata curah hujan tertinggi, sementara Juli–Agustus merupakan periode terkering."
        >
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={monthlyAvg} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="bulan" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rata_rata" name="Rata-rata (mm)" fill="#F47920" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="rata_rata" position="top" style={{ fill: '#F9A25C', fontSize: '10px', fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          innerRef={ref3}
          title="Curah Hujan Tahunan vs Produktivitas Padi"
          insight="Scatter plot memperlihatkan pola hubungan antara total curah hujan tahunan dan produktivitas padi nasional."
        >
          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="curah_hujan"
                name="Curah Hujan"
                type="number"
                tick={{ fill: '#888888', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Curah Hujan (mm)', position: 'insideBottom', offset: -10, fill: '#888888', fontSize: 12 }}
              />
              <YAxis
                dataKey="produktivitas"
                name="Produktivitas"
                type="number"
                tick={{ fill: '#888888', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Produktivitas (ton/ha)', angle: -90, position: 'insideLeft', offset: 10, fill: '#888888', fontSize: 12 }}
              />
              <Tooltip content={<ScatterTooltip />} />
              {medianX > 0 && (
                <ReferenceLine
                  x={medianX}
                  stroke="rgba(244,121,32,0.4)"
                  strokeDasharray="4 3"
                  label={{ value: 'Median X', fill: '#F9A25C', fontSize: 10 }}
                />
              )}
              {medianY > 0 && (
                <ReferenceLine
                  y={medianY}
                  stroke="rgba(244,121,32,0.4)"
                  strokeDasharray="4 3"
                  label={{ value: 'Median Y', fill: '#F9A25C', fontSize: 10, position: 'insideTopRight' }}
                />
              )}
              <Scatter
                data={curahProduk}
                fill="#F47920"
                name="Data"
              >
                <LabelList dataKey="tahun" position="top" style={{ fill: '#F9A25C', fontSize: '10px', fontWeight: 600 }} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
