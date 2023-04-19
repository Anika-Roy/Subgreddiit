import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import React, { useState } from 'react';

export const SearchBar = ({query, setQuery}) => {

    const [loading, setLoading] = useState(true);
    const { Search } = Input;
    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );
    const onSearch = (value) => {
        setQuery(value)
        console.log("query: ",query)
    }

    return (
        <Space direction="vertical">
            
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
            />
        </Space>
    )
}