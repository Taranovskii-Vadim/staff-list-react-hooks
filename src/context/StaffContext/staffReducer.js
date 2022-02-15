export const GET_STAFF = "staffReducer/GET_STAFF";
export const SET_IS_LOADING = "staffReducer/SET_ISLOADING";
export const SEARCH_USERS = "staffReducer/SEARCH_USERS";
export const SET_IS_SEARCH_LOADING = "staffReducer/SET_IS_SEARCH_LOADING";

const handlers = {
  [GET_STAFF]: (state, { payload }) => ({
    ...state,
    data: [...payload.data],
    columns: state.columns.map(column => {
      if (column.filters) {
        column.filters = [...payload.filters[column.dataIndex]];
      }
      return column;
    }),
  }),
  [SEARCH_USERS]: (state, { payload }) => ({ ...state, data: [...payload] }),
  [SET_IS_LOADING]: state => ({ ...state, isLoading: !state.isLoading }),
  [SET_IS_SEARCH_LOADING]: state => ({
    ...state,
    isSearchLoading: !state.isSearchLoading,
  }),
  DEFAULT: state => state,
};

export default function staffReducer(state, action) {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
}
