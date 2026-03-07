import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../styles';

interface ValuationPageProps {
  snapshots: Array<{ title: string; value: string }>;
  comparables: Array<{ address: string; status?: string; price: string; pricePerSqm?: string }>;
  estimatedValueRange?: string;
  faqItems: Array<{ baslik?: string; question?: string; icerik?: string; answer?: string }>;
  pageNumber: number;
  totalPages: number;
}

export default function ValuationPage(props: ValuationPageProps) {
  const { snapshots, comparables, estimatedValueRange, faqItems, pageNumber, totalPages } = props;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionHeading}>Detayli Degerleme Raporu</Text>

      {snapshots.length > 0 && (
        <View style={styles.valuationGrid}>
          {snapshots.map((s, idx) => (
            <View key={idx} style={styles.valuationCard}>
              <Text style={styles.valuationLabel}>{s.title}</Text>
              <Text style={styles.valuationValue}>{s.value}</Text>
            </View>
          ))}
        </View>
      )}

      {comparables.length > 0 && (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '35%' }]}>Adres</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Durum</Text>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Fiyat</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>m2 Fiyati</Text>
          </View>
          {comparables.map((comp, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>{comp.address}</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>{comp.status || 'Satista'}</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>{comp.price}</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>{comp.pricePerSqm || '—'}</Text>
            </View>
          ))}
        </View>
      )}

      {estimatedValueRange && (
        <View style={styles.valueRange}>
          <Text style={styles.valueRangeLabel}>Tahmini Piyasa Deger Araligi</Text>
          <Text style={styles.valueRangeValue}>{estimatedValueRange}</Text>
        </View>
      )}

      {faqItems.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <Text style={[styles.sectionHeading, { fontSize: 13 }]}>Sik Sorulan Sorular</Text>
          {faqItems.map((faq, idx) => (
            <View key={idx} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.baslik || faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.icerik || faq.answer}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.pageNumber}>{pageNumber} / {totalPages}</Text>
    </Page>
  );
}
