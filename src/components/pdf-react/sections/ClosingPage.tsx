import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../styles';

interface Guarantee {
  baslik: string;
  icerik: string;
  icon?: string;
}

interface ClosingPageProps {
  mulkTurLabel: string;
  konum: string;
  danismanAd: string;
  danismanTelefon: string;
  danismanEmail: string;
  ctaBaslik?: string;
  ctaIcerik?: string;
  guarantees: Guarantee[];
  primaryColor: string;
  secondaryColor: string;
  pageNumber: number;
  totalPages: number;
}

export default function ClosingPage(props: ClosingPageProps) {
  const { mulkTurLabel, konum, danismanAd, danismanTelefon, danismanEmail,
    ctaBaslik, ctaIcerik, guarantees, secondaryColor, pageNumber, totalPages } = props;

  return (
    <Page size="A4" style={styles.page}>
      {/* Critical Questions */}
      <Text style={styles.sectionHeading}>Kritik Sorular</Text>
      <View style={{ padding: '0 40', marginBottom: 10 }}>
        <Text style={{ fontSize: 9, marginBottom: 4 }}>- Mulkumu en yuksek fiyata nasil satarim?</Text>
        <Text style={{ fontSize: 9, marginBottom: 4 }}>- Hizli satis surecinde nelere dikkat etmeliyim?</Text>
        <Text style={{ fontSize: 9, marginBottom: 8 }}>- Profesyonel danismanlik bana ne kazandirir?</Text>
        <Text style={{ fontSize: 9, color: colors.textLight }}>
          Tum bu sorularin cevabi, profesyonel danismanlik hizmeti ile bulunur.
        </Text>
      </View>

      {/* Guarantees */}
      <Text style={[styles.sectionHeading, { fontSize: 13 }]}>Garantilerim</Text>
      <View style={styles.guaranteeGrid}>
        {guarantees.map((g, idx) => (
          <View key={idx} style={styles.guaranteeCard}>
            <Text style={styles.guaranteeIcon}>{g.icon || ['💸', '🔒', '📞'][idx] || '✅'}</Text>
            <Text style={styles.guaranteeTitle}>{g.baslik}</Text>
            <Text style={styles.guaranteeText}>{g.icerik}</Text>
          </View>
        ))}
      </View>

      {/* Agent CTA */}
      <View style={[styles.agentBox, { backgroundColor: secondaryColor }]}>
        <Text style={{ fontSize: 13, fontWeight: 700, color: colors.white, textAlign: 'center', marginBottom: 8 }}>
          {ctaBaslik || `${mulkTurLabel}inizin Potansiyelini Birlikte Ortaya Cikaralim`}
        </Text>
        <Text style={{ fontSize: 9, color: colors.white, opacity: 0.9, textAlign: 'center', marginBottom: 12 }}>
          {ctaIcerik || 'Detayli bilgi ve ucretsiz analiz icin benimle iletisime gecin.'}
        </Text>
        <Text style={styles.agentName}>{danismanAd}</Text>
        <Text style={styles.agentRole}>Gayrimenkul Danismani</Text>
        <Text style={styles.agentContact}>Tel: {danismanTelefon} - {danismanEmail}</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>24 saat icinde geri donus</Text>
          <Text style={styles.badge}>Hicbir baglayicilik yok</Text>
          <Text style={styles.badge}>100% gizlilik garantisi</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>{new Date().getFullYear()} {danismanAd}. Tum haklari saklidir.</Text>
        <Text>Bu sunum {konum} bolgesindeki {mulkTurLabel.toLowerCase()}iniz icin ozel olarak hazirlanmistir.</Text>
      </View>

      <Text style={styles.pageNumber}>{pageNumber} / {totalPages}</Text>
    </Page>
  );
}
