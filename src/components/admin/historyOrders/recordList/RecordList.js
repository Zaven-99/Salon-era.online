import React from "react";
import CustomButton from "../../../customButton/CustomButton";

import styles from "./recordList.module.scss";

const RecordList = ({
  orders,
  formatDate,
  nextPage,
  prevPage,
  goToPage,
  currentPage,
}) => {
  return (
    <div>
      <ul className={styles["record-list"]}>
        {orders.map((order) => (
          <li key={order.record.id} className={styles["record-item"]}>
            <div className={styles["record-item__inner"]}>
              <strong>Клиент:</strong>
              <div>
                {order.clientFrom
                  ? `${order.clientFrom.first_name} ${order.clientFrom.last_name}`
                  : "Неизвестный клиент"}
              </div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Парикмахер:</strong>
              <div>
                {order.employeeTo
                  ? `${order.employeeTo.first_name} ${order.employeeTo.last_name}`
                  : "Неизвестный парикмахер"}
              </div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Услуга:</strong>
              <div>{order.service?.name || "Неизвестная услуга"}</div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Описание:</strong>
              <div>{order.service?.description || "Нет описания"}</div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Цена:</strong>
              <div>
                {order.record?.price
                  ? `${order.record.price}р.`
                  : order.service?.priceLow
                  ? `${order.service.priceLow}р.`
                  : "цена недоступна"}
              </div>
            </div>

            <div className={styles["record-item__inner"]}>
              <strong>Дата:</strong>
              <div>{formatDate(order.record.date_record)}</div>
            </div>

            <div className={styles.wrapper}>
              <strong>Статус:</strong>
              {order.record.status === 500 ? (
                <div className={styles["order-closed"]}>Заказ закрыт</div>
              ) : order.record.status === 400 ? (
                <div className={styles["order-canceled"]}>Заказ отменен</div>
              ) : order.record.status === 0 ? (
                <div className={styles["order-created"]}>Заказ создан</div>
              ) : order.record.status === 100 ? (
                <div className={styles["order-accept"]}>Заказ принят</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.pagination}>
        <CustomButton
          label="В начало"
          className={styles["pagination-btn"]}
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        />
        <CustomButton
          label="Предыдущая"
          className={styles["pagination-btn"]}
          onClick={prevPage}
          disabled={currentPage === 1}
        />

        <CustomButton
          label={currentPage}
          className={`${styles["pagination-btn"]} ${
            currentPage ? styles["active"] : ""
          }`}
        />
        <CustomButton
          label="Следующая"
          className={styles["pagination-btn"]}
          onClick={nextPage}
          disabled={orders.length < 10}
        />
      </div>
    </div>
  );
};

export default RecordList;


 