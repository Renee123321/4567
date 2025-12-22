import { request } from '@umijs/max';

/**
 * 提交用户信息到后端
 * @param params 用户信息参数
 * @returns 后端响应结果
 */
export async function submitDemo(params: {
  name: string;
  age: string;
  shenggao: number;
  tizhong: number;
}) {
  return request('/wms/demo/testbody', {
    method: 'POST',
    data: params,
  });
}