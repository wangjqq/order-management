import { createOrder, getCustomerAddress, getOrders } from '@/services/order';
import { getProducts } from '@/services/product';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, Form, Space, Tag, message } from 'antd';
import { useRef } from 'react';
import styles from './index.less';
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '商品',
    dataIndex: 'product',
  },
  {
    title: '状态',
    dataIndex: 'OrderStatus',
    ellipsis: true,
    render: (OrderStatus) => (
      <Space>
        <Tag>{OrderStatus}</Tag>
      </Space>
    ),
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'labels',
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{ name: string; company: string }>();
  // actionRef.current.reload();
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <ProTable<GithubIssueItem>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async () => {
            return await getOrders({
              userId: JSON.parse(localStorage.getItem('user') || '{}').user_id,
            });
          }}
          rowKey="id"
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          search={false}
          pagination={{
            pageSize: 5,
            onChange: (page) => console.log(page),
          }}
          toolBarRender={() => [
            <ModalForm<{
              name: string;
              company: string;
            }>
              key="add"
              title="新增订单"
              trigger={
                <Button type="primary">
                  <PlusOutlined />
                  新增订单
                </Button>
              }
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              layout="horizontal"
              form={form}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
              }}
              width={500}
              submitTimeout={5000}
              onFinish={async (values: any) => {
                values.userId = JSON.parse(
                  localStorage.getItem('user') || '{}',
                ).user_id;
                await createOrder(values);
                message.success('提交成功');
                actionRef.current!.reload();
                return true;
              }}
              initialValues={{ OrderStatus: 'preSales' }}
            >
              <ProFormSelect
                name="productId"
                label="商品"
                request={async () => {
                  let { data }: any = await getProducts({
                    userId: JSON.parse(localStorage.getItem('user') || '{}')
                      .user_id,
                  });
                  data = data.map((item: any) => {
                    return {
                      label: item.ProductName,
                      value: item.ProductID,
                    };
                  });
                  return data;
                }}
                placeholder="请选择商品"
                rules={[{ required: true, message: '请选择商品!' }]}
              />
              <ProFormSelect
                name="OrderStatus"
                label="订单状态"
                valueEnum={{
                  preSales: '售前',
                  paid: '已付款',
                  production: '制作中',
                  shipped: '已发货',
                  received: '已收货',
                  over: '已完结',
                  cancel: '已取消',
                }}
                placeholder="请选择订单状态"
                rules={[{ required: true, message: '请选择订单状态!' }]}
              />
              <ProFormDateTimePicker
                name="expectedDeliverTime"
                label="预计发货时间"
                width={'lg'}
              />
              <Space>
                <ProFormDigit label="订单总价" name="OrderPrice" min={0} />
                <ProFormDigit label="总计数量" name="TotalAmount" min={0} />
              </Space>
              <Space>
                <ProFormSelect
                  name="customerId"
                  width={'sm'}
                  label="顾客"
                  request={async () => {
                    const res: any = await getCustomerAddress({
                      userId: JSON.parse(localStorage.getItem('user') || '{}')
                        .user_id,
                    });
                    res.map((item: any) => {
                      return {
                        label:
                          item.locationAddress +
                          '-' +
                          item.streetAddress +
                          '-' +
                          item.fullName +
                          '-' +
                          item.phoneNumber,
                        value: item.id,
                      };
                    });
                    return res;
                  }}
                  placeholder="请选择顾客"
                  rules={[{ required: true, message: '请选择顾客!' }]}
                />
                <ProFormSelect
                  name="CustomerAddressId"
                  width={'sm'}
                  label="收货地址"
                  request={async () => {
                    const res: any = await getCustomerAddress({
                      userId: JSON.parse(localStorage.getItem('user') || '{}')
                        .user_id,
                    });
                    res.map((item: any) => {
                      return {
                        label:
                          item.locationAddress +
                          '-' +
                          item.streetAddress +
                          '-' +
                          item.fullName +
                          '-' +
                          item.phoneNumber,
                        value: item.id,
                      };
                    });
                    return res;
                  }}
                  placeholder="请选择收货地址"
                />
              </Space>
              <ProFormTextArea
                name="Remark"
                label="备注"
                placeholder="请输入订单备注"
              />
            </ModalForm>,
          ]}
        />
      </div>
    </PageContainer>
  );
};
