export type InsightCardType = {
    reference: 'up' | 'down';
    inverted: boolean;
    measure: string;
    currenMeasureValue: number;
    previousMeasureValue: number;
    dimension: string;
    dimensionValue: string;
    percentage: number;
    tableName: string;
    created: string;
};
