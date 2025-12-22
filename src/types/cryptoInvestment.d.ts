// 确保API命名空间被正确声明
declare namespace API {
  namespace CryptoInvestment {

    // 数字货币资产类型
    export interface CryptoAsset {
      id: string;
      symbol: string;
      name: string;
      amount: number;
      price: number;
      totalValue: number;
      percentage: number;
      change24h: number;
    }

    // 市场消息类型
    export interface MarketNews {
      id: string;
      title: string;
      content: string;
      source: string;
      publishTime: string;
      sentiment: 'positive' | 'negative' | 'neutral';
      relatedCoins: string[];
    }

    // 投资建议类型
    export interface InvestmentSuggestion {
      id: string;
      date: string;
      assetsToIncrease: Array<{
        symbol: string;
        currentPercentage: number;
        suggestedPercentage: number;
        reason: string;
      }>;
      assetsToDecrease: Array<{
        symbol: string;
        currentPercentage: number;
        suggestedPercentage: number;
        reason: string;
      }>;
      summary: string;
      status: 'pending' | 'approved' | 'rejected';
      approvalTime?: string;
      approvedBy?: string;
    }

    // 投资组合概览类型
    export interface PortfolioOverview {
      totalValue: number;
      totalChange24h: number;
      totalChangePercentage24h: number;
      assetAllocation: CryptoAsset[];
      lastUpdated: string;
    }

    // 历史数据类型
    export interface HistoricalData {
      date: string;
      totalValue: number;
      assets: {
        symbol: string;
        value: number;
      }[];
    }

    // API响应类型
    export interface PortfolioOverviewResponse {
      code: number;
      msg: string;
      data: PortfolioOverview;
    }

    export interface MarketNewsResponse {
      code: number;
      msg: string;
      data: MarketNews[];
      total: number;
    }

    export interface InvestmentSuggestionResponse {
      code: number;
      msg: string;
      data: InvestmentSuggestion;
    }

    export interface HistoricalDataResponse {
      code: number;
      msg: string;
      data: HistoricalData[];
    }

    export interface ApproveSuggestionParams {
      suggestionId: string;
      status: 'approved' | 'rejected';
      comments?: string;
    }
  }
}

// 导出类型供全局使用
export type { API };