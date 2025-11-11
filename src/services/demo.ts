import { request } from '@umijs/max';

/**
 * 演示数据类型定义
 */
export interface DemoBo {
  id?: number;
  demoName?: string;
  demoAge?: number;
  demoGender?: number;
  remark?: string;
}

export interface DemoVo {
  id: number;
  demoName: string;
  demoAge: number;
  demoGender: number;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}

/**
 * 获取演示数据详情
 * @param id 数据ID
 */
export async function getDemoById(id: number) {
  return request<{ data: DemoVo }>('/api/wms/demo/' + id, {
    method: 'GET',
  });
}

/**
 * 查询演示数据列表
 * @param params 查询参数
 * @param pageQuery 分页参数
 */
export async function listDemo(params: DemoBo, pageQuery: { page: number; pageSize: number }) {
  return request<{ data: { list: DemoVo[]; total: number; pageSize: number; current: number } }>('/api/wms/demo/list', {
    method: 'GET',
    params: { ...params, ...pageQuery },
  });
}

/**
 * 新增演示数据
 * @param data 新增数据
 */
export async function addDemo(data: DemoBo) {
  return request('/api/wms/demo/add', {
    method: 'POST',
    data,
  });
}

/**
 * 更新演示数据
 * @param data 更新数据
 */
export async function updateDemo(data: DemoBo) {
  return request('/api/wms/demo', {
    method: 'PUT',
    data,
  });
}

/**
 * 删除演示数据
 * @param id 数据ID
 */
export async function deleteDemo(id: number) {
  return request('/api/wms/demo/' + id, {
    method: 'DELETE',
  });
}

/**
 * 批量删除演示数据
 * @param ids 数据ID数组
 */
export async function deleteDemoBatch(ids: number[]) {
  return request('/api/wms/demo/batch', {
    method: 'DELETE',
    data: ids,
  });
}