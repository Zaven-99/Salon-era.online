import React from "react";

import BtnBlock from "../../../btnBlock/BtnBlock";
import { OrderItemState } from "../../../hooks/orders/OrderItemState";

import styles from "./orderItem.module.scss";
import Spinner from "../../../spinner/Spinner";

const OrderItem = ({
  filteredOrders,
  setOrders,
  setError,
  formatDate,
  groupedOrders,
}) => {
  const {
    durationToText,
    acceptOrder,
    closeOrder,
    cancelOrder,
    editingPriceId,
    setEditingPriceId,
    newPrice,
    setNewPrice,
    updateOrderPrice,
    loading,
  } = OrderItemState({ filteredOrders, setOrders, setError, formatDate });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {Object.keys(groupedOrders).length > 0 ? (
        Object.keys(groupedOrders).map((date) => (
          <div className={styles["order-item"]} key={date}>
            <h2 className={styles.date}>{date}</h2>
            <ul className={styles["record-list"]}>
              {groupedOrders[date].map((order, index) => (
                <li
                  className={styles["record-item"]}
                  key={`${order.record?.id}-${index}`}
                >
                  <div className={styles["record-item__inner"]}>
                    <strong>Клиент:</strong>
                    <div>
                      {order.clientFrom
                        ? `${order.clientFrom?.first_name} ${order.clientFrom?.last_name}`
                        : "Неизвестный клиент"}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Мастер:</strong>
                    <div>
                      {order.employeeTo
                        ? `${order.employeeTo?.first_name} ${order.employeeTo?.last_name}`
                        : "Неизвестный парикмахер"}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Услуга:</strong>
                    <div>
                      {order.service
                        ? order.service?.name
                        : "Неизвестная услуга"}
                    </div>
                  </div>

                  <div className={styles["record-item__inner"]}>
                    <strong>Цена:</strong>
                    <div>
                      {editingPriceId === order.record?.id ? (
                        <div className={styles["price-edit"]}>
                          <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                          />
                          <button
                            onClick={() =>
                              updateOrderPrice(order.record.id, newPrice)
                            }
                          >
                            Сохранить
                          </button>
                        </div>
                      ) : (
                        <span
                          className={styles["price-text"]}
                          onClick={() => {
                            setEditingPriceId(order.record.id);
                            setNewPrice(
                              order.record.price ??
                                order.service?.price_low ??
                                0
                            );
                          }}
                        >
                          {order.record?.price
                            ? `${order.record.price} р.`
                            : order.service?.price_max
                            ? `${order.service?.price_low}–${order.service?.price_max} р.`
                            : `${order.service?.price_low} р.`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Дата:</strong>
                    <div>{formatDate(order.record?.date_record)}</div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Длительность:</strong>
                    <div>{durationToText(order.service?.duration)}</div>
                  </div>
                  <div className={styles["record-item__inner"]}>
                    <strong>Статус:</strong>
                    {order.record?.status === 0 ? (
                      <div className={styles["order-created"]}>
                        Заказ создан
                      </div>
                    ) : (
                      <div className={styles["order-accepted"]}>
                        Заказ принят
                      </div>
                    )}
                  </div>
                  {order.record?.status === 0 ? (
                    <BtnBlock
                      className1={styles["g-btn"]}
                      className2={styles["r-btn"]}
                      className4={styles["btn-block"]}
                      label1="Принять заказ"
                      label2="Отменить заказ"
                      fnc1={() => acceptOrder(order)}
                      fnc2={() => cancelOrder(order)}
                    />
                  ) : (
                    <BtnBlock
                      className1={styles["gr-btn"]}
                      className2={styles["r-btn"]}
                      className4={styles["btn-block"]}
                      label1="Закрыть заказ"
                      label2="Отменить заказ"
                      fnc1={() => closeOrder(order)}
                      fnc2={() => cancelOrder(order)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className={styles.message}>Заказов нет</p>
      )}
    </div>
  );
};

export default OrderItem;
