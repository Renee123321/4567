import React from 'react';
import { Form, Input, Select, Space, Button } from 'antd';
import type { FormInstance } from 'antd';
import type { DemoBo } from '@/services/demo';

const { Option } = Select;

interface DemoQueryFormProps {
  form: FormInstance<DemoBo>;
  onSearch: () => void;
  onReset: () => void;
}

const DemoQueryForm: React.FC<DemoQueryFormProps> = ({ form, onSearch, onReset }) => {
  return (
    <Form form={form} layout="inline" className="mb-4">
      <Form.Item name="demoName" label="演示名称">
        <Input placeholder="请输入演示名称" allowClear style={{ width: 200 }} />
      </Form.Item>
      
      <Form.Item name="demoGender" label="演示性别">
        <Select placeholder="请选择性别" allowClear style={{ width: 120 }}>
          <Option value={1}>男</Option>
          <Option value={2}>女</Option>
        </Select>
      </Form.Item>
      
      <Form.Item>
        <Space>
          <Button type="primary" onClick={onSearch}>搜索</Button>
          <Button onClick={onReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DemoQueryForm;