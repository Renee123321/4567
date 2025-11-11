declare namespace API.Wms {
    // 定义 Demo 接口
    export interface Demo {
        id: number;
        demoName: string;
        demoAge: number;
        demoGender: number;
        remark: string;
        createBy: string;
        createTime: string;
        updateBy: string;
        updateTime: string;
        delFlag: number;
    }

    // 定义 Demo 列表查询参数接口
    export interface DemoListParams {
        id?: number;
        demoName?: string;
        demoAge?: number;
        demoGender?: number;
        remark?: string;
        searchValue?: string;
        pageSize?: string;
        current?: string;
    }

    // 定义单个 Demo 查询结果接口
    export interface DemoResult {
        code: number;
        msg: string;
        data: Demo;
    }

    // 定义 Demo 分页查询结果接口
    export interface DemoPageResult {
        code: number;
        msg: string;
        total: number;
        rows: Demo[];
    }
}