import React, { useContext, useEffect } from "react";
import { Table } from "antd";
import { StaffContext } from "./context/StaffContext";
import Search from "antd/lib/input/Search";

const App = () => {
  const context = useContext(StaffContext);
  useEffect(() => {
    context.getStaff(true);
  }, []);
  return (
    <div className='container'>
      <Search
        className='search'
        placeholder='Поиск'
        onSearch={(v, e) => context.searchUsers(v)}
        loading={context.isSearchLoading}
      />
      <Table
        columns={context.columns}
        dataSource={context.data}
        loading={context.isLoading}
      />
    </div>
  );
};

export default App;
