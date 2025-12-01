// 添加React和JSX的类型声明
declare module 'react';
declare module 'react-dom';

// 添加antd和相关库的类型声明
declare module 'antd';
declare module '@ant-design/icons';
declare module 'recharts';

// 为Umi Max添加详细的类型声明
declare module '@umijs/max' {
  export function request<T = any>(
    url: string,
    options?: {
      method?: string;
      headers?: Record<string, string>;
      params?: any;
      data?: any;
      timeout?: number;
      [key: string]: any;
    }
  ): Promise<T>;
}

// 为服务模块添加类型声明
declare module '@/services/cryptoInvestment' {
  export function getPortfolioOverview(): Promise<any>;
  export function getMarketNews(params?: any): Promise<any>;
  export function getLatestInvestmentSuggestion(): Promise<any>;
  export function getHistoricalData(params?: any): Promise<any>;
  export function approveInvestmentSuggestion(params?: any): Promise<any>;
}

// 确保JSX类型定义正确
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// 保留现有的声明
declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
