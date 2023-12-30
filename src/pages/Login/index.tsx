import { login } from '@/services/user';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.module.less';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const doLogin = () => {
    setLoading(false);
    form.validateFields().then((values) => {
      // values.password = bcrypt.hashSync(values.password, 10);
      setLoading(true);
      login(values)
        .then((res) => {
          console.log(res);
          localStorage.setItem('token', res.data.token); // 保存token
          message.success('登录成功');
          setLoading(false);
          history.push('/home');
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${require('@/assets/images/login_bg.png')})`,
      }}
      className={styles['login-container']}
    >
      <div className={styles['login']}>
        <div className={styles['login-title']}>订单管理系统</div>
        <Form form={form} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
            style={{ marginTop: '50px' }}
          >
            <Input
              prefix={
                <UserOutlined style={{ color: '#36b6f6', fontSize: '24px' }} />
              }
              style={{ color: '#36b6f6', width: '100%' }}
              bordered={false}
              placeholder="请输入用户名"
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
            style={{ marginTop: '50px' }}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: '#36b6f6', fontSize: '24px' }} />
              }
              bordered={false}
              placeholder="请输入密码"
              onPressEnter={() => doLogin()}
            />
          </Form.Item>

          <Button
            block
            type="primary"
            loading={loading}
            onClick={() => doLogin()}
            style={{
              background:
                'linear-gradient(to right, #0a03b2, #147cce, #0a03b2)',
              marginTop: '20px',
            }}
          >
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
