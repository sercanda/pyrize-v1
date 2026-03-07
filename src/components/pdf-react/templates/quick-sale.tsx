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
  orange: '#f97316',
  orangeLight: '#fff7ed',
  dark: '#1a1a2e',
  text: '#1a1a2e',
  textLight: '#6b7280',
  white: '#ffffff',
  green: '#16a34a',
  red: '#dc2626',
};

const s = StyleSheet.create({
  page: { fontFamily: 'Poppins', fontSize: 10, color: c.text, backgroundColor: c.white, padding: 0 },
  hero: { backgroundColor: c.orange, padding: 35, color: c.white },
  heroTitle: { fontSize: 22, fontWeight: 700, color: c.white, marginBottom: 6 },
  heroSub: { fontSize: 11, color: c.white, opacity: 0.9 },
  urgentBadge: { backgroundColor: c.red, padding: '4 10', borderRadius: 4, alignSelf: 'flex-start', marginBottom: 10 },
  urgentText: { fontSize: 8, fontWeight: 600, color: c.white },
  section: { padding: '12 35' },
  heading: { fontSize: 14, fontWeight: 700, color: c.dark, marginBottom: 8 },
  card: { backgroundColor: c.orangeLight, borderRadius: 6, padding: 10, marginBottom: 6 },
  cardTitle: { fontSize: 10, fontWeight: 600, marginBottom: 2 },
  cardText: { fontSize: 9, color: c.textLight, lineHeight: 1.4 },
  grid: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  stat: { flex: 1, backgroundColor: c.orangeLight, borderRadius: 6, padding: 10, alignItems: 'center' },
  footer: { padding: '8 35', fontSize: 7, color: c.textLight, textAlign: 'center', marginTop: 'auto' },
  pageNum: { position: 'absolute', bottom: 15, right: 35, fontSize: 8, color: c.textLight },
  ctaBox: { backgroundColor: c.orange, padding: 20, margin: '10 35', borderRadius: 8, color: c.white, alignItems: 'center' },
});

interface Props { istek: any; icerik: any; }

export default function QuickSalePdf({ istek, icerik }: Props) {
  const { mulk, danisman } = istek;
  const bolgeler = icerik.bolgeler || [];
  const find = (tip: string) => bolgeler.find((b: any) => b.tip === tip);
  const problems = find('problemler')?.altBolge?.slice(0, 4) || [];
  const solutions = find('cozum')?.altBolge?.slice(0, 3) || [];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.hero}>
          <View style={s.urgentBadge}><Text style={s.urgentText}>HIZLI SATIS</Text></View>
          <Text style={s.heroTitle}>{icerik.baslik || 'Hizli Satis Firsati'}</Text>
          <Text style={s.heroSub}>{mulk.konum} - 30-60 Gunde Satis Garantisi</Text>
        </View>
        <View style={[s.section, s.grid]}>
          <View style={s.stat}><Text style={{ fontSize: 8, color: c.textLight }}>Konum</Text><Text style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{mulk.konum}</Text></View>
          {mulk.metrekare && <View style={s.stat}><Text style={{ fontSize: 8, color: c.textLight }}>Alan</Text><Text style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{mulk.metrekare} m2</Text></View>}
        </View>
        <Text style={s.pageNum}>1 / 4</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>Neden Hizli Hareket Etmelisiniz?</Text></View>
        {problems.map((p: any, i: number) => (
          <View key={i} style={[s.card, { marginHorizontal: 35 }]}>
            <Text style={s.cardTitle}>{p.baslik}</Text>
            <Text style={s.cardText}>{p.icerik}</Text>
          </View>
        ))}
        <Text style={s.pageNum}>2 / 4</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.section}><Text style={s.heading}>Hizli Cozum Paketimiz</Text></View>
        <View style={[s.grid, { padding: '0 35' }]}>
          {solutions.map((sol: any, i: number) => (
            <View key={i} style={[s.card, { flex: 1, borderLeft: `3 solid ${c.orange}` }]}>
              <Text style={s.cardTitle}>{sol.baslik}</Text>
              <Text style={s.cardText}>{sol.icerik}</Text>
            </View>
          ))}
        </View>
        <Text style={s.pageNum}>3 / 4</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.ctaBox}>
          <Text style={{ fontSize: 16, fontWeight: 700, color: c.white, textAlign: 'center', marginBottom: 8 }}>Hemen Harekete Gecin!</Text>
          <Text style={{ fontSize: 10, color: c.white, opacity: 0.9, textAlign: 'center', marginBottom: 12 }}>Ucretsiz degerleme icin simdi arayin.</Text>
          <Text style={{ fontSize: 14, fontWeight: 700, color: c.white }}>{danisman.adSoyad}</Text>
          <Text style={{ fontSize: 10, color: c.white, opacity: 0.9, marginTop: 4 }}>{danisman.telefon}</Text>
          <Text style={{ fontSize: 9, color: c.white, opacity: 0.9, marginTop: 2 }}>{danisman.email}</Text>
        </View>
        <View style={s.footer}><Text>{new Date().getFullYear()} {danisman.adSoyad} - Hizli Satis Sunumu</Text></View>
        <Text style={s.pageNum}>4 / 4</Text>
      </Page>
    </Document>
  );
}
