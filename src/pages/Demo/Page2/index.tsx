import React, { useState, useRef } from 'react';
import { Button, message, Modal, Form } from 'antd';
import type { FormInstance } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import DemoForm from './DemoForm';
import DemoQueryForm from './DemoQueryForm';
import {
  listDemo,
  addDemo,
  updateDemo,
  deleteDemo,
  deleteDemoBatch,
  getDemoById,
  type DemoBo,
  type DemoVo,
} from '@/services/demo';

const DemoPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增演示数据');
  const [currentRecord, setCurrentRecord] = useState<DemoVo | null>(null);
  const [form] = Form.useForm<DemoBo>();
  const [queryForm] = Form.useForm<DemoBo>();
  const tableRef = useRef<any>(null);

  // 性别映射
  const genderMap = {
    1: '男',
    2: '女',
  };

  // 表格列定义
  const columns: ProColumns<DemoVo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '演示名称',
      dataIndex: 'demoName',
      key: 'demoName',
      search: false,
    },
    {
      title: '演示年龄',
      dataIndex: 'demoAge',
      key: 'demoAge',
      width: 100,
    },
    {
      title: '演示性别',
      dataIndex: 'demoGender',
      key: 'demoGender',
      width: 100,
      valueEnum: {
        1: { text: '男', status: 'Success' },
        2: { text: '女', status: 'Default' },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 150,
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>,
      ],
    },
  ];

  // 处理新增
  const handleAdd = () => {
    setModalTitle('新增演示数据');
    setCurrentRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = async (record: DemoVo) => {
    setModalTitle('编辑演示数据');
    setCurrentRecord(record);
    // 重置表单并设置初始值
    form.resetFields();
    form.setFieldsValue({
      id: record.id, // 保持原始类型，后端会自动处理类型转换
      demoName: record.demoName,
      demoAge: record.demoAge,
      demoGender: record.demoGender,
      remark: record.remark,
    });
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: async () => {
        try {
          await deleteDemo(Number(id));
          message.success('删除成功');
          tableRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 处理批量删除
  const handleBatchDelete = (ids: (string | number)[]) => {
    Modal.confirm({
      title: '批量删除',
      content: `确定要删除选中的 ${ids.length} 条记录吗？`,
      onOk: async () => {
        try {
          await deleteDemoBatch(ids.map(id => Number(id)));
          message.success('批量删除成功');
          tableRef.current?.reload();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  // 处理提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (currentRecord) {
        // 更新操作
        await updateDemo(values);
        message.success('更新成功');
      } else {
        // 新增操作
        await addDemo(values);
        message.success('新增成功');
      }

      setModalVisible(false);
      tableRef.current?.reload();
    } catch (error) {
      // 表单验证失败不提示错误
    }
  };

  // 处理搜索
  const handleSearch = () => {
    tableRef.current?.reload();
  };

  // 处理重置
  const handleReset = () => {
    queryForm.resetFields();
    tableRef.current?.reload();
  };

  // 获取表格数据
  const fetchData = async (params: any) => {
    const queryParams = queryForm.getFieldsValue() || {};
    const result = await listDemo(queryParams as DemoBo, {
      page: params.current,
      pageSize: params.pageSize,
    });
    return {
      data: result.data.rows, // 使用 rows 替代 list
      success: true,
      total: result.data.total,
    };
  };

  return (
    <div className="demo-page">
      <DemoQueryForm
        form={queryForm}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      
      <ProTable
        ref={tableRef}
        columns={columns}
        request={fetchData}
        rowKey="id"
        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择 {selectedRowKeys.length} 项
            {selectedRowKeys.length > 0 && (
              <Button
                danger
                className="ml-2"
                onClick={() => handleBatchDelete(selectedRowKeys as number[])}
              >
                批量删除
              </Button>
            )}
          </div>
        )}
        tableAlertOptionRender={({ selectedRowKeys }) => (
          <div>
            {selectedRowKeys.length > 0 && (
              <Button
                danger
                onClick={() => handleBatchDelete(selectedRowKeys as number[])}
              >
                批量删除
              </Button>
            )}
          </div>
        )}
        rowSelection={{
          columnWidth: 40,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4">
              <p>ID: {record.id}</p>
              <p>名称: {record.demoName}</p>
              <p>年龄: {record.demoAge}</p>
              <p>性别: {genderMap[record.demoGender as keyof typeof genderMap] || '未知'}</p>
              <p>备注: {record.remark || '-'}</p>
              <p>创建时间: {record.createTime}</p>
              <p>更新时间: {record.updateTime}</p>
            </div>
          ),
        }}
        toolBarRender={() => (
          <Button type="primary" onClick={handleAdd}>
            <PlusOutlined /> 新增
          </Button>
        )}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {/* 新增/编辑模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <DemoForm form={form} />
      </Modal>
    </div>
  );
};

export default DemoPage;