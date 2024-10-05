import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Layout, Button, Typography, Menu } from 'antd';
import Products from './Products';
const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ backgroundColor: '#001529', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ color: 'white', margin: 0 }}>Welcome, {user?.firstName}</Title>
                <Button type="primary" onClick={logout}>Logout</Button>
            </Header>
            <Layout>
                <Sider width={200} style={{ backgroundColor: '#fff' }}>
                    <Menu mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">Dashboard</Menu.Item>
                    </Menu>
                </Sider>
                <Content style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                        <Products />
                    </div>
                </Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Footer content</Footer>
        </Layout>
    );
};

export default Dashboard;
