import React, { useState, useEffect, useRef } from 'react';
import { useIntl, useAccess } from '@umijs/max';
import { Button, Card, Row, Col, message, Tabs, Statistic, Modal } from 'antd';
import { PageContainer, ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import { SearchOutlined, DownloadOutlined, ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Area, Pie } from '@ant-design/plots';
import dayjs from 'dayjs';
import {
  listAnalysisReports,
  getLatestReport,
  getReportDetail,
  getCurrentHoldings,
  getMarketNews,
  auditReport,
  exportReports,
} from '@/services/crypto/analysis';
import DictTag from '@/components/DictTag';
import { StarOutlined, StarFilled } from '@ant-design/icons';

const { TabPane } = Tabs;

const CryptoAnalysisPage: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [latestReport, setLatestReport] = useState<API.Crypto.AnalysisReport | null>(null);
  const [holdings, setHoldings] = useState<API.Crypto.CryptoHolding[]>([]);
  const [marketNews, setMarketNews] = useState<API.Crypto.MarketNews[]>([]);
  const [selectedReport, setSelectedReport] = useState<API.Crypto.AnalysisReport | null>(null);
  const [reportDetailModalVisible, setReportDetailModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditAction, setAuditAction] = useState<'approve' | 'reject'>('approve');
  const [favoriteNews, setFavoriteNews] = useState<Set<number>>(new Set());
  const actionRef = useRef<ActionType>();

  // 报告列表表格列配置
  const reportColumns: ProColumns<API.Crypto.AnalysisReport>[] = [
    {
      title: '报告日期',
      dataIndex: 'reportDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: '当前总资产价值',
      dataIndex: 'currentTotalValue',
      valueType: 'money',
      sorter: true,
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      valueType: 'select',
      valueEnum: {
        low: { text: '低', status: 'success' },
        medium: { text: '中', status: 'warning' },
        high: { text: '高', status: 'error' },
      },
      sorter: true,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      valueType: 'select',
      valueEnum: {
        pending: { text: '待审核', status: 'default' },
        approved: { text: '已通过', status: 'success' },
        rejected: { text: '已拒绝', status: 'error' },
      },
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="view"
          onClick={() => {
            setSelectedReport(record);
            setReportDetailModalVisible(true);
          }}
        >
          查看详情
        </Button>,
        record.auditStatus === 'pending' && access.hasPerms('crypto:analysis:audit') && (
          <Button
            key="audit"
            type="primary"
            onClick={() => {
              setSelectedReport(record);
              setAuditModalVisible(true);
            }}
          >
            审核
          </Button>
        ),
      ],
    },
  ];

  // 加载仪表盘数据
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 并行加载数据
      const [reportRes, holdingsRes, newsRes] = await Promise.all([
        getLatestReport(),
        getCurrentHoldings(),
        getMarketNews(),
      ]);

      setLatestReport(reportRes.data || null);
      setHoldings(holdingsRes.data || []);
      setMarketNews(newsRes.data || []);

      message.success('数据加载成功');
    } catch (error) {
      message.error('数据加载失败');
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载历史报告
  const loadReportsData = async () => {
    setLoading(true);
    try {
      const res = await listAnalysisReports();
      return res;
    } catch (error) {
      message.error('报告加载失败');
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  // 导出报告
  const handleExport = async () => {
    try {
      await exportReports();
      message.success('报告导出成功');
    } catch (error) {
      message.error('报告导出失败');
      console.error('导出报告失败:', error);
    }
  };

  // 审核报告
  const confirmAudit = async () => {
    if (!selectedReport) return;

    setLoading(true);
    try {
      await auditReport(selectedReport.id, {
        status: auditAction,
      });

      message.success(`报告${auditAction === 'approve' ? '通过' : '拒绝'}成功`);
      setAuditModalVisible(false);
      setSelectedReport(null);

      // 重新加载数据
      if (activeTab === 'dashboard') {
        loadDashboardData();
      }
    } catch (error) {
      message.error(`报告${auditAction === 'approve' ? '通过' : '拒绝'}失败`);
      console.error('审核报告失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 收藏/取消收藏新闻
  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favoriteNews);
    if (favoriteNews.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavoriteNews(newFavorites);
    message.success(favoriteNews.has(id) ? '取消收藏成功' : '收藏成功');
  };

  // 图表配置
  const pieConfig = {
    data: holdings.map((item) => ({
      type: item.currencyType,
      value: item.marketValue,
    })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // 资产走势图表配置
  const areaConfig = {
    data: [],
    xField: 'date',
    yField: 'value',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadDashboardData();
  }, []);

  // 修复组件结构，确保所有JSX都在返回值中
  return (
    <PageContainer
      title="数字货币投资分析系统"
      header={{
        extra: <Button type="primary" icon={<SearchOutlined />} onClick={loadDashboardData}>刷新数据</Button>,
      }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="仪表盘" key="dashboard">
          <Row gutter={[16, 16]}>
            {/* 总览卡片 */}
            <Col span={24}>
              <Card title="投资组合总览" loading={loading}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="总资产价值"
                      value={latestReport?.currentTotalValue || 0}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      prefix="$"
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="风险等级"
                      value={
                        latestReport?.riskLevel === 'low'
                          ? '低'
                          : latestReport?.riskLevel === 'medium'
                          ? '中'
                          : latestReport?.riskLevel === 'high'
                          ? '高'
                          : '--'
                      }
                      valueStyle={{
                        color:
                          latestReport?.riskLevel === 'low'
                            ? '#3f8600'
                            : latestReport?.riskLevel === 'medium'
                            ? '#faad14'
                            : latestReport?.riskLevel === 'high'
                            ? '#cf1322'
                            : '#666',
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="24小时涨跌幅"
                      value={(latestReport as any)?.dailyChange || 0}
                      precision={2}
                      valueStyle={{
                        color: (latestReport as any)?.dailyChange >= 0 ? '#3f8600' : '#cf1322',
                      }}
                      suffix="%"
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="报告日期"
                      value={latestReport?.reportDate ? dayjs(latestReport?.reportDate).format('YYYY-MM-DD') : '--'}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="审核状态"
                      value={
                        latestReport?.auditStatus === 'pending'
                          ? '待审核'
                          : latestReport?.auditStatus === 'approved'
                          ? '已通过'
                          : latestReport?.auditStatus === 'rejected'
                          ? '已拒绝'
                          : '--'
                      }
                      valueStyle={{
                        color:
                          latestReport?.auditStatus === 'pending'
                            ? '#1890ff'
                            : latestReport?.auditStatus === 'approved'
                            ? '#3f8600'
                            : latestReport?.auditStatus === 'rejected'
                            ? '#cf1322'
                            : '#666',
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 持仓分布 */}
            <Col xs={24} md={12}>
              <Card title="持仓分布" loading={loading}>
                <div style={{ height: 300 }}>
                  {holdings.length > 0 ? <Pie {...pieConfig} /> : <div style={{ textAlign: 'center', lineHeight: '300px' }}>暂无数据</div>}
                </div>
              </Card>
            </Col>

            {/* 资产走势 */}
            <Col xs={24} md={12}>
              <Card title="资产走势（近7天）" loading={loading}>
                <div style={{ height: 300 }}>
                  <Area {...areaConfig} />
                </div>
              </Card>
            </Col>

            {/* 市场消息 */}
            <Col span={24}>
              <Card title="最新市场消息" loading={loading}>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {marketNews.length > 0 ? (
                    <Row gutter={[16, 16]}>
                      {marketNews.slice(0, 6).map((news) => (
                        <Col xs={24} sm={12} md={8} key={news.id}>
                          <Card
                            size="small"
                            title={
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: 8 }}>{news.title}</span>
                                <DictTag
                                  value={news.sentiment}
                                  enums={{
                                    positive: { label: '利好', status: 'success', value: 'positive', text: '利好' },
                                    negative: { label: '利空', status: 'error', value: 'negative', text: '利空' },
                                    neutral: { label: '中性', status: 'default', value: 'neutral', text: '中性' },
                                  }}
                                />
                              </div>
                            }
                            extra={news.currencyType}
                            bodyStyle={{ padding: 10 }}
                          >
                            <p style={{ margin: 0, fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {news.content}
                            </p>
                            <div style={{ marginTop: 8, fontSize: 11, color: '#999', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{dayjs(news.newsDate).format('MM-DD HH:mm')}</span>
                              <span>{news.source}</span>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 20 }}>暂无市场消息</div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 持仓明细 */}
        <TabPane tab="持仓明细" key="holdings">
          <Card title="当前持仓" loading={loading}>
            <ProTable
              columns={[
                {
                  title: '币种',
                  dataIndex: 'currencyType',
                  valueType: 'text',
                },
                {
                  title: '持仓数量',
                  dataIndex: 'quantity',
                  valueType: 'text',
                  render: (_, record) => {
                    if (typeof record.quantity === 'number') {
                      return record.quantity.toFixed(8);
                    }
                    return record.quantity;
                  },
                },
                {
                  title: '购买价格',
                  dataIndex: 'purchasePrice',
                  valueType: 'money',
                },
                {
                  title: '当前价格',
                  dataIndex: 'currentPrice',
                  valueType: 'money',
                },
                {
                  title: '市值',
                  dataIndex: 'marketValue',
                  valueType: 'money',
                },
                {
                  title: '盈亏金额',
                  dataIndex: 'profitLoss',
                  valueType: 'money',
                  render: (_, record) => {
                    const value = record.profitLoss;
                    return (
                      <span style={{ color: value >= 0 ? '#3f8600' : '#cf1322' }}>
                        {value >= 0 ? '+' : ''}{value}
                      </span>
                    );
                  },
                },
                {
                  title: '盈亏比例',
                  dataIndex: 'profitLossRate',
                  valueType: 'percent',
                  render: (_, record) => {
                    const value = record.profitLossRate;
                    return (
                      <span style={{ color: value >= 0 ? '#3f8600' : '#cf1322' }}>
                        {(value * 100).toFixed(2)}%
                      </span>
                    );
                  },
                },
                {
                  title: '占比',
                  dataIndex: 'allocationPercentage',
                  valueType: 'percent',
                },
                {
                  title: '最后更新',
                  dataIndex: 'lastUpdated',
                  valueType: 'dateTime',
                },
              ]}
              dataSource={holdings}
              rowKey="id"
              pagination={{
                pageSize: 10,
              }}
            />
          </Card>
        </TabPane>

        {/* 历史报告 */}
        <TabPane tab="历史报告" key="reports">
          <Card
            title="历史分析报告"
            extra={<Button icon={<DownloadOutlined />} onClick={handleExport}>导出报告</Button>}
          >
            <ProTable
              actionRef={actionRef}
              columns={reportColumns}
              request={(params) =>
                listAnalysisReports({
                  pageNum: params.current,
                  pageSize: params.pageSize,
                }).then((res) => ({
                  data: res.rows,
                  total: res.total,
                  success: true,
                }))
              }
              rowKey="id"
              pagination={{
                pageSize: 10,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 报告详情模态框 */}
      <Modal
        title="分析报告详情"
        open={reportDetailModalVisible}
        onCancel={() => setReportDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReportDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedReport && (
          <div>
            <h2>报告基本信息</h2>
            <div className="report-detail">
              <p><strong>报告日期：</strong>{dayjs(selectedReport!.reportDate).format('YYYY-MM-DD')}</p>
              <p><strong>当前总资产价值：</strong>${selectedReport!.currentTotalValue.toFixed(2)}</p>
              <p><strong>风险等级：</strong>
                <DictTag
                  value={selectedReport!.riskLevel}
                  enums={{
                    low: { label: '低', status: 'success', value: 'low', text: '低' },
                    medium: { label: '中', status: 'warning', value: 'medium', text: '中' },
                    high: { label: '高', status: 'error', value: 'high', text: '高' },
                  }}
                />
              </p>
              <p><strong>审核状态：</strong>
                <DictTag
                  value={selectedReport!.auditStatus}
                  enums={{
                    pending: { label: '待审核', status: 'default', value: 'pending', text: '待审核' },
                    approved: { label: '已通过', status: 'success', value: 'approved', text: '已通过' },
                    rejected: { label: '已拒绝', status: 'error', value: 'rejected', text: '已拒绝' },
                  }}
                />
              </p>
              {selectedReport!.auditStatus !== 'pending' && (
                <>
                  <p><strong>审核人：</strong>{selectedReport!.auditBy}</p>
                  <p><strong>审核时间：</strong>{selectedReport!.auditTime ? dayjs(selectedReport!.auditTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
                  {selectedReport!.auditRemark && <p><strong>审核备注：</strong>{selectedReport!.auditRemark}</p>}
                </>
              )}
            </div>

            <h2 style={{ marginTop: 20 }}>市场摘要</h2>
            <div className="report-content">
              <p>{selectedReport!.marketSummary}</p>
            </div>

            <h2 style={{ marginTop: 20 }}>建议调整</h2>
            <div className="report-content">
              <p>{selectedReport!.suggestedAdjustments}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 审核模态框 */}
      <Modal
        title="审核报告"
        open={auditModalVisible}
        onCancel={() => setAuditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAuditModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="reject"
            danger
            onClick={() => {
              setAuditAction('reject');
              confirmAudit();
            }}
          >
            拒绝
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => {
              setAuditAction('approve');
              confirmAudit();
            }}
          >
            通过
          </Button>,
        ]}
        width={500}
      >
        <div style={{ padding: 20 }}>
          <p>确定要{auditAction === 'approve' ? '通过' : '拒绝'}这份报告吗？</p>
          <p style={{ marginTop: 10, color: '#666' }}>报告日期：{selectedReport ? dayjs(selectedReport.reportDate).format('YYYY-MM-DD') : ''}</p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default CryptoAnalysisPage;