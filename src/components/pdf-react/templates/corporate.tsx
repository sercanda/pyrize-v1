import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import { A4 } from '../styles';

Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiEyp8kv8JHgFVrFJA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6V1s.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLCz7V1s.ttf', fontWeight: 700 },
  ],
});

const c = {
  navy: '#0a1e3d',
  blue: '#1e40af',
  gold: '#b8860b',
  text: '#1a1a2e',
  textLight: '#6b7280',
  white: '#ffffff',
  bg: '#f1f5f9',
  border: '#cbd5e1',
};

const s = StyleSheet.create({
  page: { fontFamily: 'Poppins', fontSize: 10, color: c.text, backgroundColor: c.white, padding: 0 },
  hero: { backgroundColor: c.navy, padding: 40, color: c.white },
  heroTitle: { fontSize: 24, fontWeight: 700, color: c.white, marginBottom: 8 },
  heroSub: { fontSize: 11, color: c.white, opacity: 0.85, lineHeight: 1.5 },
  badge: { fontSize: 8, color: c.gold, letterSpacing: 1, marginBottom: 12 },
  section: { padding: '15 40' },
  heading: { fontSize: 14, fontWeight: 700, color: c.navy, marginBottom: 10, borderBottom: `2 solid ${c.gold}`, paddingBottom: 6 },
  card: { backgroundColor: c.bg, borderRadius: 6, padding: 12, marginBottom: 8, borderLeft: `3 solid ${c.blue}` },
  cardTitle: { fontSize: 10, fontWeight: 600, marginBottom: 3 },
  cardText: { fontSize: 9, color: c.textLight, lineHeight: 1.4 },
  grid: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  gridItem: { flex: 1, backgroundColor: c.bg, borderRadius: 6, padding: 10, alignItems: 'center' },
  gridLabel: { fontSize: 8, color: c.textLight },
  gridValue: { fontSize: 11, fontWeight: 600, marginTop: 2 },
  footer: { padding: '8 40', fontSize: 7, color: c.textLight, textAlign: 'center', marginTop: 'auto' },
  pageNum: { position: 'absolute', bottom: 15, right: 40, fontSize: 8, color: c.textLight },
  agentBox: { backgroundColor: c.navy, padding: 20, borderRadius: 8, margin: '10 40', color: c.white, alignItems: 'center' },
  table: { margin: '0 40' },
  tableRow: { flexDirection: 'row', borderBottom: `1 solid ${c.border}`, padding: '5 8' },
  tableHead: { flexDirection: 'row', backgroundColor: c.navy, padding: '6 8', borderRadius: '4 4 0 0' },
  tableCell: { fontSize: 8 },
  tableCellHead: { fontSize: 8, fontWeight: 600, color: c.white },
});

interface Props { istek: any; icerik: any; }

