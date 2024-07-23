import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Table, DatePicker } from 'antd';
import Layout from "./../components/layout/Layout";
import Spinner from "../components/Spinner";
import Analytics from "../components/Analytics";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';
const { RangePicker } = DatePicker;
import moment from 'moment'

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alltransaction, setAllTransaction] = useState([])
    const [frequency, setFrequency] = useState("7")
    const [selectedDate, setSelectdate] = useState([])
    const [type, setType] = useState('all')
    const [viewData,setViewData]=useState('table')
    const [editable,setEdittable]=useState(null)


    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Reference',
            dataIndex: 'reference',
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Actions',
            render:(text,record)=>(
                <div>
                    <EditOutlined onClick={()=>{
                    setEdittable(record)
                    setShowModal(true)
                }}/>
                    <DeleteOutlined className="mx-2" onClick={()=>{
                       handleDelete(record)
                    }}/>
                </div>
            )
        },


    ]

    const handleDelete=async(record)=>{
        try{
            setLoading(true);
            await axios.put('/api/v1/transactions/delete-transaction', {transactionid:record._id})
            setLoading(false);
            message.success("Transaction deleted Successfully")
            window.location.reload();
        }
        catch(error){
            setLoading(false);
            console.log(error)
            message.error('unable to delete')
        }
    }
    const getAllTransactions = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            setLoading(true)
            const res = await axios.post('/api/v1/transactions/get-transaction', { userid: user._id, frequency, selectedDate, type });
            setLoading(false)
            setAllTransaction(res.data)
        } catch (error) {
            console.log(error)
            message.error("Fetch issue with Transaction ")
        }
    }

    useEffect(() => {
        getAllTransactions()
    }, [frequency, selectedDate, type]);

    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            setLoading(true);
            if (editable) {
                await axios.put('/api/v1/transactions/edit-transaction', {
                    transactionid: editable._id,
                    payload: {
                        ...values,
                        userid: user._id
                    }
                });
                window.location.reload();
                message.success("Transaction Updated Successfully");
            } else {
                await axios.post('/api/v1/transactions/add-transaction', { ...values, userid: user._id });
                message.success('Transaction added');
                window.location.reload();
            }
            setShowModal(false);
            setEdittable(null);
            getAllTransactions();
        } catch (error) {
            setLoading(false);
            console.error('Failed to process transaction', error);
            message.error('Failed to process transaction');
        }
    };
    
    return (
        <Layout>
            {loading && <Spinner></Spinner>}
            <div className="filters">
                <div>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">Last Week</Select.Option>
                        <Select.Option value="30">Last Month</Select.Option>
                        <Select.Option value="365">Last year</Select.Option>
                        <Select.Option value="custom">Custom</Select.Option>
                    </Select>
                    {frequency === "custom" && (
                        <RangePicker value={selectedDate} onChange={(values) => setSelectdate(values)} />
                    )}
                </div>
                <div>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="income">Income</Select.Option>
                        <Select.Option value="expense">Expense</Select.Option>
                    </Select>
                    {frequency === "custom" && (
                        <RangePicker value={selectedDate} onChange={(values) => setSelectdate(values)} />
                    )}
                </div>
                <div className="switch-icon">
                    <UnorderedListOutlined className={`mx-2 ${viewData=== 'table'?'active-icon':'inactive-icon'}`} onClick={()=>setViewData("table")}/>
                    <AreaChartOutlined className={`mx-2 ${viewData=== 'analytics'?'active-icon':'inactive-icon'}`} onClick={()=>setViewData("analytics")}/>
                </div>
                <div>

                    <button className="btn btn-primary"
                        onClick={() => setShowModal(true)}>Add New</button>
                </div>
            </div>
            <div className="content">
            {viewData==='table'?
                <Table columns={columns} dataSource={alltransaction.map(transaction => ({ ...transaction, key: transaction._id }))}></Table>
                : <Analytics alltransaction={alltransaction} />}
            </div>
            <Modal title={editable ? 'Edit Transaction': 'Add Transaction'} open={showModal} onCancel={() => setShowModal(false)} footer={null}>

                <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
                    <Form.Item label="Amount" name="amount">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="type" name="type">
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="Salary">Salary</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="project">Project</Select.Option>
                            <Select.Option value="fee">Fee</Select.Option>
                            <Select.Option value="medical">Medical</Select.Option>
                            <Select.Option value="bills">Bills</Select.Option>
                            <Select.Option value="movie">Movie</Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="tax">Tax</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item label="Reference" name="reference">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input type="text" />
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary" >Add</button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default HomePage;