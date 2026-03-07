import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface Problem {
  baslik: string;
  icerik: string;
  kayip?: string;
}

interface ProblemsPageProps {
  mulkTurLabel: string;
  problems: Problem[];
  pageNumber: number;
  totalPages: number;
}

export default function ProblemsPage({ mulkTurLabel, problems, pageNumber, totalPages }: ProblemsPageProps) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionHeading}>
        {mulkTurLabel}unuzu Satarken Karsilasacaginiz 5 Buyuk Sorun
      </Text>

      {problems.slice(0, 5).map((p, idx) => (
        <View key={idx} style={styles.problemCard}>
          <Text style={styles.problemNumber}>X</Text>
          <View style={styles.problemContent}>
            <Text style={styles.problemTitle}>{idx + 1}. {p.baslik}</Text>
            <Text style={styles.problemText}>{p.icerik}</Text>
            {p.kayip && <Text style={styles.problemLoss}>{p.kayip}</Text>}
          </View>
        </View>
      ))}

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Bu sorunlarin her biri sizi yuz binlerce lira zarara ugratabilir.
        </Text>
      </View>

      <Text style={styles.pageNumber}>{pageNumber} / {totalPages}</Text>
    </Page>
  );
}
