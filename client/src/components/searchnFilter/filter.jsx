import { Select, Space } from 'antd';

export const Filter = ({sortCriteria,setSortCriteria}) => {

    const handleChange = (value) => {
        setSortCriteria(value)
        alert(`selected ${value}`);
    };

    return (
        <Space wrap>
            <Select
                defaultValue="none"
                style={{
                    width: 200,
                }}
                onChange={handleChange}
                options={[
                    {
                        value: 'none',
                        label: 'none',
                    },
                    {
                        value: 'name',
                        label: 'name',
                    },
                    {
                        value: '#members',
                        label: '#members',
                    },
                    {
                        value: 'CreationDate',
                        label: 'CreationDate',
                    },
                    
                ]}
            />
        </Space>
    )
}