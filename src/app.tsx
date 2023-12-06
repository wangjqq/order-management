import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';

export const layout: RunTimeLayoutConfig = (initialState) => {
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
        <div
          style={{
            color: '#dfdfdf',
          }}
        >
          顾渊
        </div>
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
    footerRender: () => (
      <DefaultFooter
        links={[
          { key: 'test', title: 'layout', href: 'www.alipay.com' },
          { key: 'test2', title: 'layout2', href: 'www.alipay.com' },
        ]}
        copyright="这是一条测试文案"
      />
    ),
  };
};

export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [],
  responseInterceptors: [],
};