export default function CorporatePdf({ istek, icerik }: Props) {
  const { mulk, danisman } = istek;
  const bolgeler = icerik.bolgeler || [];
  const find = (tip: string) => bolgeler.find((b: any) => b.tip === tip);
  const val = icerik.detayliDegerleme;
  const problems = find('problemler')?.altBolge?.slice(0, 5) || [];
  const solutions = find('cozum')?.altBolge?.slice(0, 3) || [];
  const faqItems = find('faq')?.altBolge?.slice(0, 4) || [];
  const guarantees = find('guarantee')?.altBolge?.slice(0, 3) || [];

  return (
    <Document>
      {/* Page 1: Hero */}
      <Page size="A4" style={s.page}>
        <View style={s.hero}>
          <Text style={s.badge}>KURUMSAL GAYRIMENKUL RAPORU</Text>
          <Text style={s.heroTitle}>{icerik.baslik || 'Profesyonel Gayrimenkul Analizi'}</Text>
          <Text style={s.heroSub}>{mulk.konum} - {mulk.tur === 'arsa' ? 'Arsa' : mulk.tur === 'daire' ? 'Daire' : 'Mulk'} Analizi</Text>
        </View>
        <View style={[s.section, s.grid]}>
          <View style={s.gridItem}>
            <Text style={s.gridLabel}>Konum</Text>
            <Text style={s.gridValue}>{mulk.konum}</Text>
          </View>
          {mulk.metrekare && <View style={s.gridItem}><Text style={s.gridLabel}>Alan</Text><Text style={s.gridValue}>{mulk.metrekare} m2</Text></View>}
          {val?.estimatedValueRange && <View style={s.gridItem}><Text style={s.gridLabel}>Degerleme</Text><Text style={s.gridValue}>{val.estimatedValueRange}</Text></View>}
        </View>
        <View style={s.section}>
          <Text style={{ fontSize: 10, fontWeight: 600 }}>{danisman.adSoyad}</Text>
          <Text style={{ fontSize: 9, color: c.textLight }}>Gayrimenkul Danismani - {danisman.telefon}</Text>
        </View>
        <Text style={s.pageNum}>1 / 6</Text>
      </Page>

      {/* Page 2: Problems */}
      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>Piyasa Riskleri ve Sorunlar</Text></View>
        {problems.map((p: any, i: number) => (
          <View key={i} style={[s.card, { marginLeft: 40, marginRight: 40 }]}>
            <Text style={s.cardTitle}>{i + 1}. {p.baslik}</Text>
            <Text style={s.cardText}>{p.icerik}</Text>
          </View>
        ))}
        <Text style={s.pageNum}>2 / 6</Text>
      </Page>

      {/* Page 3: Solutions */}
      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>Profesyonel Cozum Onerileri</Text></View>
        <View style={[s.grid, { padding: '0 40' }]}>
          {solutions.map((sol: any, i: number) => (
            <View key={i} style={[s.card, { flex: 1 }]}>
              <Text style={s.cardTitle}>{sol.baslik}</Text>
              <Text style={s.cardText}>{sol.icerik}</Text>
            </View>
          ))}
        </View>
        <Text style={s.pageNum}>3 / 6</Text>
      </Page>

      {/* Page 4: Analysis */}
      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>Konum ve Piyasa Analizi</Text></View>
        <View style={{ padding: '0 40' }}>
          <Text style={{ fontSize: 9, lineHeight: 1.5, color: c.textLight }}>{find('location_analysis')?.icerik || `${mulk.konum} bolgesi icin detayli analiz.`}</Text>
        </View>
        {find('target_audience')?.altBolge?.slice(0, 3).map((t: any, i: number) => (
          <View key={i} style={[s.card, { marginLeft: 40, marginRight: 40, marginTop: 6 }]}>
            <Text style={s.cardTitle}>{t.baslik || t.persona}</Text>
            {t.icerik && <Text style={s.cardText}>{t.icerik}</Text>}
          </View>
        ))}
        <Text style={s.pageNum}>4 / 6</Text>
      </Page>

      {/* Page 5: Valuation */}
      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>Degerleme Raporu</Text></View>
        {val?.marketSnapshots?.length > 0 && (
          <View style={[s.grid, { padding: '0 40' }]}>
            {val.marketSnapshots.filter((snap: any) => snap?.title).slice(0, 3).map((snap: any, i: number) => (
              <View key={i} style={s.gridItem}>
                <Text style={s.gridLabel}>{snap.title}</Text>
                <Text style={s.gridValue}>{snap.value}</Text>
              </View>
            ))}
          </View>
        )}
        {val?.comparables?.length > 0 && (
          <View style={s.table}>
            <View style={s.tableHead}>
              <Text style={[s.tableCellHead, { width: '35%' }]}>Adres</Text>
              <Text style={[s.tableCellHead, { width: '20%' }]}>Durum</Text>
              <Text style={[s.tableCellHead, { width: '25%' }]}>Fiyat</Text>
              <Text style={[s.tableCellHead, { width: '20%' }]}>m2</Text>
            </View>
            {val.comparables.filter((comp: any) => comp?.address).slice(0, 4).map((comp: any, i: number) => (
              <View key={i} style={s.tableRow}>
                <Text style={[s.tableCell, { width: '35%' }]}>{comp.address}</Text>
                <Text style={[s.tableCell, { width: '20%' }]}>{comp.status || 'Satista'}</Text>
                <Text style={[s.tableCell, { width: '25%' }]}>{comp.price}</Text>
                <Text style={[s.tableCell, { width: '20%' }]}>{comp.pricePerSqm || '-'}</Text>
              </View>
            ))}
          </View>
        )}
        {faqItems.length > 0 && (
          <View style={{ marginTop: 15 }}>
            <View style={s.section}><Text style={[s.heading, { fontSize: 12 }]}>SSS</Text></View>
            {faqItems.map((f: any, i: number) => (
              <View key={i} style={{ padding: '4 40' }}>
                <Text style={{ fontSize: 9, fontWeight: 600 }}>{f.baslik || f.question}</Text>
                <Text style={{ fontSize: 8, color: c.textLight }}>{f.icerik || f.answer}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={s.pageNum}>5 / 6</Text>
      </Page>

      {/* Page 6: Closing */}
      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>Garantiler</Text></View>
        <View style={[s.grid, { padding: '0 40' }]}>
          {(guarantees.length > 0 ? guarantees : [
            { baslik: 'Sifir On Odeme', icerik: 'Listeleme icin ucret yok.' },
            { baslik: 'Guvenilir Hizmet', icerik: 'Profesyonel danismanlik.' },
            { baslik: '7/24 Iletisim', icerik: 'Her an ulasim.' },
          ]).map((g: any, i: number) => (
            <View key={i} style={[s.gridItem, { borderTop: `2 solid ${c.gold}` }]}>
              <Text style={[s.gridLabel, { fontWeight: 600, color: c.text }]}>{g.baslik}</Text>
              <Text style={[s.gridLabel, { marginTop: 4 }]}>{g.icerik}</Text>
            </View>
          ))}
        </View>
        <View style={s.agentBox}>
          <Text style={{ fontSize: 14, fontWeight: 700, color: c.white }}>{danisman.adSoyad}</Text>
          <Text style={{ fontSize: 9, color: c.white, opacity: 0.9, marginTop: 4 }}>Gayrimenkul Danismani</Text>
          <Text style={{ fontSize: 9, color: c.white, opacity: 0.9, marginTop: 4 }}>Tel: {danisman.telefon} - {danisman.email}</Text>
        </View>
        <View style={s.footer}>
          <Text>{new Date().getFullYear()} {danisman.adSoyad} - Kurumsal Gayrimenkul Raporu</Text>
        </View>
        <Text style={s.pageNum}>6 / 6</Text>
      </Page>
    </Document>
  );
}
