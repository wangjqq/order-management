import { COLOR_ENUM, LOCATION, ORDER_STATUS } from '@/constants';
import { getCustomerAddresss, getCustomers } from '@/services/customer';
import { createOrder, delOrder, getOrders } from '@/services/order';
import { getProducts } from '@/services/product';
import { findLabelsByCodes } from '@/utils/format';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, Popconfirm, Space, Tag, message } from 'antd';
import { useRef, useState } from 'react';
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

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增订单');
  const [customerAddresss, setCustomerAddresss] = useState({});

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 48,
      render: (_, record, index, action: any) => {
        const { current, pageSize } = action.pageInfo;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: '商品',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '顾客',
      dataIndex: 'customerName',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'OrderStatus',
      ellipsis: true,
      render: (text) => {
        console.log(text);
        return (
          // @ts-ignore
          <Tag color={COLOR_ENUM[text.props.children]}>
            {/* @ts-ignore */}
            {ORDER_STATUS[text.props.children]}
          </Tag>
        );
      },
    },
    {
      title: '下单时间',
      dataIndex: 'OrderDate',
      valueType: 'dateTime',
    },
    {
      title: '预计发货时间',
      dataIndex: 'expectedDeliverTime',
      valueType: 'dateTime',
    },
    {
      title: '订单利润',
      dataIndex: 'OrderPrice',
      valueType: 'money',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record: any) => [
        <Button
          type="link"
          key="editable"
          onClick={async () => {
            console.log(record);
            form.setFieldsValue(record);
            setModalVisit(true);
            setModalTitle('编辑订单');
            const res = await getCustomerAddresss({
              CustomerID: record.customerId,
              userId: JSON.parse(localStorage.getItem('user') || '{}').user_id,
            });
            const data = res.data.map((item: any) => {
              return {
                label: `${item.fullName} ${
                  item.phoneNumber
                } ${findLabelsByCodes(
                  JSON.parse(item.locationAddress),
                  LOCATION,
                ).join(' ')} ${item.streetAddress}`,
                value: item.id,
              };
            });
            const outputObject = data.reduce((result: any, item: any) => {
              result[item.value] = item.label;
              return result;
            }, {});
            console.log(outputObject);
            setCustomerAddresss(outputObject);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="删除后将无法恢复"
          onConfirm={async () => {
            await delOrder({
              OrderID: record.OrderID,
              userId: JSON.parse(localStorage.getItem('user') || '{}').user_id,
            });
            message.success('删除成功');
            actionRef.current!.reload();
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">删除</Button>
        </Popconfirm>,
      ],
    },
  ];

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
              title={modalTitle}
              open={modalVisit}
              onOpenChange={setModalVisit}
              trigger={
                <Button
                  type="primary"
                  onClick={() => setModalTitle('新增订单')}
                >
                  <PlusOutlined />
                  新增订单
                </Button>
              }
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
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
              <ProFormText name="OrderID" label="订单ID" hidden={true} />
              <ProFormSelect
                name="productId"
                label="商品"
                request={async () => {
                  let { data }: any = await getProducts({
                    userId: JSON.parse(localStorage.getItem('user') || '{}')
                      .user_id,
                    current: 1,
                    pageSize: 1000,
                  });
                  data = data.data.map((item: any) => {
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
              <Space>
                <ProFormDateTimePicker
                  name="OrderDate"
                  label="下单时间"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                />
                <ProFormDateTimePicker
                  name="expectedDeliverTime"
                  label="预计发货时间"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                />
              </Space>
              <Space>
                <ProFormDigit
                  label="订单利润"
                  name="OrderPrice"
                  min={0}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                />
                <ProFormDigit
                  label="总计数量"
                  name="TotalAmount"
                  min={0}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                />
              </Space>
              <Space>
                <ProFormSelect
                  name="customerId"
                  width={'sm'}
                  label="顾客"
                  request={async () => {
                    const res: any = await getCustomers({
                      userId: JSON.parse(localStorage.getItem('user') || '{}')
                        .user_id,
                    });
                    res.data = res.data.map((item: any) => {
                      return {
                        label: item.Name,
                        AddressIds: item.AddressIds,
                        value: item.CustomerID,
                      };
                    });
                    return res.data;
                  }}
                  placeholder="请选择顾客"
                  rules={[{ required: true, message: '请选择顾客!' }]}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  onChange={async (value, option) => {
                    const res = await getCustomerAddresss({
                      AddressIds: option.AddressIds,
                      userId: JSON.parse(localStorage.getItem('user') || '{}')
                        .user_id,
                    });
                    const data = res.data.map((item: any) => {
                      return {
                        label: `${item.fullName} ${
                          item.phoneNumber
                        } ${findLabelsByCodes(
                          JSON.parse(item.locationAddress),
                          LOCATION,
                        ).join(' ')} ${item.streetAddress}`,
                        value: item.id,
                      };
                    });
                    const outputObject = data.reduce(
                      (result: any, item: any) => {
                        result[item.value] = item.label;
                        return result;
                      },
                      {},
                    );
                    setCustomerAddresss(outputObject);
                  }}
                />
                <ProFormSelect
                  name="CustomerAddressId"
                  width={'sm'}
                  label="收货地址"
                  valueEnum={customerAddresss}
                  placeholder="请选择收货地址"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
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
