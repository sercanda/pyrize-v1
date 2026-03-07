import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../styles';

interface HeroPageProps {
  mulkTurLabel: string;
  konum: string;
  metrekare?: number;
  priceRange?: string;
  estimatedValueRange?: string;
  danismanAd: string;
  danismanTelefon: string;
  danismanEmail: string;
  primaryColor: string;
  secondaryColor: string;
  pageNumber: number;
  totalPages: number;
}

export default function HeroPage(props: HeroPageProps) {
  const { mulkTurLabel, konum, metrekare, priceRange, estimatedValueRange,
    danismanAd, danismanTelefon, danismanEmail,
    primaryColor, secondaryColor, pageNumber, totalPages } = props;

  return (
    <Page size="A4" style={styles.page}>
      {/* Hero */}
      <View style={[styles.heroBox, { backgroundColor: secondaryColor }]}>
        <Text style={styles.heroBadge}>GIZLI - Sadece Sizin Icin Hazirlandi</Text>
        <Text style={styles.heroTitle}>
          {mulkTurLabel}inizin Gercek Degerini Biliyor musunuz?
        </Text>
        <Text style={styles.heroSubtitle}>
          Bu sunum, {konum} bolgesindeki gayrimenkulunuzun nasil 30-60 gun icinde hak ettigi en yuksek fiyata satilabilecegini gosteriyor.
        </Text>
      </View>

      {/* Summary Grid */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>📍</Text>
          <Text style={styles.summaryLabel}>Konum</Text>
          <Text style={styles.summaryValue}>{konum}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>🏠</Text>
          <Text style={styles.summaryLabel}>Mulk Tipi</Text>
          <Text style={styles.summaryValue}>{mulkTurLabel}</Text>
        </View>
        {metrekare && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📐</Text>
            <Text style={styles.summaryLabel}>Alan</Text>
            <Text style={styles.summaryValue}>{metrekare} m2</Text>
          </View>
        )}
        {priceRange && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={styles.summaryLabel}>Tahmini Deger</Text>
            <Text style={styles.summaryValue}>{priceRange}</Text>
          </View>
        )}
      </View>

      {/* Valuation highlight */}
      {estimatedValueRange && (
        <View style={styles.valueRange}>
          <Text style={styles.valueRangeLabel}>Profesyonel Degerleme Araligi</Text>
          <Text style={styles.valueRangeValue}>{estimatedValueRange}</Text>
        </View>
      )}

      {/* Agent intro */}
      <View style={{ padding: '15 40', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, fontWeight: 600 }}>{danismanAd}</Text>
        <Text style={{ fontSize: 9, color: colors.textLight, marginTop: 2 }}>Gayrimenkul Danismani</Text>
        <Text style={{ fontSize: 9, color: colors.textLight, marginTop: 4 }}>
          Tel: {danismanTelefon} - {danismanEmail}
        </Text>
      </View>

      <Text style={styles.pageNumber}>{pageNumber} / {totalPages}</Text>
    </Page>
  );
}
