import { createProduct, delProduct, getProducts } from '@/services/product';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增商品');

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
      title: '商品名称',
      dataIndex: 'ProductName',
    },
    {
      title: '商品描述',
      dataIndex: 'Description',
      ellipsis: true,
    },
    {
      title: '参考价格',
      dataIndex: 'UnitPrice',
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
            form.setFieldsValue(record);
            setModalVisit(true);
            setModalTitle('编辑商品');
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="删除后将无法恢复"
          onConfirm={async () => {
            await delProduct({
              ProductID: record.ProductID,
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
          request={async (params) => {
            const { data } = await getProducts({
              ...params,
              userId: JSON.parse(localStorage.getItem('user') || '{}').user_id,
            });
            return data;
          }}
          rowKey="id"
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          search={false}
          pagination={{
            pageSize: 10,
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
                  onClick={() => setModalTitle('新增商品')}
                >
                  <PlusOutlined />
                  新增商品
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
                await createProduct(values);
                message.success('提交成功');
                actionRef.current!.reload();
                return true;
              }}
            >
              <ProFormText name="ProductID" label="商品ID" hidden={true} />
              <ProFormText
                name="ProductName"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称!' }]}
              />
              <ProFormTextArea
                name="Description"
                label="商品描述"
                placeholder="请输入商品描述"
              />
              <ProFormDigit label="参考价格" name="UnitPrice" min={0} />
            </ModalForm>,
          ]}
        />
      </div>
    </PageContainer>
  );
};
