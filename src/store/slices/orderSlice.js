import { createSlice } from "@reduxjs/toolkit";

// Безопасная загрузка из localStorage
function loadFromLocalStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

const initialState = {
  orders: loadFromLocalStorage("orders", []),
  orderNumber: parseInt(localStorage.getItem("orderNumber") || "1", 10),
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    saveOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        number: state.orderNumber,
      };
      state.orders.push(newOrder);
      state.orderNumber += 1;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.orderNumber = 1;
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.record.id !== action.payload
      );
    },
    setOrder: (state, action) => {
      const incoming = action.payload;
      const updatedMap = new Map(
        state.orders
          .filter((o) => o.record && o.record.id !== undefined)
          .map((o) => [o.record.id, o])
      );

      incoming.forEach((order) => {
        if (order.record && order.record.id !== undefined) {
          updatedMap.set(order.record.id, order);
        }
      });

      state.orders = Array.from(updatedMap.values());
    },
  },
});

export const { saveOrder, clearOrders, removeOrder, setOrder } =
  orderSlice.actions;
export default orderSlice.reducer;



 