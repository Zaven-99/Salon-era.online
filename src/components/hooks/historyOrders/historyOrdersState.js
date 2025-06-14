 import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

export const HistoryOrdersState = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
  const key = CryptoJS.enc.Base64.parse(base64Key);

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
        console.log(data);
        // Если API возвращает структуру с данными и количеством страниц
        // например { records: [...], totalPages: n }
        // подстрой под свой API

        const decryptedData = data.records
          ? data.records.map(decryptOrder)
          : data.map(decryptOrder);

        decryptedData.sort(
          (a, b) =>
            new Date(b.record.date_record) - new Date(a.record.date_record)
        );

        setOrders(decryptedData);

        // Если API возвращает totalPages
        if (data.totalPages) {
          setTotalPages(data.totalPages);
        } else {
          // Если нет, вычисляем вручную на основе общего кол-ва и размера страницы
          // например: setTotalPages(Math.ceil(data.totalCount / pageSize))
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);
  

  const nextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

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

  const filteredOrders =
    selectedDate && selectedDate instanceof Date
      ? orders.filter((order) => {
          const orderDate = new Date(order.record.date_record);
          return orderDate.toDateString() === selectedDate.toDateString();
        })
      : orders;

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
  };
};
