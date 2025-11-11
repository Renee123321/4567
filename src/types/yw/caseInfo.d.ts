declare namespace API.Yw {
  export interface CaseInfo {
    id?: string;
    caseCode: string;
    caseName: string;
    undertakingUnit: string;
    caseType: string; // AJLX_* 代码
    caseSource: string; // AJLY_* 代码
    caseRemark?: string;
    unitStatus?: number; // 状态（如：0/1 等）
    createTime?: string | Date;
    updateTime?: string | Date;
  }

  export interface CaseInfoListParams {
    caseCode?: string;
    caseName?: string;
    undertakingUnit?: string;
    caseType?: string;
    caseSource?: string;
    unitStatus?: number;
    pageSize?: string;
    current?: string;
  }

  export interface CaseInfoResult {
    code: number;
    msg: string;
    data: CaseInfo;
  }

  export interface CaseInfoPageResult {
    code: number;
    msg: string;
    total: number;
    rows: Array<CaseInfo>;
  }
}