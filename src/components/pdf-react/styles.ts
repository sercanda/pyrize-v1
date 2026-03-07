import { StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiEyp8kv8JHgFVrFJA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLGT9V1s.ttf', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6V1s.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLCz7V1s.ttf', fontWeight: 700 },
  ],
});

export const A4 = { width: 595.28, height: 841.89 }; // points (72 dpi)

export const colors = {
  primary: '#57B6B2',
  secondary: '#223BA1',
  dark: '#0a1628',
  text: '#1a1a2e',
  textLight: '#6b7280',
  white: '#ffffff',
  red: '#ef4444',
  green: '#22c55e',
  bgLight: '#f8fafc',
  border: '#e5e7eb',
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Poppins',
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.white,
    padding: 0,
    width: A4.width,
    height: A4.height,
  },
  // Hero section
  heroBox: {
    padding: 40,
    paddingBottom: 30,
    color: colors.white,
  },
  heroBadge: {
    fontSize: 8,
    opacity: 0.9,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.white,
    marginBottom: 10,
    lineHeight: 1.3,
  },
  heroSubtitle: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 1.5,
  },
  // Summary grid
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '15 40',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  summaryIcon: { fontSize: 18, marginBottom: 4 },
  summaryLabel: { fontSize: 8, color: colors.textLight, marginBottom: 2 },
  summaryValue: { fontSize: 10, fontWeight: 600 },
  // Section headings
  sectionHeading: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
    padding: '20 40 0 40',
  },
  sectionSubheading: {
    fontSize: 10,
    color: colors.textLight,
    padding: '0 40',
    marginBottom: 15,
  },
  // Problem cards
  problemCard: {
    flexDirection: 'row',
    padding: '8 40',
    marginBottom: 6,
    gap: 10,
  },
  problemNumber: { fontSize: 12, color: colors.red, width: 20 },
  problemContent: { flex: 1 },
  problemTitle: { fontSize: 10, fontWeight: 600, marginBottom: 2 },
  problemText: { fontSize: 9, color: colors.textLight, lineHeight: 1.4 },
  problemLoss: { fontSize: 8, color: colors.red, marginTop: 2 },
  // Solution cards
  solutionGrid: {
    flexDirection: 'row',
    padding: '0 40',
    gap: 10,
    marginBottom: 15,
  },
  solutionCard: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    borderLeft: `3 solid ${colors.green}`,
  },
  solutionTitle: { fontSize: 10, fontWeight: 600, marginBottom: 4 },
  solutionText: { fontSize: 9, color: colors.textLight, lineHeight: 1.4 },
  // Process steps
  processBox: {
    margin: '10 40',
    padding: 15,
    backgroundColor: colors.bgLight,
    borderRadius: 8,
  },
  processTitle: { fontSize: 11, fontWeight: 600, marginBottom: 10, textAlign: 'center' },
  processSteps: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  processStep: { alignItems: 'center', width: 60 },
  processStepIcon: { fontSize: 16, marginBottom: 4 },
  processStepLabel: { fontSize: 7, textAlign: 'center' },
  processFooter: { fontSize: 8, textAlign: 'center', marginTop: 10, color: colors.textLight },
  // Plan grid (page 4)
  planGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '10 40',
    gap: 10,
  },
  planCard: {
    width: '48%',
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    padding: 12,
  },
  planCardFull: {
    width: '100%',
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    padding: 12,
  },
  planCardTitle: { fontSize: 10, fontWeight: 600, marginBottom: 6 },
  planText: { fontSize: 9, color: colors.textLight, lineHeight: 1.4 },
  // Valuation
  valuationGrid: {
    flexDirection: 'row',
    padding: '0 40',
    gap: 10,
    marginBottom: 12,
  },
  valuationCard: {
    flex: 1,
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  valuationLabel: { fontSize: 8, color: colors.textLight, marginBottom: 4 },
  valuationValue: { fontSize: 12, fontWeight: 700 },
  // Table
  table: { margin: '0 40', marginBottom: 12 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    color: colors.white,
    padding: '6 8',
    borderRadius: '4 4 0 0',
  },
  tableHeaderCell: { fontSize: 8, fontWeight: 600, color: colors.white },
  tableRow: {
    flexDirection: 'row',
    padding: '5 8',
    borderBottom: `1 solid ${colors.border}`,
  },
  tableCell: { fontSize: 8 },
  // FAQ
  faqItem: { padding: '6 40' },
  faqQuestion: { fontSize: 9, fontWeight: 600, marginBottom: 2 },
  faqAnswer: { fontSize: 9, color: colors.textLight, lineHeight: 1.4 },
  // Guarantee
  guaranteeGrid: {
    flexDirection: 'row',
    padding: '0 40',
    gap: 10,
    marginBottom: 15,
  },
  guaranteeCard: {
    flex: 1,
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  guaranteeIcon: { fontSize: 20, marginBottom: 4 },
  guaranteeTitle: { fontSize: 9, fontWeight: 600, marginBottom: 4, textAlign: 'center' },
  guaranteeText: { fontSize: 8, color: colors.textLight, textAlign: 'center', lineHeight: 1.4 },
  // Agent section
  agentBox: {
    margin: '10 40',
    padding: 20,
    borderRadius: 8,
    color: colors.white,
    alignItems: 'center',
  },
  agentName: { fontSize: 14, fontWeight: 700, color: colors.white, marginBottom: 4 },
  agentRole: { fontSize: 9, color: colors.white, opacity: 0.9, marginBottom: 8 },
  agentContact: { fontSize: 9, color: colors.white, opacity: 0.9 },
  // Footer
  footer: {
    padding: '8 40',
    fontSize: 7,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 'auto',
  },
  // Warning box
  warningBox: {
    margin: '10 40',
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
    borderLeft: `3 solid ${colors.red}`,
  },
  warningText: { fontSize: 9, color: colors.red },
  // Banner
  banner: {
    margin: '10 40',
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    textAlign: 'center',
  },
  bannerText: { fontSize: 9, color: colors.green, fontWeight: 500 },
  // Badge row
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    fontSize: 7,
    color: colors.white,
    opacity: 0.9,
  },
  // Utility
  listItem: { fontSize: 9, marginBottom: 3, paddingLeft: 8 },
  channelTag: {
    fontSize: 8,
    backgroundColor: '#e0f2fe',
    padding: '3 6',
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  channelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  valueRange: {
    margin: '10 40',
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueRangeLabel: { fontSize: 9, fontWeight: 500 },
  valueRangeValue: { fontSize: 14, fontWeight: 700, color: colors.secondary },
  // Special plan header
  specialHeader: {
    padding: 25,
    color: colors.white,
    alignItems: 'center',
  },
  specialBadge: { fontSize: 8, opacity: 0.9, marginBottom: 8, letterSpacing: 0.5 },
  specialTitle: { fontSize: 18, fontWeight: 700, color: colors.white },
  specialSubtitle: { fontSize: 10, color: colors.white, opacity: 0.9, marginTop: 4 },
  // Page number
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 40,
    fontSize: 8,
    color: colors.textLight,
  },
});
