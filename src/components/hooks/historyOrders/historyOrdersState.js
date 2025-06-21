import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

export const HistoryOrdersState = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const pageSize = 10;
  const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
  const key = CryptoJS.enc.Base64.parse(base64Key);

  // Функция дешифровки поля
  const decryptField = (encryptedValue) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedValue, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Ошибка при расшифровке:", e);
      return "Ошибка расшифровки";
    }
  };

  // Функция дешифровки заказа
  const decryptOrder = (order) => {
    const decryptedOrder = { ...order };

    if (order.clientFrom) {
      decryptedOrder.clientFrom = {
        ...order.clientFrom,
        first_name: decryptField(order.clientFrom.first_name),
        last_name: decryptField(order.clientFrom.last_name),
      };
    }

    if (order.employeeTo) {
      decryptedOrder.employeeTo = {
        ...order.employeeTo,
        first_name: decryptField(order.employeeTo.first_name),
        last_name: decryptField(order.employeeTo.last_name),
      };
    }

    return decryptedOrder;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.salon-era.ru/records/all?page=${page}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const decryptedData = data.records
          ? data.records.map(decryptOrder)
          : data.map(decryptOrder);

        decryptedData.sort(
          (a, b) =>
            new Date(b.record.date_record) - new Date(a.record.date_record)
        );

        setOrders(decryptedData);

        if (data.totalPages) {
          setTotalPages(data.totalPages);
          setHasNextPage(page < data.totalPages);
        } else {
          setHasNextPage(decryptedData.length === pageSize);
          setTotalPages(1); // Если totalPages нет, оставляем 1
        }
      } catch (error) {
        setError(error.message);
        setOrders([]);
        setHasNextPage(false);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // Переход на следующую страницу
  const nextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  // Переход на предыдущую страницу
  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Переход на конкретную страницу
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  // Форматирование даты в удобочитаемый вид
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleString("ru-RU", options);
  };

  // Фильтрация заказов по выбранной дате (если она есть)
  const filteredOrders =
    selectedDate && selectedDate instanceof Date
      ? orders.filter((order) => {
          const orderDate = new Date(order.record.date_record);
          return orderDate.toDateString() === selectedDate.toDateString();
        })
      : orders;

  // Подсчет общей суммы по фильтрованным заказам, кроме со статусом 400
  const calculateTotal = () => {
    return filteredOrders
      .filter((o) => o.record?.status !== 400)
      .reduce((acc, curr) => acc + (curr.record?.price || 0), 0);
  };

  return {
    orders: filteredOrders,
    loading,
    error,
    total: calculateTotal(),
    selectedDate,
    setSelectedDate,
    formatDate,
    nextPage,
    prevPage,
    goToPage,
    currentPage: page,
    totalPages,
    hasNextPage,
  };
};
