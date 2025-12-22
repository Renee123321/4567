import React, { useState, useRef, useEffect } from 'react';
import { useIntl } from '@umijs/max';
import { Button, message, Modal, Drawer, Form } from 'antd';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable, ProForm, ProFormText, ProFormSelect, ProFormDigit, ProFormDateTimePicker } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import moment from 'moment';

// 真实API调用
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  try {
    await request('/api/currency/market/message-list', {
      method: 'POST',
      data: fields,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.msg || '添加失败请重试！');
    return false;
  }
};

// 从Dify获取数据的函数
const handleFetchFromDify = async (actionRef: ActionType | undefined) => {
  const hide = message.loading('正在从Dify获取数据...');
  try {
    await request('/api/currency/market/message-list/fetch-from-dify', {
      method: 'POST',
    });
    hide();
    message.success('从Dify获取数据成功');
    // 重新加载表格数据
    if (actionRef) {
      actionRef.reload();
    }
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.msg || '从Dify获取数据失败');
  }
};

const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在更新');
  try {
    await request('/api/currency/market/message-list', {
      method: 'PUT',
      data: fields,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.msg || '更新失败请重试！');
    return false;
  }
};

const handleRemove = async (selectedRows: any[]) => {
  const hide = message.loading('正在删除');
  try {
    const ids = selectedRows.map(row => row.id);
    await request(`/api/currency/market/message-list/${ids.join(',')}`, {
      method: 'DELETE',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.msg || '删除失败，请重试');
    return false;
  }
};

const MessageList: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (drawerVisible) {
      form.resetFields();
      if (currentRow) {
        form.setFieldsValue({
          ...currentRow,
          publishTime: currentRow.publishTime ? moment(currentRow.publishTime) : null,
        });
      } else {
        form.setFieldsValue({});
      }
    }
  }, [form, drawerVisible, currentRow]);

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      search: true,
      width: 120,
    },
    {
      title: '价格',
      dataIndex: 'price',
      valueType: 'text',
      width: 120,
    },
    {
      title: '情绪',
      dataIndex: 'emotion',
      valueType: 'select',
      valueEnum: {
        '利空': { text: '利空', status: 'Error' },
        '利好': { text: '利好', status: 'Success' },
        '中性': { text: '中性', status: 'Default' },
      },
      width: 100,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      valueType: 'dateTime',
      width: 180,
      render: (_, record) => {
        try {
          return record.publishTime ? moment(record.publishTime).format('YYYY-MM-DD HH:mm:ss') : '';
        } catch (e) {
          return '';
        }
      },
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
          key="view"
          onClick={() => {
            // 查看操作
            message.info(`查看${record.name}详情`);
          }}
        >
          查看
        </Button>,
        <Button
          type="link"
          size="small"
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setDrawerVisible(true);
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="delete"
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: `确认删除【${record.name}】吗？`,
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
    <PageContainer title="消息列表">
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => {
              setCurrentRow(undefined);
              setDrawerVisible(true);
            }}
          >
            <PlusOutlined /> 新增消息
          </Button>,
          <Button
            type="default"
            key="fetch-from-dify"
            onClick={() => handleFetchFromDify(actionRef.current)}
            style={{ marginLeft: 8 }}
          >
            从Dify获取数据
          </Button>,
        ]}
        request={async (params) => {
          try {
            const response = await request('/api/currency/market/message-list', {
              method: 'GET',
              params,
            });
            // 确保返回的数据结构符合ProTable的要求
            return {
              data: Array.isArray(response?.rows) ? response.rows : [],
              total: typeof response?.total === 'number' ? response.total : 0,
              success: response?.code === 200 ? true : false,
            };
          } catch (error: any) {
            message.error(error?.response?.data?.msg || '获取数据失败');
            return {
              data: [],
              total: 0,
              success: false,
            };
          }
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
            <DeleteOutlined /> 批量删除
          </Button>
        </FooterToolbar>
      )}

      {/* 编辑抽屉 */}
      <Drawer
        width={600}
        title={currentRow ? '编辑消息' : '新增消息'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setCurrentRow(undefined);
        }}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => {
              setDrawerVisible(false);
              setCurrentRow(undefined);
            }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={() => form.submit()}>
              确定
            </Button>
          </div>
        }
      >
        <ProForm 
          form={form}
          submitter={false}
          layout="horizontal"
          onFinish={async (values) => {
            let success = false;
            try {
              // 转换数据格式
              const submitData = {
                ...values,
                publishTime: values.publishTime ? (typeof values.publishTime === 'string' ? values.publishTime : (values.publishTime.format ? values.publishTime.format('YYYY-MM-DD HH:mm:ss') : new Date(values.publishTime).toISOString())) : undefined,
                price: values.price ? Number(values.price) : undefined,
              };
              
              if (currentRow) {
                success = await handleUpdate({ ...submitData, id: currentRow.id });
              } else {
                success = await handleAdd(submitData);
              }
              
              if (success) {
                setDrawerVisible(false);
                setCurrentRow(undefined);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            } catch (error) {
              message.error('提交数据时发生错误');
              console.error('提交错误:', error);
            }
          }}
        >
          <ProFormText
            name="id"
            label="ID"
            hidden
            disabled
          />
          <ProFormText
            name="name"
            label="名称"
            width="xl"
            placeholder="请输入名称"
            rules={[
              {
                required: true,
                message: '名称不能为空',
              },
            ]}
          />
          <ProFormDigit
            name="price"
            label="价格"
            width="xl"
            placeholder="请输入价格"
            rules={[
              {
                required: true,
                message: '价格不能为空',
              },
              {
                type: 'number',
                message: '价格必须是数字',
              },
            ]}
            fieldProps={{
              style: { width: '100%' },
            }}
          />
          <ProFormSelect
            name="emotion"
            label="情绪"
            width="xl"
            placeholder="请选择情绪"
            options={[
              { label: '利空', value: '利空' },
              { label: '利好', value: '利好' },
              { label: '中性', value: '中性' },
            ]}
            rules={[
              {
                required: true,
                message: '情绪不能为空',
              },
            ]}
          />
          <ProFormDateTimePicker
            name="publishTime"
            label="发布时间"
            width="xl"
            placeholder="请选择发布时间"
            rules={[
              {
                required: true,
                message: '发布时间不能为空',
              },
            ]}
            fieldProps={{
              style: { width: '100%' },
              showTime: true,
              format: 'YYYY-MM-DD HH:mm:ss',
            }}
          />
        </ProForm>
      </Drawer>
    </PageContainer>
  );
};

export default MessageList;