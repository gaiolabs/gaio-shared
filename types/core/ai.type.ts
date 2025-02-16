import {GenericType} from "../generic.type";

export type AiManagerType = {
    aiId: string;
    aiName: string;
    options: GenericType;
    createdBy: string;
    updatedBy: string;
    updatedAt: string;
    createdAt: string;
}


export type SmartDashItemType = {
    query: string;
    reportType: string; // table, bar, line, pie
    chartAxisX: string;
    chartAxisY: string;
    chartDimensionDataType: string;
    isPercentage: boolean;
}


