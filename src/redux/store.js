import { configureStore } from '@reduxjs/toolkit';
import { templateReducer, localStorageMiddleware } from './slice/templateSlice';

const store = configureStore({
  reducer: {
    template: templateReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;