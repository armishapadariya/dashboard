import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Form, Input, Button, Typography, Row, Col, message } from 'antd';

const { Title } = Typography;

const Login = () => {
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await login(values.username, values.password);
        } catch (error) {
            message.error(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" align="middle" style={{ height: '100vh' }}>
            <Col span={8}>
                <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
                <Form onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default Login;
