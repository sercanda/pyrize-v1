import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../styles';

interface AnalysisPageProps {
  mulkTurLabel: string;
  konum: string;
  metrekare?: number;
  priceRange?: string;
  locationAdvantages: Array<{ baslik?: string; icerik?: string }>;
  targetPersonas: Array<{ baslik?: string; persona?: string; icerik?: string }>;
  marketingContent?: string;
  marketingChannels: Array<{ baslik?: string }>;
  primaryColor: string;
  secondaryColor: string;
  pageNumber: number;
  totalPages: number;
}

export default function AnalysisPage(props: AnalysisPageProps) {
  const { mulkTurLabel, konum, metrekare, priceRange,
    locationAdvantages, targetPersonas, marketingContent, marketingChannels,
    secondaryColor, pageNumber, totalPages } = props;

  return (
    <Page size="A4" style={styles.page}>
      {/* Special header */}
      <View style={[styles.specialHeader, { backgroundColor: secondaryColor }]}>
        <Text style={styles.specialBadge}>SIZIN {mulkTurLabel.toUpperCase()}INIZ ICIN HAZIRLADIGIM OZEL PLAN</Text>
        <Text style={styles.specialTitle}>{konum}</Text>
        {metrekare && <Text style={styles.specialSubtitle}>{metrekare} m2</Text>}
      </View>

      <View style={styles.planGrid}>
        {/* Location */}
        <View style={styles.planCard}>
          <Text style={styles.planCardTitle}>KONUM ANALIZI</Text>
          <Text style={styles.listItem}>Konum: {konum}</Text>
          <Text style={styles.listItem}>Mulk Turu: {mulkTurLabel}</Text>
          {priceRange && <Text style={styles.listItem}>Fiyat: {priceRange}</Text>}
          {metrekare && <Text style={styles.listItem}>Metrekare: {metrekare} m2</Text>}
          {locationAdvantages.map((adv, idx) => (
            <Text key={idx} style={styles.listItem}>+ {adv.baslik || adv.icerik}</Text>
          ))}
        </View>

        {/* Target audience */}
        <View style={styles.planCard}>
          <Text style={styles.planCardTitle}>HEDEF KITLE</Text>
          {targetPersonas.length > 0 ? (
            targetPersonas.map((p, idx) => (
              <View key={idx} style={{ marginBottom: 4 }}>
                <Text style={[styles.listItem, { fontWeight: 600 }]}>{idx + 1}. {p.baslik || p.persona}</Text>
                {p.icerik && <Text style={styles.planText}>{p.icerik}</Text>}
              </View>
            ))
          ) : (
            <Text style={styles.planText}>Bolgeye ozel hedef kitle analizi yapilacaktir.</Text>
          )}
        </View>

        {/* Marketing */}
        <View style={styles.planCardFull}>
          <Text style={styles.planCardTitle}>PAZARLAMA STRATEJISI</Text>
          <Text style={styles.planText}>{marketingContent || 'Profesyonel pazarlama stratejisi'}</Text>
          {marketingChannels.length > 0 && (
            <View style={styles.channelRow}>
              {marketingChannels.map((ch, idx) => (
                <Text key={idx} style={styles.channelTag}>{ch.baslik || String(ch)}</Text>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Satis olmazsa 0 TL ucret - Tum hizmetler ucretsiz - Hizmet bedeli sadece satis olunca
        </Text>
      </View>

      <Text style={styles.pageNumber}>{pageNumber} / {totalPages}</Text>
    </Page>
  );
}
