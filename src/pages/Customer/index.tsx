import { LOCATION } from '@/constants';
import {
  createCustomer,
  createCustomerAddress,
  delCustomer,
  getCustomerAddresss,
  getCustomers,
} from '@/services/customer';
import { findLabelsByCodes } from '@/utils/format';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Cascader, Form, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增顾客');

  const columns: ProColumns[] = [
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
      title: '姓名',
      dataIndex: 'Name',
    },
    {
      title: '电话',
      dataIndex: 'Phone',
      ellipsis: true,
    },
    {
      title: '微信',
      dataIndex: 'WeChat',
      ellipsis: true,
    },
    {
      title: '来源',
      dataIndex: 'Source',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <Button
          type="link"
          key="editable"
          onClick={() => {
            record.AddressIds = JSON.parse(record.AddressIds);

            form.setFieldsValue(record);
            setModalVisit(true);
            setModalTitle('编辑顾客');
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="删除后将无法恢复"
          onConfirm={async () => {
            await delCustomer({
              CustomerID: record.CustomerID,
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
    <PageContainer ghost title={false}>
      <div>
        <ProTable
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async () => {
            return await getCustomers({
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
                <Button type="primary">
                  <PlusOutlined />
                  添加顾客
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
                values.AddressIds = JSON.stringify(values.AddressIds || []);
                values.userId = JSON.parse(
                  localStorage.getItem('user') || '{}',
                ).user_id;
                await createCustomer(values);
                message.success('提交成功');
                actionRef.current!.reload();
                return true;
              }}
            >
              <ProFormText name="CustomerID" label="顾客ID" hidden={true} />
              <ProFormText name="Name" label="名称" />
              <ProFormText name="Phone" label="电话号码" />
              <ProFormText name="WeChat" label="微信" />
              <ProFormSelect
                name="Source"
                label="来源"
                valueEnum={{
                  xianyu: '闲鱼',
                }}
              />
              <ProFormSelect
                name="AddressIds"
                label="地址"
                request={async () => {
                  const res = await getCustomerAddresss({
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
                  return data;
                }}
                fieldProps={{
                  mode: 'multiple',
                }}
              />
            </ModalForm>,
            <ModalForm<{
              name: string;
              company: string;
            }>
              key="addAddress"
              title="添加地址"
              trigger={
                <Button type="primary">
                  <PlusOutlined />
                  添加地址
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
                values.locationAddress = JSON.stringify(values.locationAddress);
                await createCustomerAddress(values);
                message.success('提交成功');
                actionRef.current!.reload();
                return true;
              }}
            >
              <ProFormText
                name="fullName"
                label="收货人姓名"
                rules={[{ required: true, message: '请填写收货人姓名!' }]}
              />
              <ProFormText
                name="phoneNumber"
                label="联系电话"
                rules={[{ required: true, message: '请填写联系电话!' }]}
              />
              <Form.Item
                name="locationAddress"
                label="省市区"
                rules={[{ required: true, message: '请选择省市区!' }]}
              >
                <Cascader options={LOCATION} />
              </Form.Item>
              <ProFormText
                name="streetAddress"
                label="街道地址"
                rules={[{ required: true, message: '请填写街道地址!' }]}
              />
            </ModalForm>,
          ]}
        />
      </div>
    </PageContainer>
  );
};
