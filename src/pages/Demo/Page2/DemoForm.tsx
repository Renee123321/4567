import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import type { FormInstance } from 'antd';
import type { DemoBo } from '@/services/demo';

const { Option } = Select;

interface DemoFormProps {
  form: FormInstance<DemoBo>;
  initialValues?: DemoBo;
}

const DemoForm: React.FC<DemoFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Form.Item
        name="demoName"
        label="演示名称"
        rules={[{ required: true, message: '请输入演示名称' }, { max: 50, message: '名称不能超过50个字符' }]}
      >
        <Input placeholder="请输入演示名称" maxLength={50} />
      </Form.Item>
      
      <Form.Item
        name="demoAge"
        label="演示年龄"
        rules={[{ required: true, message: '请输入演示年龄' }, { type: 'number', min: 1, max: 200 }]}
      >
        <InputNumber
          placeholder="请输入演示年龄"
          min={1}
          max={200}
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item
        name="demoGender"
        label="演示性别"
        rules={[{ required: true, message: '请选择演示性别' }]}
      >
        <Select placeholder="请选择演示性别">
          <Option value={1}>男</Option>
          <Option value={2}>女</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="remark"
        label="备注"
        rules={[{ max: 200, message: '备注不能超过200个字符' }]}
      >
        <Input.TextArea
          placeholder="请输入备注信息"
          maxLength={200}
          rows={4}
          showCount
        />
      </Form.Item>
    </Form>
  );
};

export default DemoForm;