import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiEyp8kv8JHgFVrFJA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6V1s.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLCz7V1s.ttf', fontWeight: 700 },
  ],
});

const c = {
  black: '#0a0a0a',
  gold: '#c9a84c',
  goldLight: '#f5edda',
  text: '#1a1a1a',
  textLight: '#8a8a8a',
  white: '#ffffff',
  bg: '#faf9f7',
};

const s = StyleSheet.create({
  page: { fontFamily: 'Poppins', fontSize: 10, color: c.text, backgroundColor: c.bg, padding: 0 },
  hero: { backgroundColor: c.black, padding: 50, color: c.white, alignItems: 'center' },
  heroTitle: { fontSize: 26, fontWeight: 700, color: c.gold, marginBottom: 10, textAlign: 'center' },
  heroSub: { fontSize: 11, color: c.white, opacity: 0.8, textAlign: 'center', lineHeight: 1.5 },
  goldLine: { width: 60, height: 2, backgroundColor: c.gold, marginVertical: 12 },
  section: { padding: '15 50' },
  heading: { fontSize: 15, fontWeight: 700, color: c.black, marginBottom: 10, letterSpacing: 1 },
  card: { backgroundColor: c.white, borderRadius: 4, padding: 14, marginBottom: 8, borderBottom: `2 solid ${c.gold}` },
  cardTitle: { fontSize: 10, fontWeight: 600, marginBottom: 3 },
  cardText: { fontSize: 9, color: c.textLight, lineHeight: 1.5 },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  stat: { flex: 1, backgroundColor: c.white, padding: 12, alignItems: 'center', borderBottom: `2 solid ${c.gold}` },
  statLabel: { fontSize: 8, color: c.textLight, letterSpacing: 0.5 },
  statValue: { fontSize: 12, fontWeight: 700, marginTop: 3, color: c.black },
  footer: { padding: '10 50', fontSize: 7, color: c.textLight, textAlign: 'center', marginTop: 'auto' },
  pageNum: { position: 'absolute', bottom: 15, right: 50, fontSize: 8, color: c.textLight },
  agentBox: { backgroundColor: c.black, padding: 25, margin: '10 50', color: c.white, alignItems: 'center', borderRadius: 4 },
});

interface Props { istek: any; icerik: any; }

export default function LuxuryPdf({ istek, icerik }: Props) {
  const { mulk, danisman } = istek;
  const bolgeler = icerik.bolgeler || [];
  const find = (tip: string) => bolgeler.find((b: any) => b.tip === tip);
  const val = icerik.detayliDegerleme;
  const problems = find('problemler')?.altBolge?.slice(0, 5) || [];
  const solutions = find('cozum')?.altBolge?.slice(0, 3) || [];
  const guarantees = find('guarantee')?.altBolge?.slice(0, 3) || [];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.hero}>
          <View style={s.goldLine} />
          <Text style={s.heroTitle}>{icerik.baslik || 'Ozel Gayrimenkul Sunumu'}</Text>
          <Text style={s.heroSub}>{mulk.konum}</Text>
          <View style={s.goldLine} />
        </View>
        <View style={[s.section, s.grid]}>
          <View style={s.stat}><Text style={s.statLabel}>KONUM</Text><Text style={s.statValue}>{mulk.konum}</Text></View>
          {mulk.metrekare && <View style={s.stat}><Text style={s.statLabel}>ALAN</Text><Text style={s.statValue}>{mulk.metrekare} m2</Text></View>}
          {val?.estimatedValueRange && <View style={s.stat}><Text style={s.statLabel}>DEGER</Text><Text style={s.statValue}>{val.estimatedValueRange}</Text></View>}
        </View>
        <Text style={s.pageNum}>1 / 6</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>DIKKAT EDILMESI GEREKENLER</Text></View>
        {problems.map((p: any, i: number) => (
          <View key={i} style={[s.card, { marginHorizontal: 50 }]}>
            <Text style={s.cardTitle}>{p.baslik}</Text>
            <Text style={s.cardText}>{p.icerik}</Text>
          </View>
        ))}
        <Text style={s.pageNum}>2 / 6</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>COZUM ONERILERI</Text></View>
        <View style={[s.grid, { padding: '0 50' }]}>
          {solutions.map((sol: any, i: number) => (
            <View key={i} style={[s.card, { flex: 1 }]}>
              <Text style={s.cardTitle}>{sol.baslik}</Text>
              <Text style={s.cardText}>{sol.icerik}</Text>
            </View>
          ))}
        </View>
        <Text style={s.pageNum}>3 / 6</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>KONUM ANALIZI</Text></View>
        <View style={{ padding: '0 50' }}>
          <Text style={{ fontSize: 9, lineHeight: 1.5, color: c.textLight }}>{find('location_analysis')?.icerik || 'Detayli konum analizi.'}</Text>
        </View>
        <Text style={s.pageNum}>4 / 6</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>DEGERLEME</Text></View>
        {val?.marketSnapshots?.filter((snap: any) => snap?.title).slice(0, 3).length > 0 && (
          <View style={[s.grid, { padding: '0 50' }]}>
            {val.marketSnapshots.filter((snap: any) => snap?.title).slice(0, 3).map((snap: any, i: number) => (
              <View key={i} style={s.stat}><Text style={s.statLabel}>{snap.title}</Text><Text style={s.statValue}>{snap.value}</Text></View>
            ))}
          </View>
        )}
        <Text style={s.pageNum}>5 / 6</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>GARANTILER</Text></View>
        <View style={[s.grid, { padding: '0 50' }]}>
          {(guarantees.length > 0 ? guarantees : [
            { baslik: 'Sifir On Odeme', icerik: 'Hicbir on odeme yok.' },
            { baslik: 'Guvenilir Hizmet', icerik: 'Profesyonel danismanlik.' },
            { baslik: '7/24 Iletisim', icerik: 'Her an ulasim.' },
          ]).map((g: any, i: number) => (
            <View key={i} style={s.stat}><Text style={[s.statLabel, { fontWeight: 600, color: c.text }]}>{g.baslik}</Text><Text style={[s.statLabel, { marginTop: 4 }]}>{g.icerik}</Text></View>
          ))}
        </View>
        <View style={s.agentBox}>
          <View style={s.goldLine} />
          <Text style={{ fontSize: 16, fontWeight: 700, color: c.gold }}>{danisman.adSoyad}</Text>
          <Text style={{ fontSize: 9, color: c.white, opacity: 0.8, marginTop: 4 }}>Gayrimenkul Danismani</Text>
          <Text style={{ fontSize: 9, color: c.white, opacity: 0.8, marginTop: 4 }}>{danisman.telefon} - {danisman.email}</Text>
        </View>
        <View style={s.footer}><Text>{new Date().getFullYear()} {danisman.adSoyad} - Ozel Sunum</Text></View>
        <Text style={s.pageNum}>6 / 6</Text>
      </Page>
    </Document>
  );
}
