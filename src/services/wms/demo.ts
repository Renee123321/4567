import { request } from '@umijs/max';
import { downLoadXlsx } from '@/utils/downloadfile';

// 查询演示数据列表
export async function listDemo(params?: API.Wms.DemoListParams) {
  return request<API.Wms.DemoPageResult>('/api/wms/demo/list', {
    method: 'GET',
    params
  });
}

// 获取演示数据详细信息
export function getDemo(id: string) {
  return request<API.Wms.DemoResult>(`/api/wms/demo/${id}`, {
    method: 'GET'
  });
}

// 新增演示数据
export async function addDemo(params: API.Wms.Demo) {
  return request<API.Result>('/api/wms/demo/add', {
    method: 'POST',
    data: params
  });
}

// 修改演示数据
export async function updateDemo(params: API.Wms.Demo) {
  return request<API.Result>('/api/wms/demo', {
    method: 'PUT',
    data: params
  });
}

// 删除演示数据
export async function delDemo(id: string) {
  return request<API.Result>(`/api/wms/demo/${id}`, {
    method: 'DELETE'
  });
}

// 批量删除演示数据
export async function delDemoBatch(ids: Collection<Long>) {
  return request<API.Result>('/api/wms/demo/batch', {
    method: 'DELETE',
    data: ids
  });
}