import {GenericType} from "../generic.type";

export type AiManagerCredentialsType = {
    baseURL: string,
    apiKey: string,
    model: string,
} & GenericType

export type AiManagerType = {
    aiManagerId: string;
    aiManagerName: string;
    credentials: AiManagerCredentialsType;
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


