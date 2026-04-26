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
  LabelList,
  ComposedChart,
  Line,
  ReferenceLine,
  Legend,
  Cell,
} from 'recharts'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const COLORS = ['#F47920', '#F9A25C', '#FDC98A', '#C45A10', '#8B3A08', '#E8651A']

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

function ChartCard({ title, insight, children, innerRef }) {
  const isInView = useInView(innerRef, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={innerRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      style={{
        background: '#1A1A1A',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      <div className="chart-title">{title}</div>
      <div className="chart-insight">{insight}</div>
      {children}
    </motion.div>
  )
}

const BENCANA_KEYS = ['banjir', 'tanah_longsor', 'angin_kencang', 'kekeringan', 'gelombang_pasang', 'kebakaran_lahan']

export default function BencanaIklim() {
  const [bencana, setBencana] = useState([])
  const [bencanaPadi, setBencanaPadi] = useState([])
  const [loading, setLoading] = useState(true)

  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('/data/bencana_iklim.json').then((r) => r.json()),
      fetch('/data/bencana_vs_padi_jateng.json').then((r) => r.json()),
    ]).then(([b, bp]) => {
      setBencana(b)
      setBencanaPadi(bp)
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

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <div className="page-label">Analisis Bencana Iklim</div>
          <h1 className="page-title">Bencana Iklim di Jawa Tengah</h1>
          <p className="page-desc">
            Analisis frekuensi, komposisi, dan dampak bencana iklim terhadap produksi padi di Jawa Tengah selama periode 2018–2024.
          </p>
        </div>

        <ChartCard
          innerRef={ref1}
          title="Total Bencana Iklim per Tahun"
          insight="Puncak kejadian bencana terjadi pada 2019 dengan 924 kejadian, menandai titik tertinggi dalam periode pengamatan."
        >
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={bencana} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="tahun" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total_bencana" name="Total Bencana" fill="#F47920" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="total_bencana" position="top" style={{ fill: '#F9A25C', fontSize: '11px', fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          innerRef={ref2}
          title="Komposisi Jenis Bencana per Tahun"
          insight="Banjir dan tanah longsor mendominasi komposisi bencana iklim setiap tahunnya di seluruh periode."
        >
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={bencana} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="tahun" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#888888', fontSize: '12px', paddingTop: '16px' }} />
              {BENCANA_KEYS.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  stackId="a"
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          innerRef={ref3}
          title="Bencana vs Produksi Padi Jawa Tengah"
          insight="Korelasi negatif terlihat jelas: lonjakan bencana pada 2019 bertepatan dengan penurunan signifikan produksi padi."
        >
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={bencanaPadi} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="tahun" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#888888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#888888', fontSize: '12px', paddingTop: '16px' }} />
              <ReferenceLine
                yAxisId="left"
                x="2019"
                stroke="#FDC98A"
                strokeDasharray="4 3"
                label={{ value: 'Puncak Bencana', fill: '#FDC98A', fontSize: 11, position: 'insideTopRight' }}
              />
              <Bar yAxisId="left" dataKey="total_bencana" name="Total Bencana" fill="#F47920" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="produksi_padi"
                name="Produksi Padi (ton)"
                stroke="#8B3A08"
                strokeWidth={2.5}
                dot={{ fill: '#8B3A08', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
