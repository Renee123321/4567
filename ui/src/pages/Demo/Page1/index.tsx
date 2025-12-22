import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { submitDemo } from '@/pages/Wms/Demo/service';

const DemoPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<{
    code: number;
    msg: string;
    data: any;
  } | null>(null);
  
  const intl = useIntl();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 调用后端API
      const res = await submitDemo(values);
      
      // 保存响应数据以便显示
      setResponseData(res);
      
      // 显示成功提示
      message.success(intl.formatMessage({
        id: 'pages.demo.submitSuccess',
        defaultMessage: '提交成功！'
      }));
    } catch (error) {
      // 显示错误提示
      message.error(intl.formatMessage({
        id: 'pages.demo.submitFailure',
        defaultMessage: '提交失败，请重试！'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title={intl.formatMessage({
        id: 'pages.demo.title',
        defaultMessage: '用户信息提交'
      })}
      breadcrumbRender={false}
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: '',
            age: '',
            shenggao: 0,
            tizhong: 0,
          }}
        >
          <Form.Item
            name="name"
            label={intl.formatMessage({
              id: 'pages.demo.name',
              defaultMessage: '姓名'
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.demo.nameRequired',
                  defaultMessage: '请输入姓名'
                }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({
              id: 'pages.demo.namePlaceholder',
              defaultMessage: '请输入姓名'
            })} />
          </Form.Item>

          <Form.Item
            name="age"
            label={intl.formatMessage({
              id: 'pages.demo.age',
              defaultMessage: '年龄'
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.demo.ageRequired',
                  defaultMessage: '请输入年龄'
                }),
              },
              {
                pattern: /^[0-9]+$/,
                message: intl.formatMessage({
                  id: 'pages.demo.ageNumber',
                  defaultMessage: '年龄必须是数字'
                }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({
              id: 'pages.demo.agePlaceholder',
              defaultMessage: '请输入年龄'
            })} />
          </Form.Item>

          <Form.Item
            name="shenggao"
            label={intl.formatMessage({
              id: 'pages.demo.height',
              defaultMessage: '身高'
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.demo.heightRequired',
                  defaultMessage: '请输入身高'
                }),
              },
              {
                type: 'number',
                min: 0,
                message: intl.formatMessage({
                  id: 'pages.demo.heightPositive',
                  defaultMessage: '身高必须是正数'
                }),
              },
            ]}
          >
            <Input type="number" placeholder={intl.formatMessage({
              id: 'pages.demo.heightPlaceholder',
              defaultMessage: '请输入身高（cm）'
            })} />
          </Form.Item>

          <Form.Item
            name="tizhong"
            label={intl.formatMessage({
              id: 'pages.demo.weight',
              defaultMessage: '体重'
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.demo.weightRequired',
                  defaultMessage: '请输入体重'
                }),
              },
              {
                type: 'number',
                min: 0,
                message: intl.formatMessage({
                  id: 'pages.demo.weightPositive',
                  defaultMessage: '体重必须是正数'
                }),
              },
            ]}
          >
            <Input type="number" placeholder={intl.formatMessage({
              id: 'pages.demo.weightPlaceholder',
              defaultMessage: '请输入体重（kg）'
            })} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {intl.formatMessage({
                id: 'pages.demo.submit',
                defaultMessage: '提交'
              })}
            </Button>
          </Form.Item>
        </Form>

        {/* 显示响应结果 */}
        {responseData && (
          <Card title={intl.formatMessage({
            id: 'pages.demo.responseTitle',
            defaultMessage: '后端响应结果'
          })} style={{ marginTop: 20 }}>
            <div style={{ lineHeight: '2' }}>
              <p><strong>{intl.formatMessage({
                id: 'pages.demo.responseCode',
                defaultMessage: '状态码'
              })}：</strong>{responseData.code}</p>
              <p><strong>{intl.formatMessage({
                id: 'pages.demo.responseMsg',
                defaultMessage: '消息'
              })}：</strong>{responseData.msg}</p>
              <p><strong>{intl.formatMessage({
                id: 'pages.demo.responseData',
                defaultMessage: '数据'
              })}：</strong>{responseData.data !== null ? JSON.stringify(responseData.data) : 'null'}</p>
            </div>
          </Card>
        )}
      </Card>
    </PageContainer>
  );
};

export default DemoPage;