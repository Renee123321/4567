import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Typography, List, message, Tag, Modal, Spin, Divider } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUpOutlined, 
  TrendingDownOutlined, 
  ReloadOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import * as cryptoInvestmentService from '@/services/cryptoInvestment';

const { Title, Paragraph, Text } = Typography;
const { Column } = Table;

// 模拟数据
const mockPortfolioOverview = {
  totalValue: 1000000,
  totalChange24h: -25000,
  totalChangePercentage24h: -2.5,
  assetAllocation: [
    { id: '1', symbol: 'BTC', name: '比特币', amount: 5, price: 42000, totalValue: 210000, percentage: 21, change24h: -1.2 },
    { id: '2', symbol: 'ETH', name: '以太坊', amount: 50, price: 2100, totalValue: 105000, percentage: 10.5, change24h: 0.8 },
    { id: '3', symbol: 'SOL', name: '索拉纳', amount: 500, price: 120, totalValue: 60000, percentage: 6, change24h: 3.2 },
    { id: '4', symbol: 'USDT', name: '泰达币', amount: 625000, price: 1, totalValue: 625000, percentage: 62.5, change24h: 0 },
  ],
  lastUpdated: '2023-09-15T10:30:00Z',
};

const mockMarketNews = [
  {
    id: '1',
    title: '比特币ETF申请获SEC批准进入最终审查阶段',
    content: '美国证券交易委员会(SEC)已将比特币ETF申请推进至最终审查阶段，市场预期可能在未来3个月内获得批准。',
    source: 'Crypto News',
    publishTime: '2023-09-15T08:30:00Z',
    sentiment: 'positive',
    relatedCoins: ['BTC'],
  },
  {
    id: '2',
    title: '以太坊网络升级计划于下月启动',
    content: '以太坊开发者宣布网络下一次重大升级计划于10月月份启动，预计将进一步提高网络吞吐量。',
    source: 'ETH Daily',
    publishTime: '2023-09-15T07:15:00Z',
    sentiment: 'positive',
    relatedCoins: ['ETH'],
  },
  {
    id: '3',
    title: '全球监管环境趋紧，多国加强加密货币监管力度',
    content: '随着加密货币市场波动加剧，多个国家近期宣布加强监管措施，市场担忧情绪有所上升。',
    source: 'Financial Times',
    publishTime: '2023-09-14T22:45:00Z',
    sentiment: 'negative',
    relatedCoins: ['BTC', 'ETH', 'SOL'],
  },
];

const mockInvestmentSuggestion = {
  id: '1',
  date: '2023-09-15',
  assetsToIncrease: [
    { symbol: 'BTC', currentPercentage: 21, suggestedPercentage: 25, reason: 'ETF申请进展顺利，市场预期积极' },
    { symbol: 'ETH', currentPercentage: 10.5, suggestedPercentage: 13, reason: '网络升级预期利好，技术面走强' },
  ],
  assetsToDecrease: [
    { symbol: 'USDT', currentPercentage: 62.5, suggestedPercentage: 56, reason: '当前稳定币比例过高，建议适当增加风险资产配置' },
  ],
  summary: '根据最新市场消息分析，建议适当增加BTC和ETH的配置比例，降低USDT的持有比例。近期加密货币市场整体ngood，监管风险有所缓解，技术面也呈现积极信号。',
  status: 'pending',
};

const mockHistoricalData = [
  { date: '2023-09-01', totalValue: 980000 },
  { date: '2023-09-02', totalValue: 985000 },
  { date: '2023-09-03', totalValue: 995000 },
  { date: '2023-09-04', totalValue: 1010000 },
  { date: '2023-09-05', totalValue: 1008000 },
  { date: '2023-09-06', totalValue: 1020000 },
  { date: '2023-09-07', totalValue: 1015000 },
  { date: '2023-09-08', totalValue: 1025000 },
  { date: '2023-09-09', totalValue: 1030000 },
  { date: '2023-09-10', totalValue: 1028000 },
  { date: '2023-09-11', totalValue: 1040000 },
  { date: '2023-09-12', totalValue: 1035000 },
  { date: '2023-09-13', totalValue: 1030000 },
  { date: '2023-09-14', totalValue: 1025000 },
  { date: '2023-09-15', totalValue: 1000000 },
];

// 饼图颜色
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

