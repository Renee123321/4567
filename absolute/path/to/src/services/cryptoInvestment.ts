import { request } from '@umijs/max';

/* *
 * 数字货币投资辅助系统服务
 * @author AI Assistant
 * @datetime 2023/09/15
 * */

// 获取投资组合概览
export async function getPortfolioOverview() {
  return request<{ code: number; msg: string; data: any }>('/api/crypto-investment/portfolio', {
    method: 'GET',
  });
}

// 获取市场消息列表
export async function getMarketNews(params?: {
  pageSize?: number;
  current?: number;
  symbols?: string[];
  sentiment?: string;
}) {
  return request<{ code: number; msg: string; data: any[]; total: number }>('/api/crypto-investment/news', {
    method: 'GET',
    params,
  });
}

// 获取最新投资建议
export async function getLatestInvestmentSuggestion() {
  return request<{ code: number; msg: string; data: any }>('/api/crypto-investment/suggestion/latest', {
    method: 'GET',
  });
}

// 获取历史投资建议
export async function getInvestmentSuggestions(params?: {
  pageSize?: number;
  current?: number;
  startDate?: string;
  endDate?: string;
}) {
  return request<Array<{ code: number; msg: string; data: any }>>('/api/crypto-investment/suggestion/history', {
    method: 'GET',
    params,
  });
}

// 审批投资建议
export async function approveInvestmentSuggestion(params: { suggestionId: string; status: 'approved' | 'rejected'; comments?: string }) {
  return request('/api/crypto-investment/suggestion/approve', {
    method: 'POST',
    data: params,
  });
}

// 获取历史数据
export async function getHistoricalData(params?: {
  days?: number;
  startDate?: string;
  endDate?: string;
}) {
  return request<{ code: number; msg: string; data: any[] }>('/api/crypto-investment/history', {
    method: 'GET',
    params,
  });
}

// 刷新市场数据
export async function refreshMarketData() {
  return request('/api/crypto-investment/market/refresh', {
    method: 'POST',
  });
}