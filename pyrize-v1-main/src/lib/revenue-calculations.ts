
export interface RevenuePlanInputs {
    targetRevenue: number;
    commissionRate: number; // Percentage (e.g., 2.0)
    avgPropertyPrice: number;

    currentActiveListings: number;
    avgMonthlySales: number;
    creditEligibleRatio: number; // Percentage
    avgSalesCycleDays: number;

    listingConversionRate: number; // Percentage
    clientConversionRate: number; // Percentage
    meetingConversionRate: number; // Percentage
    creditBonusCoefficient: number; // default 1.2
}

export interface RevenuePlanResults {
    requiredSales: number;
    requiredListings: number;
    requiredClients: number;
    requiredMeetings: number;
    estimatedMonthsToGoal: number;
    revenuePerSale: number;
}

export function calculateRevenuePlan(inputs: RevenuePlanInputs): RevenuePlanResults {
    const {
        targetRevenue,
        commissionRate,
        avgPropertyPrice,
        listingConversionRate,
        clientConversionRate,
        meetingConversionRate,
        avgMonthlySales
    } = inputs;

    // 1. Calculate Revenue per Sale
    // Commission is usually percentage of property price + VAT (ignoring VAT for simplicity or assuming included if user inputs so)
    // Let's assume commissionRate is the pure rate.
    const revenuePerSale = avgPropertyPrice * (commissionRate / 100);

    // 2. Calculate Required Sales
    // Avoid division by zero
    const requiredSales = revenuePerSale > 0 ? Math.ceil(targetRevenue / revenuePerSale) : 0;

    // 3. Calculate Required Listings
    // Conversion rate = Sales / Listings * 100 => Listings = Sales / (Rate / 100)
    const listingConvDecimal = listingConversionRate / 100;
    const requiredListings = listingConvDecimal > 0 ? Math.ceil(requiredSales / listingConvDecimal) : 0;

    // 4. Calculate Required Clients (Serious Buyers)
    // Conversion rate = Sales / Clients * 100 => Clients = Sales / (Rate / 100)
    const clientConvDecimal = clientConversionRate / 100;
    const requiredClients = clientConvDecimal > 0 ? Math.ceil(requiredSales / clientConvDecimal) : 0;

    // 5. Calculate Required Meetings
    // Conversion rate = Clients / Meetings * 100 => Meetings = Clients / (Rate / 100)
    const meetingConvDecimal = meetingConversionRate / 100;
    const requiredMeetings = meetingConvDecimal > 0 ? Math.ceil(requiredClients / meetingConvDecimal) : 0;

    // 6. Estimated Time
    // Based on current average monthly sales.
    // If user currently sells 2 properties/month, and needs 6 sales, it takes 3 months.
    // If avgMonthlySales is 0, we can't estimate comfortably, maybe return 0 or -1.
    const estimatedMonthsToGoal = avgMonthlySales > 0 ? parseFloat((requiredSales / avgMonthlySales).toFixed(1)) : 0;

    return {
        requiredSales,
        requiredListings,
        requiredClients,
        requiredMeetings,
        estimatedMonthsToGoal,
        revenuePerSale
    };
}
