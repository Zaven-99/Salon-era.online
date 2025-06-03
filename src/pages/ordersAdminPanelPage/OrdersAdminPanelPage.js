import React from "react";
import Orders from "../../components/admin/orders/Orders";
const OrdersAdminPanelPage = ({
  filteredOrders,
  setOrders,
  error,
  loading,
  selectedDate,
  setSelectedDate,
  addOrderModal,
  setAddOrderModal,
  toggleOpen,
  filterOrdersByDate,
  formatDate,
  setError,
}) => {
  return (
    <div>
      <Orders
        filteredOrders={filteredOrders}
        setOrders={setOrders}
        error={error}
        loading={loading}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        addOrderModal={addOrderModal}
        setAddOrderModal={setAddOrderModal}
        toggleOpen={toggleOpen}
        filterOrdersByDate={filterOrdersByDate}
        formatDate={formatDate}
        setError={setError}
      />
    </div>
  );
};

export default OrdersAdminPanelPage;
