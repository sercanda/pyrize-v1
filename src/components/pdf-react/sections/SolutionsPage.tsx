import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface Solution {
  baslik: string;
  icerik: string;
  karsilastirma?: string;
}

interface SolutionsPageProps {
  solutions: Solution[];
  pageNumber: number;
  totalPages: number;
}

const processSteps = [
  { icon: '📊', label: 'Degerleme' },
  { icon: '📹', label: 'Gorsel' },
  { icon: '📱', label: 'Pazarlama' },
  { icon: '🌍', label: 'Ag' },
  { icon: '🔍', label: 'Filtre' },
  { icon: '🤝', label: 'Kapanis' },
];

export default function SolutionsPage({ solutions, pageNumber, totalPages }: SolutionsPageProps) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionHeading}>Peki Ya Bu Sorunlarin Hicbiri Olmasaydi?</Text>
      <Text style={styles.sectionSubheading}>Size ozel hazirladigim profesyonel satis sistemi ile...</Text>

      <View style={styles.solutionGrid}>
        {solutions.slice(0, 3).map((s, idx) => (
          <View key={idx} style={styles.solutionCard}>
            <Text style={styles.solutionTitle}>{s.baslik}</Text>
            <Text style={styles.solutionText}>{s.icerik}</Text>
            {s.karsilastirma && (
              <Text style={[styles.solutionText, { marginTop: 4, fontWeight: 500 }]}>{s.karsilastirma}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Process */}
      <View style={styles.processBox}>
        <Text style={styles.processTitle}>6 Adimli Profesyonel Satis Sistemi</Text>
        <View style={styles.processSteps}>
          {processSteps.map((step, idx) => (
            <View key={idx} style={styles.processStep}>
              <Text style={styles.processStepIcon}>{step.icon}</Text>
              <Text style={styles.processStepLabel}>{step.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.processFooter}>Toplam surec: Ortalama 45 gun - Hedef: Piyasa degerinde hizli satis</Text>
      </View>

      <Text style={styles.pageNumber}>{pageNumber} / {totalPages}</Text>
    </Page>
  );
}
