import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setOrder } from "../../../store/slices/orderSlice";

export const useOrdersState = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [addOrderModal, setAddOrderModal] = useState(false);

  const hasMounted = useRef(false);
  const initialLoadRef = useRef(true);
  const dispatch = useDispatch();
  const notificationSound = useRef(new Audio("/sound.mp3"));

  // Ключ для AES
  const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
  const key = CryptoJS.enc.Base64.parse(base64Key);

  // Функция расшифровки поля
  const decryptField = useCallback(
    (encryptedValue) => {
      if (!encryptedValue) return "";
      try {
        const decrypted = CryptoJS.AES.decrypt(encryptedValue, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      } catch {
        return "Ошибка";
      }
    },
    [key]
  );

  // Форматирование даты
  const formatDate = useCallback((date) => {
    if (!date) return "";
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    const formattedDate = new Date(date).toLocaleDateString(
      "ru-RU",
      dateOptions
    );
    const formattedTime = new Date(date).toLocaleTimeString(
      "ru-RU",
      timeOptions
    );
    return `${formattedDate}, ${formattedTime}`;
  }, []);

  // Группировка заказов по дате
  const groupOrdersByDate = useCallback(
    (ordersList) =>
      ordersList.reduce((acc, order) => {
        if (order.record?.status !== 400 && order.record?.status !== 500) {
          const date = formatDate(order.record?.date_record).split(",")[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(order);
        }
        return acc;
      }, {}),
    [formatDate]
  );

  const groupedOrders = useMemo(
    () => groupOrdersByDate(filteredOrders),
    [filteredOrders, groupOrdersByDate]
  );

  // Фильтрация заказов по дате
  const filterOrdersByDate = useCallback(
    (date, ordersList = orders) => {
      if (!date) {
        setFilteredOrders(
          ordersList.filter(
            (order) =>
              order.record?.status !== 400 && order.record?.status !== 500
          )
        );
      } else {
        const formattedDate = formatDate(date).split(",")[0];
        setFilteredOrders(
          ordersList.filter(
            (order) =>
              formatDate(order.record?.date_record).split(",")[0] ===
                formattedDate &&
              order.record?.status !== 400 &&
              order.record?.status !== 500
          )
        );
      }
    },
    [orders, formatDate]
  );

  // Обновляем фильтр и redux при изменении orders или selectedDate
  useEffect(() => {
    filterOrdersByDate(selectedDate, orders);
    dispatch(setOrder(orders));
  }, [orders, selectedDate, filterOrdersByDate, dispatch]);

  // WebSocket подключение с useRef и экспоненциальным переподключением
  useEffect(() => {
    const socketRef = { current: null };
    let reconnectTimeout = null;
    let reconnectAttempts = 0;

    const connect = () => {
      socketRef.current = new WebSocket(
        "wss://api.salon-era.ru/websocket/records"
      );

      socketRef.current.onopen = () => {
        reconnectAttempts = 0;
        setError(null);
        setLoading(false);
        console.log("WebSocket подключен");
      };

      socketRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          const ordersArray = Array.isArray(data) ? data : [data];

          const decryptedOrders = await Promise.all(
            ordersArray.map(async (order) => {
              if (order.clientFrom?.firstName && order.employeeTo?.firstName) {
                return {
                  ...order,
                  clientFrom: {
                    ...order.clientFrom,
                    firstName: decryptField(order.clientFrom.firstName),
                    lastName: decryptField(order.clientFrom.lastName),
                  },
                  employeeTo: {
                    ...order.employeeTo,
                    firstName: decryptField(order.employeeTo.firstName),
                    lastName: decryptField(order.employeeTo.lastName),
                  },
                };
              }
              return order;
            })
          );

          const validOrders = decryptedOrders.filter(
            (order) => order && order.record?.id !== undefined
          );

          setOrders((prevOrders) => {
            const newOrders = validOrders.filter(
              (newOrder) =>
                !prevOrders.some((o) => o.record?.id === newOrder.record?.id)
            );
            if (newOrders.length === 0) return prevOrders;

            if (hasMounted.current && !initialLoadRef.current) {
              newOrders.forEach((newOrder) => {
                toast.info(
                  `Новый заказ от ${
                    newOrder.clientFrom?.firstName || "Клиент"
                  } ${newOrder.clientFrom?.lastName || ""}`
                );
                notificationSound.current.play().catch(() => {});
              });
            }

            return [...prevOrders, ...newOrders];
          });

          if (initialLoadRef.current) {
            initialLoadRef.current = false;
            sessionStorage.setItem("ordersInitialLoad", "done");
          }
          hasMounted.current = true;
        } catch (e) {
          setError("Ошибка обработки данных WebSocket");
          console.error(e);
        }
      };

      socketRef.current.onerror = (err) => {
        console.error("WebSocket ошибка:", err);
        setError("Ошибка WebSocket");
      };

      socketRef.current.onclose = () => {
        reconnectAttempts++;
        const timeout = Math.min(30000, 5000 * 2 ** reconnectAttempts); // max 30 сек
        console.log(
          `WebSocket закрыт, переподключение через ${timeout / 1000} секунд`
        );
        reconnectTimeout = setTimeout(connect, timeout);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING)
      ) {
        socketRef.current.close(1000, "Компонент размонтирован");
      }
    };
  }, [decryptField, dispatch]);

  // Обновляем фильтр при изменении выбранной даты
  useEffect(() => {
    filterOrdersByDate(selectedDate);
  }, [selectedDate, filterOrdersByDate]);

  const toggleOpen = () => {
    setAddOrderModal(true);
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    if (!addOrderModal) {
      document.body.style.overflow = "";
    }
  }, [addOrderModal]);

  return {
    orders,
    filteredOrders,
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
    groupedOrders,
    setOrders,
  };
};
