import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RecordList from "./recordList/RecordList";
import { HistoryOrdersState } from "../../hooks/historyOrders/historyOrdersState";
import GenericSkeleton from "../../../utils/Skeleton";
import styles from "./historyOrders.module.scss";
import CustomButton from "../../customButton/CustomButton";

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
    fetchData,
  } = HistoryOrdersState();

  const handleLoadClick = () => {
    fetchData();
  };

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
      
      <div className={styles.datePickerWrapper}>
        <div className={styles["get-orders_block"]}>
          <DatePicker
            className={styles.dataPicker}
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd MMM yyyy"
            placeholderText="Выберите дату"
            isClearable
            locale="ru"
          />
          <CustomButton
            className={styles["get-orders"]}
            label="Загрузить заказы"
            onClick={handleLoadClick}
          />
        </div>

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
        loading={loading}
      />
    </div>
  );
};

export default HistoryOrders;
