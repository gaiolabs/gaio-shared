import { PositionType } from "../core/flow.type";
import { ReportTypeKeys } from "./report.keys.type";

export type ProjectType = {
    html: string;
    libs: Array<{
      url: string;
      async: boolean;
    }>;
    event: string;
    style: string;
    script: string;
  };
  
 export type StaticContentType = Partial<{
    id: string;
    type: string;
    appId: number;
    label: string;
    limit: number;
    tables: Array<any>;
    content: string;
    project: ProjectType;
    noSpeech: boolean;
    cardStyle: boolean;
    reportType: ReportTypeKeys;
    assetsCoverWidth: boolean;
    position: PositionType;
    created: boolean;
  }>;

