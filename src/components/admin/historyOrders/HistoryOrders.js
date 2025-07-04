import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RecordList from "./recordList/RecordList";
import { HistoryOrdersState } from "../../hooks/historyOrders/historyOrdersState";
import GenericSkeleton from "../../../utils/Skeleton";
import styles from "./historyOrders.module.scss";

const HistoryOrders = () => {
  const {
    orders,
    loading,
    total,
    selectedDate,
    setSelectedDate,
    formatDate,
    nextPage,
    prevPage,
    goToPage,
    currentPage,
    totalPages,
  } = HistoryOrdersState();

  if (loading) {
    return (
      <GenericSkeleton
        headerCount={1}
        headerWidths={["50%", "30%"]}
        itemCount={10}
        itemWidth="100%"
        itemHeight={50}
      />
    );
  }

  return (
    <div>
      <h1 className={styles["history-orders"]}>История Заказов</h1>
      {orders.length === 0 ? <p className={styles.message}>Заказов нет</p> : ""}
      <div className={styles.datePickerWrapper}>
        <DatePicker
          className={styles.dataPicker}
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd MMM yyyy"
          placeholderText="Выберите дату"
          isClearable
          locale="ru"
        />
        <h2 className={styles.total}>Общая сумма: {total || 0}р.</h2>
      </div>

      <RecordList
        orders={orders}
        formatDate={formatDate}
        nextPage={nextPage}
        prevPage={prevPage}
        goToPage={goToPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default HistoryOrders;
