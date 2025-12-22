declare namespace API.Crypto {
  // 加密货币分析报告接口
  export interface AnalysisReport {
    id: number;
    reportDate: Date;
    currentTotalValue: number;
    dailyChange: number;
    suggestedAdjustments: string;
    marketSummary: string;
    riskLevel: string;
    auditStatus: string;
    auditBy: string;
    auditTime: Date;
    auditRemark: string;
    createTime: Date;
    updateTime: Date;
  }

  // 加密货币持仓接口
  export interface CryptoHolding {
    id: number;
    currencyType: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
    marketValue: number;
    profitLoss: number;
    profitLossRate: number;
    allocationPercentage: number;
    lastUpdated: Date;
  }

  // 市场消息接口
  export interface MarketNews {
    id: number;
    currencyType: string;
    newsDate: Date;
    title: string;
    content: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    source: string;
    impactLevel: 'high' | 'medium' | 'low';
  }

  // 分析报告列表查询参数
  export interface ReportListParams {
    pageNum?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    riskLevel?: string;
    auditStatus?: string;
  }

  // 报告分页结果
  export interface ReportPageResult {
    code: number;
    msg: string;
    total: number;
    rows: AnalysisReport[];
  }

  // 持仓列表结果
  export interface HoldingsResult {
    code: number;
    msg: string;
    data: CryptoHolding[];
  }

  // 市场消息列表结果
  export interface NewsResult {
    code: number;
    msg: string;
    data: MarketNews[];
  }
}