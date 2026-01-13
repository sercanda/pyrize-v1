/**
 * Kullanıcı erişim kontrolü için utility fonksiyonlar
 */

export interface UserAccessInfo {
  hasCredits: boolean;
  hasSubscription: boolean;
  credits?: number;
  subscriptionEnd?: Date | null;
  canAccessWeeklyReport: boolean;
}

/**
 * Kullanıcının haftalık rapor özelliğine erişim yetkisi var mı kontrol eder
 * Haftalık rapor sadece:
 * - Abonelere ücretsiz
 * - Hesabında kredisi olan kullanıcılara açık
 */
export function canAccessWeeklyReport(userAccess: UserAccessInfo): boolean {
  return userAccess.hasSubscription || (userAccess.hasCredits && (userAccess.credits || 0) > 0);
}

/**
 * Kullanıcının kredi/abonelik bilgilerini getirir
 * TODO: Supabase'den gerçek kullanıcı verilerini çek
 */
export async function getUserAccessInfo(userId?: string): Promise<UserAccessInfo> {
  // Şimdilik mock data - gerçek implementasyonda Supabase'den çekilecek
  // TODO: Supabase'den kullanıcı kredi ve abonelik bilgilerini çek
  
  // Mock: Kullanıcının kredisi ve aboneliği var
  const mockAccess: UserAccessInfo = {
    hasCredits: true,
    hasSubscription: false,
    credits: 125,
    subscriptionEnd: null,
    canAccessWeeklyReport: true, // Kredisi olduğu için erişebilir
  };

  mockAccess.canAccessWeeklyReport = canAccessWeeklyReport(mockAccess);
  
  return mockAccess;
}

