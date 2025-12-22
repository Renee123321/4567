import React, { useState, useEffect } from 'react';
import { useIntl, useAccess } from '@umijs/max';
import { Button, Card, Row, Col, message, Tag } from 'antd';
import { PageContainer, ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import { SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getMarketNews } from '@/services/crypto/analysis';
import DictTag from '@/components/DictTag';

const MarketMessageList: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const [loading, setLoading] = useState(false);
  const [marketNews, setMarketNews] = useState<API.Crypto.MarketNews[]>([]);
  const [favoriteNews, setFavoriteNews] = useState<Set<number>>(new Set());
  const actionRef = React.useRef<ActionType>();

  // 市场消息表格列配置
  // 市场消息表格列配置
  const newsColumns: ProColumns<API.Crypto.MarketNews>[] = [
    {
      title: '消息ID',
      dataIndex: 'id',
      valueType: 'text',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      ellipsis: true,
      search: {
        // 添加标题搜索
        transform: (value) => ({ title: value }),
      },
    },
    {
      title: '币种',
      dataIndex: 'currencyType',
      valueType: 'text',
      width: 100,
      search: {
        // 添加币种筛选
        transform: (value) => ({ currencyType: value }),
      },
    },
    {
      title: '内容摘要',
      dataIndex: 'content',
      valueType: 'text',
      ellipsis: true,
      render: (_, record) => {
        return record.content.length > 100 ? `${record.content.substring(0, 100)}...` : record.content;
      },
    },
    {
      title: '情感倾向',
      dataIndex: 'sentiment',
      valueType: 'select',
      width: 100,
      search: {
        // 添加情感倾向筛选
        transform: (value) => ({ sentiment: value }),
      },
      render: (_, record) => (
        <DictTag
          value={record.sentiment}
          enums={{
            positive: { label: '利好', status: 'success', value: 'positive', text: '利好' },
            negative: { label: '利空', status: 'error', value: 'negative', text: '利空' },
            neutral: { label: '中性', status: 'default', value: 'neutral', text: '中性' },
          }}
        />
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      valueType: 'text',
      width: 100,
      search: {
        // 添加来源筛选
        transform: (value) => ({ source: value }),
      },
    },
    {
      title: '发布时间',
      dataIndex: 'newsDate',
      valueType: 'dateTime',
      width: 150,
      search: {
        // 添加发布时间筛选
        transform: (value) => {
          if (value && value.length === 2) {
            return {
              startTime: value[0],
              endTime: value[1],
            };
          }
          return {};
        },
      },
    },
    {
      title: '收藏',
      valueType: 'option',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={favoriteNews.has(record.id) ? <StarFilled /> : <StarOutlined />}
          onClick={() => toggleFavorite(record.id)}
          style={{ color: favoriteNews.has(record.id) ? '#faad14' : undefined }}
        />
      ),
    },
  ];

  // 加载市场消息数据
  const loadMarketNews = async () => {
    setLoading(true);
    try {
      const res = await getMarketNews();
      setMarketNews(res.data || []);
    } catch (error) {
      message.error('加载市场消息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 切换收藏状态
  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favoriteNews);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavoriteNews(newFavorites);
    // 这里可以添加API调用，保存收藏状态
    message.success(favoriteNews.has(id) ? '取消收藏成功' : '收藏成功');
  };

  // 初始化数据
  useEffect(() => {
    loadMarketNews();
  }, []);

  return (
    <PageContainer
      title="市场消息列表"
      header={{
        extra: <Button type="primary" icon={<SearchOutlined />} onClick={loadMarketNews}>刷新数据</Button>,
      }}
    >
      <Card title="市场消息" loading={loading}>
        <ProTable
          actionRef={actionRef}
          columns={newsColumns}
          dataSource={marketNews}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          search={{
            labelWidth: 120,
          }}
          // 移除不支持的 filterFormItems 属性
        />
      </Card>
    </PageContainer>
  );
};

export default MarketMessageList;