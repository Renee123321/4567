import React, { useState, useRef, useEffect } from 'react';
import './index.less';
import { useIntl, useAccess } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { listCaseInfo, addCaseInfo, updateCaseInfo, deleteCaseInfo } from '@/services/yw/caseInfo';
import { getDictSelectOption, getDictValueEnum } from '@/services/system/dict';
import EditDrawer from './edit';
import type { CaseInfo, CaseInfoFormData } from './edit';
import { get } from 'lodash';
import { listMerchantNoPage } from '@/services/yw/merchant';

/**
 * 添加案件处理函数
 */
const handleAdd = async (fields: CaseInfoFormData) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addCaseInfo({ ...fields });
    hide();
    if (resp.code === 200 || resp.code === undefined) {
      message.success('添加成功');
    } else {
      message.error(resp.msg || '添加失败');
    }
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新案件处理函数
 */
const handleUpdate = async (fields: CaseInfoFormData) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateCaseInfo(fields);
    hide();
    if (resp.code === 200 || resp.code === undefined) {
      message.success('更新成功');
    } else {
      message.error(resp.msg || '更新失败');
    }
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

/**
 * 删除案件处理函数
 */
const handleRemove = async (selectedRows: CaseInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows || selectedRows.length === 0) return true;
  try {
    // 循环删除，因为后端接口是单个删除
    for (const row of selectedRows) {
      await deleteCaseInfo(row.id);
    }
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 案件信息列表页面
 */
const CaseInfoList: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CaseInfo>();
  const [selectedRows, setSelectedRows] = useState<CaseInfo[]>([]);
  const [ajlxOptions, setAjlxOptions] = useState<any>({});
  const [ajlyOptions, setAjlyOptions] = useState<any>({});
  const [statusOptions, setStatusOptions] = useState<any>({});
  const access = useAccess();
  const [merchantOptions, setMerchantOptions] = useState<any>([]);

  useEffect(() => {
    // 字典：案件类型、案件来源、通用状态
    getDictValueEnum('wms_ajlx').then(setAjlxOptions);
    getDictValueEnum('wms_ajly').then(setAjlyOptions);
    getDictValueEnum('sys_common_status', true).then(setStatusOptions);
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const res = await listMerchantNoPage();

      let merchantData: any[] = [];
      if (res.code === 200) {
        if (res.data && Array.isArray(res.data)) {
          merchantData = res.data;
        }
      }
      if (merchantData.length > 0) {
        const option = merchantData.map((merchant: any) => ({
          label: merchant.merchantName,
          value: merchant.merchantCode,
        }));
        setMerchantOptions(option);
      } else if (res.code !== 200) {
        message.error('加载商户列表失败: ' + res.msg);
      }
    } catch(error) {
      message.error('加载商户列表异常');
    }
  };
  
  const columns: ProColumns<CaseInfo>[] = [
    {
      title: '案件编码',
      dataIndex: 'caseCode',
      valueType: 'text',
    },
    {
      title: '案件名称',
      dataIndex: 'caseName',
      valueType: 'text',
    },
    {
      title: '承担单位',
      dataIndex: 'undertakingUnit',
      valueType: 'text',
    },
    {
      title: '案件类型',
      dataIndex: 'caseType',
      valueType: 'select',
      valueEnum: ajlxOptions || {},
    },
    {
      title: '案件来源',
      dataIndex: 'caseSource',
      valueType: 'select',
      valueEnum: ajlyOptions || {},
    },
    {
      title: '单位状态',
      dataIndex: 'unitStatus',
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '案件备注',
      dataIndex: 'caseRemark',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: '180px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!access.hasPerms('wms:caseInfo:edit')}
          onClick={() => {
            setCurrentRow(record);
            setDrawerVisible(true);
          }}
        >
          修改
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="delete"
          hidden={!access.hasPerms('wms:caseInfo:remove')}
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: `确认删除案件【${record.caseName}】吗？`,
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemove([record]);
                if (success && actionRef.current) {
                  actionRef.current.reload();
                }
              },
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<CaseInfo>
        headerTitle="案件信息列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            hidden={!access.hasPerms('wms:caseInfo:add')}
            onClick={() => {
              setCurrentRow(undefined);
              setDrawerVisible(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={async (params) => {
          const res = await listCaseInfo({
            ...params,
            current: String(params.current),
            pageSize: String(params.pageSize),
          });
          return {
            data: res.rows || res.data || [],
            total: res.total || 0,
            success: true,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项
            </div>
          }
        >
          <Button
            danger
            key="batchRemove"
            hidden={!access.hasPerms('wms:caseInfo:remove')}
            onClick={async () => {
              Modal.confirm({
                title: '是否确认删除所选数据项?',
                icon: <ExclamationCircleOutlined />,
                content: '请谨慎操作',
                async onOk() {
                  const success = await handleRemove(selectedRows);
                  if (success) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }
                },
                onCancel() { },
              });
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <EditDrawer
        onSubmit={async (values) => {
          let success = false;
          if (values.id) {
            success = await handleUpdate(values as any);
          } else {
            success = await handleAdd(values as any);
          }
          if (success) {
            setDrawerVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onClose={() => {
          setDrawerVisible(false);
          setCurrentRow(undefined);
        }}
        visible={drawerVisible}
        values={currentRow || {}}
        // 将对象格式转换为数组格式
        ajlxOptions={ajlxOptions ? Object.values(ajlxOptions).map((item: any) => ({ label: item.label, value: item.value })) : []}
        ajlyOptions={ajlyOptions ? Object.values(ajlyOptions).map((item: any) => ({ label: item.label, value: item.value })) : []}
        statusOptions={statusOptions ? Object.values(statusOptions).map((item: any) => ({ label: item.label, value: item.value })) : []}
        merchantOptions={merchantOptions}
      />
    </PageContainer>
  );
};

export default CaseInfoList;