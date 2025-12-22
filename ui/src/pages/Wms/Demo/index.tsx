import { PageContainer } from '@ant-design/pro-components';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Card, Descriptions } from 'antd';
import { useRequest } from '@umijs/max';

export default () => {
  const { data, loading, run } = useRequest(
    (params) => ({
      url: '/wms/demo/testbody',
      method: 'POST',
      data: params,
    }),
    { manual: true }
  );

  return (
    <PageContainer>
      <ProForm
        onFinish={async (values) => {
          run(values);
        }}
        layout="horizontal"
      >
        <ProFormText name="name" label="姓名" />
        <ProFormText name="age" label="年龄" />
        <ProFormText name="xb" label="性别" />
        <ProFormText name="sg" label="身高" />
      </ProForm>

      {data && (
        <Card title="响应结果" loading={loading} style={{ marginTop: 24 }}>
          <Descriptions column={1}>
            <Descriptions.Item label="用户姓名">{data.data?.name}</Descriptions.Item>
            <Descriptions.Item label="年龄状态">
              {data.data?.age >= 18 ? '成年用户' : '未成年用户'}
            </Descriptions.Item>
            <Descriptions.Item label="消息内容">{data.msg}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </PageContainer>
  );
};