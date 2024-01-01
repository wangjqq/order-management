import { createProduct, getProducts } from '@/services/product';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useRef } from 'react';

const columns: ProColumns[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
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
  return (
    <PageContainer ghost>
      <div>
        <ProTable
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async () => {
            return await getProducts({
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
              title="新增商品"
              trigger={
                <Button type="primary">
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
