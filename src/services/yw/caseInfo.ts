import { request } from '@umijs/max';

/**
 * 案例信息接口
 */
export interface CaseInfo {
  id: number;
  caseCode: string;
  caseName: string;
  undertakingUnit: string;
  caseType: string;
  caseSource: string;
  caseRemark: string;
  unitStatus: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

/**
 * 分页查询案例列表
 * @param params 查询参数
 * @returns 分页数据
 */
export async function listCaseInfo(params: any) {
  return request('/api/wms/caseInfo/list', {
    method: 'GET',
    params,
  });
}

/**
 * 不分页查询案例列表
 * @param params 查询参数
 * @returns 案例列表
 */
export async function listCaseInfoNoPage(params: any) {
  return request('/api/wms/caseInfo/listNoPage', {
    method: 'GET',
    params,
  });
}

/**
 * 根据ID获取案例详情
 * @param id 案例ID
 * @returns 案例详情
 */
export async function getCaseInfo(id: number) {
  return request(`/api/wms/caseInfo/${id}`, {
    method: 'GET',
  });
}

/**
 * 新增案例
 * @param data 案例数据
 * @returns 操作结果
 */
export async function addCaseInfo(data: any) {
  return request('/api/wms/caseInfo', {
    method: 'POST',
    data,
  });
}

/**
 * 修改案例
 * @param data 案例数据
 * @returns 操作结果
 */
export async function updateCaseInfo(data: any) {
  return request('/api/wms/caseInfo', {
    method: 'PUT',
    data,
  });
}

/**
 * 删除案例
 * @param id 案例ID
 * @returns 操作结果
 */
export async function deleteCaseInfo(id: number) {
  return request(`/api/wms/caseInfo/${id}`, {
    method: 'DELETE',
  });
}