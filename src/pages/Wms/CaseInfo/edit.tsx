import React, { useEffect } from 'react';
import { ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { Form, Drawer, Button } from 'antd';

/**
 * 案例信息类型定义
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
}

/**
 * 表单数据类型
 */
export type CaseInfoFormData = Record<string, unknown> & Partial<CaseInfo>;

/**
 * 编辑抽屉属性接口
 */
export type EditDrawerProps = {
  onSubmit: (values: CaseInfoFormData) => Promise<void>;
  onClose: () => void;
  visible: boolean;
  values: Partial<CaseInfo>;
  ajlxOptions?: any[];
  ajlyOptions?: any[];
  statusOptions?: any[];
  merchantOptions?: any[];
};

/**
 * 编辑抽屉组件
 */
const EditDrawer: React.FC<EditDrawerProps> = (props) => {
  const [form] = Form.useForm();
  
  console.log("**********************************************************",props)

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      caseCode: props.values.caseCode,
      caseName: props.values.caseName,
      undertakingUnit: props.values.undertakingUnit,
      caseType: props.values.caseType,
      caseSource: props.values.caseSource,
      caseRemark: props.values.caseRemark,
      unitStatus: props.values.unitStatus,
    });
  }, [form, props]);

  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as CaseInfoFormData);
  };

  return (
    <Drawer
      width={600}
      title={props.values.id ? '修改案例' : '添加案例'}
      open={props.visible}
      onClose={props.onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={props.onClose} style={{ marginRight: 8 }}>
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
        onFinish={handleFinish}
      >
        <ProFormText
          name="id"
          label="ID"
          hidden
          disabled
        />
        <ProFormText
          name="caseCode"
          label="案例编码"
          width="xl"
          placeholder="请输入案例编码"
        />
        <ProFormText
          name="caseName"
          label="案例名称"
          width="xl"
          placeholder="请输入案例名称"
          rules={[
            {
              required: true,
              message: '案例名称不能为空',
            },
          ]}
        />
        <ProFormSelect
          name="undertakingUnit"
          label="承担单位"
          width="xl"
          placeholder="请选择承担单位"
          options={props.merchantOptions || []}
          rules={[
            {
              required: false,
              message: '请选择承担单位',
            },
          ]}
        />
        <ProFormSelect
          name="caseType"
          label="案例类型"
          width="xl"
          placeholder="请选择案例类型"
          options={props.ajlxOptions || []}
          rules={[
            {
              required: true,
              message: '案例类型不能为空',
            },
          ]}
        />
        <ProFormSelect
          name="caseSource"
          label="案例来源"
          width="xl"
          placeholder="请选择案例来源"
          options={props.ajlyOptions || []}
          rules={[
            {
              required: true,
              message: '案例来源不能为空',
            },
          ]}
        />
        <ProFormSelect
          name="unitStatus"
          label="单位状态"
          width="xl"
          placeholder="请选择单位状态"
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
          rules={[
            {
              required: true,
              message: '单位状态不能为空',
            },
          ]}
        />
        <ProFormTextArea
          name="caseRemark"
          label="案例备注"
          width="xl"
          placeholder="请输入案例备注"
          rows={4}
        />
      </ProForm>
    </Drawer>
  );
};

export default EditDrawer;