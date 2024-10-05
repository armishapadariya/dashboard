import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Input,
    Table,
    Pagination,
    Checkbox,
    Button,
    Modal,
    Form,
    message,
    Popconfirm,
} from "antd";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async (limit = 10, skip = 0) => {
        try {
            const response = await axios.get(
                `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
            );
            setProducts(response.data.products);
            setTotalProducts(response.data.total);
        } catch (error) {
            message.error("Failed to fetch products. Please try again.");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                "https://dummyjson.com/products/category-list"
            );
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            message.error("Failed to fetch categories. Please try again.");
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setCurrentPage(1);
        await fetchFilteredProducts(query, selectedCategories);
    };

    const handleCategoryChange = async (checkedValues) => {
        setSelectedCategories(checkedValues);
        setCurrentPage(1);
        await fetchFilteredProducts(searchQuery, checkedValues);
    };

    const fetchFilteredProducts = async (query, categories) => {
        try {
            let url = `https://dummyjson.com/products`;
            if (categories.length === 1) {
                url += `/category/${categories[0]}`;
            } else if (categories.length > 1) {
                const categoryParams = categories.join(",");
                url += `?category=${categoryParams}`;
            }
            if (query) {
                url += `/search${url.includes("?") ? "&" : "?"}q=${query}`;
            }
            const response = await axios.get(url);
            setProducts(response.data.products);
            setTotalProducts(response.data.total);
        } catch (error) {
            message.error("Failed to filter products. Please try again.");
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProducts(10, (page - 1) * 10);
    };

    const showModal = (product) => {
        setCurrentProduct(product);
        form.resetFields();
        if (product) {
            form.setFieldsValue(product);
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (currentProduct) {
                const response = await axios.put(
                    `https://dummyjson.com/products/${currentProduct.id}`,
                    values
                );
                message.success("Product updated successfully.");
                setProducts(
                    products.map((product) =>
                        product.id === currentProduct.id
                            ? { ...product, ...response.data }
                            : product
                    )
                );
            } else {
                const response = await axios.post(
                    "https://dummyjson.com/products/add",
                    values
                );
                setProducts([response.data, ...products]);
                message.success("Product added successfully.");
            }
            setIsModalVisible(false);
        } catch (error) {
            message.error("Failed to save product. Please check your input.");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `https://dummyjson.com/products/${id}`
            );
            if (response.status === 200) {
                message.success("Product deleted successfully.");
                setProducts(products.filter((product) => product.id !== id));
            }
        } catch (error) {
            message.error("Failed to delete product. Please try again.");
        }
    };

    return (
        <div>
            <Input
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products"
                style={{ marginBottom: "20px" }}
                maxLength={10}
            />

            <Checkbox.Group
                options={categories}
                onChange={handleCategoryChange}
                style={{ marginBottom: "20px" }}
            />

            <Button type="primary" onClick={() => showModal(null)}>
                Add Product
            </Button>

            <Table
                dataSource={products}
                columns={[
                    {
                        title: "Product Name",
                        dataIndex: "title",
                        key: "title",
                    },
                    {
                        title: "Price",
                        dataIndex: "price",
                        key: "price",
                        render: (text) => `$${text}`,
                    },
                    {
                        title: "Action",
                        key: "action",
                        render: (text, record) => (
                            <div
                                style={{
                                    alignSelf: "flex-end",
                                    justifyContent: "space-evenly",
                                }}
                            >
                                <Button
                                    onClick={() => showModal(record)}
                                    style={{ marginRight: "8px" }}
                                >
                                    Edit
                                </Button>
                                <Popconfirm
                                    title="Are you sure you want to delete this product?"
                                    onConfirm={() => handleDelete(record.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger>Delete</Button>
                                </Popconfirm>
                            </div>
                        ),
                    },
                ]}
                rowKey="id"
                pagination={false}
            />

            <Pagination
                current={currentPage}
                pageSize={10}
                total={totalProducts}
                onChange={handlePageChange}
                style={{ marginTop: "20px" }}
            />

            <Modal
                title={currentProduct ? "Edit Product" : "Add Product"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Product Name"
                        rules={[
                            { required: true, message: "Please input the product name!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            { required: true, message: "Please input the product price!" },
                            {
                                validator: (_, value) =>
                                    value >= 0
                                        ? Promise.resolve()
                                        : Promise.reject("Price must be a positive number"),
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Products;
