import {
  DownOutlined,
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { RequestConfig, RunTimeLayoutConfig } from './.umi/exports';
import { checkUser } from './services/user';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <span
        onClick={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          history.push('/login');
        }}
      >
        退出登录
      </span>
    ),
  },
];

export const layout: RunTimeLayoutConfig = () => {
  // eslint-disable-next-line
  const [user, setUser] = useState<{ username: string }>();
  // eslint-disable-next-line
  useEffect(() => {
    checkUser()
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return {
    // 常用属性
    title: '管理系统',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menuHeaderRender: undefined,
    layout: 'mix',
    fixSiderbar: true,
    splitMenus: true,
    fixedHeader: true,
    pageTitleRender: undefined,
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      size: 'small',
      title: (
        <Dropdown menu={{ items }}>
          <Space>
            {user ? user.username : '未登录'}
            <DownOutlined />
          </Space>
        </Dropdown>
      ),
    },
    actionsRender: (props) => {
      if (props.isMobile) return [];
      return [
        <InfoCircleFilled key="InfoCircleFilled" />,
        <QuestionCircleFilled key="QuestionCircleFilled" />,
        <GithubFilled key="GithubFilled" />,
      ];
    },
    // footerRender: () => (
    //   <DefaultFooter
    //     links={[
    //       { key: 'test', title: 'layout', href: 'www.alipay.com' },
    //       { key: 'test2', title: 'layout2', href: 'www.alipay.com' },
    //     ]}
    //     copyright="这是一条测试文案"
    //   />
    // ),
  };
};

export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [],
  // 响应拦截器
  responseInterceptors: [],
};