// 删除注释掉的箭头函数组件声明，保留正确的函数声明
function CryptoInvestmentDashboard() {
  const [portfolioData, setPortfolioData] = useState(mockPortfolioOverview);
  const [marketNews, setMarketNews] = useState(mockMarketNews);
  const [investmentSuggestion, setInvestmentSuggestion] = useState(mockInvestmentSuggestion);
  const [historicalData, setHistoricalData] = useState(mockHistoricalData);
  const [loading, setLoading] = useState(false);
  const [showSuggestionDetail, setShowSuggestionDetail] = useState(false);
  
  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      // 在实际环境中，这里会调用真实的API
      // const portfolioResp = await cryptoInvestmentService.getPortfolioOverview();
      // const newsResp = await cryptoInvestmentService.getMarketNews();
      // const suggestionResp = await cryptoInvestmentService.getLatestInvestmentSuggestion();
      // const historyResp = await cryptoInvestmentService.getHistoricalData({ days: 15 });
      
      // 使用模拟数据
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('数据更新成功');
    } catch (error) {
      message.error('数据加载失败，请稍后重试');
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 审批建议
  const handleApproveSuggestion = async (status: 'approved' | 'rejected') => {
    try {
      // 在实际环境中，这里会调用真实的API
      // await cryptoInvestmentService.approveInvestmentSuggestion({
      //   suggestionId: investmentSuggestion.id,
      //   status,
      // });
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvestmentSuggestion({
        ...investmentSuggestion,
        status,
        approvalTime: new Date().toISOString(),
        approvedBy: '当前用户',
      });
      
      message.success(`已${status === 'approved' ? '批准' : '拒绝'}投资建议`);
      setShowSuggestionDetail(false);
    } catch (error) {
      message.error('操作失败，请稍后重试');
      console.error('Failed to approve suggestion:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="crypto-investment-dashboard">
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>数字货币投资辅助系统</Title>
        <Text type="secondary">市场信息自动收集、持仓合理性分析及调整建议生成</Text>
      </div>

      {/* 投资组合概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="总资产价值" 
              value={portfolioData.totalValue} 
              precision={2} 
              valueStyle={{ color: '#3f8600' }}
              prefix="$" 
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="24小时变化" 
              value={portfolioData.totalChange24h} 
              precision={2} 
              valueStyle={{ color: portfolioData.totalChange24h >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={portfolioData.totalChange24h >= 0 ? <TrendingUpOutlined /> : <TrendingDownOutlined />}
              suffix="$" 
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="24小时变化率" 
              value={portfolioData.totalChangePercentage24h} 
              precision={2} 
              valueStyle={{ color: portfolioData.totalChangePercentage24h >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={portfolioData.totalChangePercentage24h >= 0 ? <TrendingUpOutlined /> : <TrendingDownOutlined />}
              suffix="%" 
            />
          </Card>
        </Col>
      </Row>

      {/* 资产配置和历史走势 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="资产配置" extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadData} loading={loading} />}>
            <div style={{ height: 300 }}>
              <PieChart>
                <Pie
                  data={portfolioData.assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                  // 删除这行错误的代码：
                  label={({ name, percentage }: { name: string, percentage: number }) => `${name}: ${percentage}%`}
                >
                  {portfolioData.assetAllocation.map((entry: { id: string; symbol: string; name: string; amount: number; price: number; totalValue: number; percentage: number; change24h: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="资产总值历史走势" extra={<Text type="secondary">近15天</Text>}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value}`} />
                  <Area type="monotone" dataKey="totalValue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 持仓详情和市场消息 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="持仓详情" extra={<Text type="secondary">最后更新: {new Date(portfolioData.lastUpdated).toLocaleString()}</Text>}>
            <Table dataSource={portfolioData.assetAllocation} rowKey="id" pagination={false}>
              <Column title="币种" dataIndex="name" key="name" render={(text: string, record: { symbol: string }) => `${text} (${record.symbol})`} />
              <Column title="数量" dataIndex="amount" key="amount" />
              <Column title="单价" dataIndex="price" key="price" render={(value: number) => `$${value}`} />
              // 修改为（添加value参数的类型注解）：
              <Column title="总价值" dataIndex="totalValue" key="totalValue" render={(value: number) => `$${value.toLocaleString()}`} />
              <Column title="占比" dataIndex="percentage" key="percentage" render={(value: number) => `${value}%`} />
              <Column 
                title="24h变化" 
                dataIndex="change24h" 
                key="change24h" 
                render={(value: number) => (
                  <Tag color={value >= 0 ? "green" : "red"}>
                    {value >= 0 ? '+' : ''}{value}%
                  </Tag>
                )} 
              />
            </Table>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最新市场消息" extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadData} loading={loading} />}>
            <List
              dataSource={marketNews}
              renderItem={(news: { 
                id: string; 
                title: string; 
                content: string; 
                source: string; 
                publishTime: string; 
                sentiment: string; 
                relatedCoins: string[] 
              }) => (
                <List.Item style={{ paddingBottom: 16, borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text strong>{news.title}</Text>
                      <Tag 
                        color={
                          news.sentiment === 'positive' ? 'green' : 
                          news.sentiment === 'negative' ? 'red' : 'gray'
                        }
                      >
                        {news.sentiment === 'positive' ? '利好' : 
                         news.sentiment === 'negative' ? '利空' : '中性'}
                      </Tag>
                    </div>
                    <Paragraph ellipsis={{ rows: 2 }}>{news.content}</Paragraph>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary">{news.source}</Text>
                      <Text type="secondary">{new Date(news.publishTime).toLocaleString()}</Text>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {news.relatedCoins.map(coin => (
                        <Tag key={coin} color="blue">{coin}</Tag>
                      ))}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 投资建议 */}
      <Card 
        title="投资建议" 
        extra={
          investmentSuggestion.status === 'pending' ? 
            <Button 
              type="primary" 
              icon={<FileTextOutlined />}
              onClick={() => setShowSuggestionDetail(true)}
            >
              查看详情
            </Button> : null
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>日期: </Text>
          <Text>{investmentSuggestion.date}</Text>
          <Text style={{ marginLeft: 16 }} strong>状态: </Text>
          <Tag 
            color={
              investmentSuggestion.status === 'approved' ? 'green' : 
              investmentSuggestion.status === 'rejected' ? 'red' : 'blue'
            }
          >
            {investmentSuggestion.status === 'approved' ? '已批准' : 
             investmentSuggestion.status === 'rejected' ? '已拒绝' : '待审批'}
          </Tag>
        </div>
        
        <Paragraph>{investmentSuggestion.summary}</Paragraph>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>建议增持: </Text>
            </div>
            <List
              size="small"
              dataSource={investmentSuggestion.assetsToIncrease}
              renderItem={(item: { symbol: string; currentPercentage: number; suggestedPercentage: number }) => (
                <List.Item>
                  <Text strong>{item.symbol}</Text>
                  <Text style={{ marginLeft: 8 }}>
                    {item.currentPercentage}% → {item.suggestedPercentage}%
                  </Text>
                </List.Item>
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>建议减持: </Text>
            </div>
            <List
              size="small"
              dataSource={investmentSuggestion.assetsToDecrease}
              renderItem={(item: { symbol: string; currentPercentage: number; suggestedPercentage: number }) => (
                <List.Item>
                  <Text strong>{item.symbol}</Text>
                  <Text style={{ marginLeft: 8 }}>
                    {item.currentPercentage}% → {item.suggestedPercentage}%
                  </Text>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>

      {/* 建议详情和审批模态框 */}
      <Modal
        title="投资建议详情"
        open={showSuggestionDetail}
        onCancel={() => setShowSuggestionDetail(false)}
        footer={investmentSuggestion.status === 'pending' ? [
          <Button key="cancel" onClick={() => setShowSuggestionDetail(false)}>取消</Button>,
          <Button 
            key="reject" 
            danger 
            icon={<CloseCircleOutlined />}
            onClick={() => handleApproveSuggestion('rejected')}
          >
            拒绝
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleApproveSuggestion('approved')}
          >
            批准
          </Button>
        ] : null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>日期: </Text>
          <Text>{investmentSuggestion.date}</Text>
          <Text style={{ marginLeft: 16 }} strong>状态: </Text>
          <Tag 
            color={
              investmentSuggestion.status === 'approved' ? 'green' : 
              investmentSuggestion.status === 'rejected' ? 'red' : 'blue'
            }
          >
            {investmentSuggestion.status === 'approved' ? '已批准' : 
             investmentSuggestion.status === 'rejected' ? '已拒绝' : '待审批'}
          </Tag>
        </div>
        
        <Divider />
        
        <Title level={5}>建议摘要</Title>
        <Paragraph>{investmentSuggestion.summary}</Paragraph>
        
        <Divider />
        
        <Title level={5}>建议增持资产</Title>
        <Table dataSource={investmentSuggestion.assetsToIncrease} rowKey="symbol" pagination={false}>
          <Column title="币种" dataIndex="symbol" key="symbol" />
          <Column title="当前占比" dataIndex="currentPercentage" key="currentPercentage" render={(value: number) => `${value}%`} />
          <Column title="建议占比" dataIndex="suggestedPercentage" key="suggestedPercentage" render={(value: number) => `${value}%`} />
          <Column title="原因" dataIndex="reason" key="reason" />
        </Table>
        
        <Divider />
        
        <Title level={5}>建议减持资产</Title>
        <Table dataSource={investmentSuggestion.assetsToDecrease} rowKey="symbol" pagination={false}>
          <Column title="币种" dataIndex="symbol" key="symbol" />
          <Column title="当前占比" dataIndex="currentPercentage" key="currentPercentage" render={(value: number) => `${value}%`} />
          <Column title="建议占比" dataIndex="suggestedPercentage" key="suggestedPercentage" render={(value: number) => `${value}%`} />
          <Column title="原因" dataIndex="reason" key="reason" />
        </Table>
      </Modal>
    </div>
  );
};

export default CryptoInvestmentDashboard;