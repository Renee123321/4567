import { request } from '@umijs/max';
import { downLoadXlsx } from '@/utils/downloadfile';

// 查询分析报告列表
export async function listAnalysisReports(params?: API.Crypto.ReportListParams) {
  return request<API.Crypto.ReportPageResult>('/api/crypto/analysis/list', {
    method: 'GET',
    params,
  });
}

// 获取最新分析报告
export async function getLatestReport() {
  return request<{ data: API.Crypto.AnalysisReport }>('/api/crypto/analysis/latest', {
    method: 'GET',
  });
}

// 获取报告详情
export async function getReportDetail(id: number) {
  return request<{ data: API.Crypto.AnalysisReport }>(`/api/crypto/analysis/${id}`, {
    method: 'GET',
  });
}

// 获取当前持仓列表
export async function getCurrentHoldings() {
  return request<API.Crypto.HoldingsResult>('/api/crypto/holdings', {
    method: 'GET',
  });
}

// 获取市场消息列表
export async function getMarketNews(currencyType?: string) {
  return request<API.Crypto.NewsResult>('/api/crypto/news', {
    method: 'GET',
    params: { currencyType },
  });
}

// 审核报告
export async function auditReport(id: number, params: { status: string; remark?: string }) {
  return request<API.Result>(`/api/crypto/analysis/audit/${id}`, {
    method: 'POST',
    data: params,
  });
}

// 导出报告
export function exportReports(params?: API.Crypto.ReportListParams) {
  return downLoadXlsx(
    '/api/crypto/analysis/export',
    { params },
    `crypto_reports_${new Date().getTime()}.xlsx`
  );
}