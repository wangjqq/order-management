import { baseURL } from '@/services';
import {
  addFileTree,
  delFolder,
  deleteFile,
  getFileTree,
  getFiles,
  upload,
} from '@/services/file';
import { formatBytes } from '@/utils/format';
import {
  EllipsisOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  Tree,
  Upload,
  UploadFile,
  message,
} from 'antd';
import { DirectoryTreeProps } from 'antd/es/tree';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';

const { DirectoryTree } = Tree;

const File = () => {
  const user_id: string = useMemo(
    () => JSON.parse(localStorage.getItem('user') || '{}').user_id.toString(),
    [],
  );
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([user_id]);
  const [dirId, setDirId] = useState<React.Key>(user_id);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [modalVisit, setModalVisit] = useState(false);
  const [modalTitle, setModalTitle] = useState('新建文件夹');
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{ name: string; company: string }>();

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
      title: '文件名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '文件类型',
      dataIndex: 'mimeType',
      ellipsis: true,
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      ellipsis: true,
      render(dom, entity) {
        return <span>{formatBytes(entity.size)}</span>;
      },
    },
    {
      title: '上传时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (value, entity) => [
        <Button
          key="download"
          type="link"
          onClick={() => {
            window.open(
              `${baseURL}/file/download?path=${entity.path}&filename=${entity.name}
          `,
            );
          }}
        >
          下载
        </Button>,
        <Button
          key="delete"
          type="link"
          onClick={async () => {
            await deleteFile({ id: entity.id, filePath: entity.path });
            message.success('删除成功');
            actionRef.current?.reload();
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  const getTree = async () => {
    const tree = await getFileTree({
      userId: JSON.parse(
        localStorage.getItem('user') || '{}',
      ).user_id.toString(),
    });

    setTreeData(tree.data);
  };
  useEffect(() => {
    getTree();
  }, []);

  const onSelect: DirectoryTreeProps['onSelect'] = (keys) => {
    setDirId(keys[0]);
    actionRef.current?.reload();
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys) => {
    setExpandedKeys(keys);
  };

  const customRequest = async ({
    file,
    onSuccess,
    onError,
    onProgress,
  }: any) => {
    console.log(file);
    // 构造 FormData 对象，用于传递文件和额外参数
    setFileList([
      { name: '上传中', percent: 0, status: 'uploading', uid: file.uid },
    ]);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    // 添加额外参数
    formData.append('userId', user_id);
    formData.append('dirId', dirId as string);
    upload(formData, (progressEvent: any) => {
      console.log(progressEvent);
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      setFileList((prevList) => {
        if (prevList[0]) {
          prevList[0].percent = percentCompleted;
        }
        return prevList;
      });
      onProgress({ percent: percentCompleted }, file);
    })
      .then((result) => {
        setFileList((prevList) => {
          if (prevList[0]) {
            prevList[0].percent = 100;
            prevList[0].name = '上传完成';
            prevList[0].status = 'done';
          }
          return prevList;
        });
        onSuccess(result, file);
        actionRef.current?.reload();
      })
      .catch((error) => {
        // 处理上传失败的逻辑
        setFileList((prevList) => {
          if (prevList[0]) {
            prevList[0].percent = 0;
            prevList[0].name = '上传异常,请核对文件列表';
            prevList[0].status = 'error';
          }
          return prevList;
        });
        onError(error, file);
      });
  };
  const onRemove = () => {
    setFileList([]);
  };
  const titleRender = (value: any) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span>{value.name}</span>
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: <span>添加子文件夹</span>,
              },
              {
                key: '2',
                label: <span>重命名</span>,
                disabled: value.id === user_id,
              },
              {
                key: '3',
                label: <span>删除</span>,
                disabled: value.id === user_id,
              },
            ],
            onClick: (e) => {
              e.domEvent.stopPropagation();
              form.resetFields();
              if (e.key === '1') {
                setModalTitle('新建文件夹');
                form.setFieldValue('parentFolderId', value.id);
                setModalVisit(true);
              } else if (e.key === '2') {
                setModalTitle('重命名');
                form.setFieldValue('name', value.name);
                form.setFieldValue('id', value.id);
                setModalVisit(true);
              } else if (e.key === '3') {
                Modal.confirm({
                  title: '确认删除文件夹?',
                  icon: <ExclamationCircleFilled />,
                  content: '无法恢复,将会同时删除其子文件夹和其中的文件',
                  onOk: async () => {
                    await delFolder({
                      id: value.id,
                    });
                    message.success('删除成功');
                    getTree();
                  },
                });
              }
            },
          }}
        >
          <EllipsisOutlined />
        </Dropdown>
      </div>
    );
  };
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      if (modalTitle === '新建文件夹') {
        await addFileTree({
          userId: user_id,
          ...values,
        });
        message.success('添加成功');
      }
      getTree();
      setModalVisit(false);
    });
  };
  return (
    <PageContainer ghost title={false}>
      <div className={styles.container}>
        <DirectoryTree
          className={styles.tree}
          multiple
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          treeData={treeData}
          selectedKeys={[dirId]}
          fieldNames={{ title: 'name', key: 'id' }}
          titleRender={titleRender}
        />
        <ProTable
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async () => {
            return await getFiles({
              userId: user_id,
              dirId,
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
            pageSize: 10,
            onChange: (page) => console.log(page),
          }}
          toolBarRender={() => [
            <Upload
              multiple
              customRequest={customRequest}
              fileList={fileList}
              onRemove={onRemove}
              key="upload"
            >
              <Button icon={<UploadOutlined />}>在此目录上传文件</Button>
            </Upload>,
          ]}
        />
      </div>
      <Modal
        title={modalTitle}
        open={modalVisit}
        onOk={() => handleOk()}
        onCancel={() => setModalVisit(false)}
      >
        <Form form={form}>
          <Form.Item name="folderName" required>
            <Input placeholder="请输入文件夹名" />
          </Form.Item>
          <Form.Item name="id" noStyle>
            <Input style={{ display: 'none' }} />
          </Form.Item>
          <Form.Item name="parentFolderId" noStyle>
            <Input style={{ display: 'none' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default File;
