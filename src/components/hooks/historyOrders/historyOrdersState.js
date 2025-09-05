import { useState } from "react";
import CryptoJS from "crypto-js";

export const HistoryOrdersState = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 10;
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

  const formatForApi = (date) => {
    if (!(date instanceof Date)) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchData = async (pageToLoad = 1) => {
    if (!selectedDate) {
      setError("Выберите дату");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/records/all/filter?field=date_record&state=ge&value=${formatForApi(
          selectedDate
        )}&page=${pageToLoad}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Получаем общее количество заказов из заголовка
      const totalCountHeader = response.headers.get("Size");
      const total = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
      setTotalCount(total);

      // Рассчитываем количество страниц
      const calculatedTotalPages = Math.ceil(total / pageSize) || 1;
      setTotalPages(calculatedTotalPages);

      // Устанавливаем, есть ли следующая страница
      // Есть, если текущая страница меньше totalPages
      setHasNextPage(pageToLoad < calculatedTotalPages);

      const data = await response.json();

      const decryptedData = data.records
        ? data.records.map(decryptOrder)
        : data.map(decryptOrder);

      decryptedData.sort(
        (a, b) =>
          new Date(b.record.date_record) - new Date(a.record.date_record)
      );

      setOrders(decryptedData);
      setPage(pageToLoad);
    } catch (error) {
      setError(error.message);
      setOrders([]);
      setHasNextPage(false);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      fetchData(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      fetchData(page - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchData(pageNumber);
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

  const calculateTotal = () => {
    return orders
      .filter((o) => o.record?.status !== 400)
      .reduce((acc, curr) => acc + (curr.record?.price || 0), 0);
  };

  return {
    orders,
    loading,
    error,
    total: calculateTotal(),
    totalCount,
    selectedDate,
    setSelectedDate,
    formatDate,
    nextPage,
    prevPage,
    goToPage,
    currentPage: page,
    totalPages,
    hasNextPage,
    fetchData,
  };
};
