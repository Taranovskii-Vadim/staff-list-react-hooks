import React, { useReducer } from "react";
import { StaffContext } from ".";
import staffReducer, {
  GET_STAFF,
  SET_IS_LOADING,
  SEARCH_USERS,
  SET_IS_SEARCH_LOADING,
} from "./staffReducer";
import { Tag } from "antd";

const alphabetSort = field => {
  return (a, b) => {
    if (a[field] > b[field]) {
      return 1;
    }
    if (a[field] < b[field]) {
      return -1;
    }
    return 0;
  };
};

const filterField = field => (value, record) =>
  record[field].indexOf(value) === 0;

const filterSkills = field => (value, record) => record[field].includes(value);

const defineTagColor = skill => {
  const colors = {
    React: "blue",
    Angular: "red",
    SharePoint: "green",
    RxJs: "magenta",
    DEFAULT: "",
  };
  return colors[skill] || colors.DEFAULT;
};

const setTags = () => {
  return skills => (
    <>
      {skills.map(skill => (
        <Tag color={defineTagColor(skill)} key={skill}>
          {skill}
        </Tag>
      ))}
    </>
  );
};

const StaffState = ({ children }) => {
  const initialState = {
    data: [],
    columns: [
      {
        title: "Город",
        dataIndex: "city",
        key: "city",
        filters: [],
        sorter: alphabetSort("city"),
        onFilter: filterField("city"),
      },
      {
        title: "ФИО",
        dataIndex: "fullname",
        key: "fullname",
        sorter: alphabetSort("fullname"),
      },
      {
        title: "E-mail",
        dataIndex: "email",
        key: "email",
        sorter: alphabetSort("email"),
      },
      {
        title: "Тип занятости",
        dataIndex: "type",
        key: "type",
        filters: [],
        sorter: alphabetSort("type"),
        onFilter: filterField("type"),
      },
      {
        title: "Skills1",
        dataIndex: "skills1",
        key: "skills1",
        filters: [],
        onFilter: filterSkills("skills1"),
        render: setTags(),
      },
      {
        title: "Skills2",
        dataIndex: "skills2",
        key: "skills2",
        filters: [],
        onFilter: filterSkills("skills2"),
        render: setTags(),
      },
    ],
    isLoading: false,
    isSearchLoading: false,
  };

  const [state, dispatch] = useReducer(staffReducer, initialState);

  const isExist = (arr, filter) => {
    let flag = false;
    arr.forEach(item => {
      if (item.text === filter) {
        flag = true;
        return;
      }
    });
    return flag;
  };

  const getFilters = staff => {
    let filters = {};
    Object.keys(staff[0]).forEach(key => {
      if (
        key === "city" ||
        key === "type" ||
        key === "skills1" ||
        key === "skills2"
      ) {
        filters[key] = [];
      }
    });
    filters = staff.reduce((total, item) => {
      for (let key of Object.keys(item)) {
        if (key === "city" || key === "type") {
          if (!isExist(total[key], item[key])) {
            const filter = { text: item[key], value: item[key] };
            total[key].push(filter);
          }
        }
        if (key === "skills1" || key === "skills2") {
          item[key].forEach(elem => {
            if (!isExist(total[key], elem)) {
              const filter = { text: elem, value: elem };
              total[key].push(filter);
            }
          });
        }
      }
      return total;
    }, filters);
    return filters;
  };

  const getStaff = async isFirstReq => {
    dispatch({ type: SET_IS_LOADING });
    const data = await new Promise(resolve => {
      const answer = [
        {
          key: "1",
          city: "Москва",
          fullname: "Потапов Михаил Сергеевич",
          email: "MSPotapov@greenatom.ru",
          type: "Стажер",
          skills1: ["React", "SharePoint", "RxJs"],
          skills2: ["C++"],
        },
        {
          key: "2",
          city: "Димитровград",
          fullname: "Тарановский Вадим Геннадьевич",
          email: "VGTaranovsky@greenatom.ru",
          type: "Стажер",
          skills1: ["React", "SharePoint"],
          skills2: ["C#"],
        },
        {
          key: "3",
          city: "Димитровград",
          fullname: "Бегунков Михаил Сергеевич",
          email: "MSBekonkov@greenatom.ru",
          type: "Руководитель группы",
          skills1: ["Angular", "SharePoint"],
          skills2: ["Java"],
        },
      ];
      setTimeout(() => resolve(answer), 1000);
    });

    if (isFirstReq) {
      const filters = getFilters(data);
      const payload = { data, filters };
      dispatch({ type: GET_STAFF, payload });
      dispatch({ type: SET_IS_LOADING });
    }
    return data;
  };

  const searchUsers = async searchStr => {
    dispatch({ type: SET_IS_SEARCH_LOADING });
    const data = await getStaff(false);
    searchStr = searchStr.toLowerCase();
    const filteredData = data.filter(staff => {
      for (let key of Object.keys(staff)) {
        if (Array.isArray(staff[key])) {
          for (let skill of staff[key]) {
            if (skill.toLowerCase() === searchStr) {
              return true;
            }
          }
        } else {
          if (staff[key].toLowerCase().includes(searchStr)) {
            return true;
          }
        }
      }
    });

    dispatch({ type: SEARCH_USERS, payload: filteredData });
    dispatch({ type: SET_IS_SEARCH_LOADING });
    dispatch({ type: SET_IS_LOADING });
  };

  return (
    <StaffContext.Provider
      value={{
        columns: state.columns,
        data: state.data,
        isLoading: state.isLoading,
        isSearchLoading: state.isSearchLoading,
        searchUsers,
        getStaff,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export default StaffState;
