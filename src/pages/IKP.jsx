import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  LabelList,
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
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function IKP() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartReady, setChartReady] = useState(false)

  const insightRef = useRef(null)
  const tableRef = useRef(null)

  const insightInView = useInView(insightRef, { once: true, margin: '0px' })
  const tableInView = useInView(tableRef, { once: true, margin: '0px' })

  useEffect(() => {
    fetch('/data/ikp_provinsi.json')
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
        setTimeout(() => setChartReady(true), 80)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-state">Memuat data...</div>
      </div>
    )
  }

  const sorted = [...data].sort((a, b) => a.ikp - b.ikp)
  const avg = data.length ? data.reduce((s, r) => s + (Number(r.ikp) || 0), 0) / data.length : 0
  const belowAvg = data.filter((r) => r.ikp < avg).length

  const top5 = [...data].sort((a, b) => b.ikp - a.ikp).slice(0, 5)
  const bot5 = [...data].sort((a, b) => a.ikp - b.ikp).slice(0, 5)

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <div className="page-label">Analisis Ketahanan Pangan</div>
          <h1 className="page-title">Indeks Ketahanan Pangan Provinsi 2025</h1>
          <p className="page-desc">
            Peringkat dan distribusi Indeks Ketahanan Pangan (IKP) seluruh provinsi di Indonesia, disertai perbandingan dengan rata-rata nasional.
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
          <div className="chart-title">IKP Seluruh Provinsi — Diurutkan Ascending</div>
          <div className="chart-insight">
            Garis vertikal menandai rata-rata nasional IKP. Jawa Tengah ditampilkan dengan warna utama.
          </div>
          {chartReady ? (
            <ResponsiveContainer width="100%" height={600}>
              <BarChart
                data={sorted}
                layout="vertical"
                margin={{ top: 4, right: 80, left: 10, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="provinsi"
                  tick={{ fill: '#CCCCCC', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={155}
                />
                <Tooltip content={<CustomTooltip />} />
                {avg > 0 && (
                  <ReferenceLine
                    x={avg}
                    stroke="rgba(244,121,32,0.7)"
                    strokeDasharray="4 3"
                    label={{ value: `Rata-rata ${avg.toFixed(1)}`, fill: '#F9A25C', fontSize: 10, position: 'insideTopRight' }}
                  />
                )}
                <Bar dataKey="ikp" name="IKP" radius={[0, 4, 4, 0]}>
                  {sorted.map((entry) => (
                    <Cell
                      key={entry.provinsi}
                      fill={entry.provinsi === 'Jawa Tengah' ? '#F47920' : '#F9A25C'}
                    />
                  ))}
                  <LabelList
                    dataKey="ikp"
                    position="right"
                    formatter={(v) => Number(v).toFixed(1)}
                    style={{ fill: '#AAAAAA', fontSize: '10px', fontWeight: 500 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="loading-state">Memuat grafik...</div>
          )}
        </div>

        <motion.div
          ref={insightRef}
          initial="hidden"
          animate={insightInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
          style={{
            background: '#1A1A1A',
            borderLeft: '3px solid #F47920',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#F47920', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            Ringkasan Analisis
          </div>
          <p style={{ fontSize: '15px', color: '#F5F5F5', lineHeight: '1.75' }}>
            Dari total <strong style={{ color: '#F47920' }}>{data.length} provinsi</strong>, sebanyak{' '}
            <strong style={{ color: '#F47920' }}>{belowAvg} provinsi</strong> mencatat IKP di bawah rata-rata nasional sebesar{' '}
            <strong style={{ color: '#F47920' }}>{avg.toFixed(2)}</strong>. Kesenjangan antara provinsi tertinggi dan terendah mencapai{' '}
            <strong style={{ color: '#F47920' }}>
              {(sorted[sorted.length - 1]?.ikp - sorted[0]?.ikp).toFixed(2)} poin
            </strong>
            , mengindikasikan disparitas ketahanan pangan yang signifikan antardaerah.
          </p>
        </motion.div>

        <motion.div
          ref={tableRef}
          initial="hidden"
          animate={tableInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F47920', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              5 Provinsi IKP Tertinggi
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(244,121,32,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#F47920', fontWeight: 600, borderBottom: '1px solid rgba(244,121,32,0.2)' }}>Provinsi</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#F47920', fontWeight: 600, borderBottom: '1px solid rgba(244,121,32,0.2)' }}>IKP</th>
                </tr>
              </thead>
              <tbody>
                {top5.map((row, i) => (
                  <tr key={row.provinsi} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 12px', color: '#F5F5F5' }}>
                      <span style={{ color: '#F47920', marginRight: '8px', fontWeight: 600 }}>{i + 1}.</span>
                      {row.provinsi}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#F9A25C', textAlign: 'right', fontWeight: 600 }}>
                      {Number(row.ikp).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#C45A10', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              5 Provinsi IKP Terendah
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(244,121,32,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#F47920', fontWeight: 600, borderBottom: '1px solid rgba(244,121,32,0.2)' }}>Provinsi</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#F47920', fontWeight: 600, borderBottom: '1px solid rgba(244,121,32,0.2)' }}>IKP</th>
                </tr>
              </thead>
              <tbody>
                {bot5.map((row, i) => (
                  <tr key={row.provinsi} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 12px', color: '#F5F5F5' }}>
                      <span style={{ color: '#C45A10', marginRight: '8px', fontWeight: 600 }}>{i + 1}.</span>
                      {row.provinsi}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#C45A10', textAlign: 'right', fontWeight: 600 }}>
                      {Number(row.ikp).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
