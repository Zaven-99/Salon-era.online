import { useCallback, useState } from "react";
import { useDispatch } from "react-redux"; // Импортируем useDispatch для отправки экшенов
import { removeOrder } from "../../../store/slices/orderSlice";
import CryptoJS from "crypto-js";

export const OrderItemState = ({ setOrders, setError }) => {
  const dispatch = useDispatch();

  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const getHourText = useCallback((hours) => {
    if (hours === 1) return "час";
    if (hours >= 2 && hours <= 4) return "часа";
    return "часов";
  }, []);

  const durationToText = useCallback(
    (step) => {
      const hours = Math.floor(step / 2);
      const minutes = (step % 2) * 30;
      let result = "";
      if (hours > 0) result += `${hours} ${getHourText(hours)}`;
      if (minutes > 0) result += ` ${minutes} минут`;
      return result.trim();
    },
    [getHourText]
  );

  // Ключ для AES
  const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
  const key = CryptoJS.enc.Base64.parse(base64Key);
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

  const fetchOrderById = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.salon-era.ru/records/id?id=${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error(await res.text());

        const encryptedData = await res.json();

        // Расшифровываем нужные поля вручную
        const decrypted = {
          ...encryptedData,
          clientFrom: {
            ...encryptedData.clientFrom,
            first_name: decryptField(encryptedData.clientFrom?.first_name),
            last_name: decryptField(encryptedData.clientFrom?.last_name),
          },
          employeeTo: {
            ...encryptedData.employeeTo,
            first_name: decryptField(encryptedData.employeeTo?.first_name),
            last_name: decryptField(encryptedData.employeeTo?.last_name),
          },
          service: {
            ...encryptedData.service,
            name: decryptField(encryptedData.service?.name),
          },
        };

        return decrypted;
      } catch (err) {
        console.warn("Ошибка при получении заказа:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [decryptField]
  );

  const updateOrderStatus = useCallback(
    async (order, status) => {
      const formData = new FormData();
      formData.append(
        "clientData",
        JSON.stringify({ id: order.record.id, status })
      );
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.salon-era.ru/records/update`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error(await response.text());

        const updated = await fetchOrderById(order.record.id);
        if (!updated) throw new Error("Не удалось загрузить обновлённый заказ");

        setOrders((prev) =>
          prev.map((o) => (o.record.id === updated.record.id ? updated : o))
        );
      } catch (error) {
        setError(error.message || "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    },
    [setOrders, setError, fetchOrderById]
  );

  const updateOrderPrice = useCallback(
    async (orderId, price) => {
      const formData = new FormData();
      formData.append(
        "clientData",
        JSON.stringify({ id: orderId, price: Number(price) })
      );
      try {
        const response = await fetch(
          `https://api.salon-era.ru/records/update`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error(await response.text());

        const updated = await fetchOrderById(orderId);
        if (!updated) throw new Error("Не удалось загрузить обновлённый заказ");

        setOrders((prev) =>
          prev.map((o) => (o.record.id === updated.record.id ? updated : o))
        );
      } catch (error) {
        setError(error.message || "Ошибка при обновлении цены");
      } finally {
        setEditingPriceId(null);
        setNewPrice("");
      }
    },
    [setOrders, setError, fetchOrderById]
  );

  const acceptOrder = useCallback(
    (order) => updateOrderStatus(order, 100),
    [updateOrderStatus]
  );

  const closeOrder = useCallback(
    (order) => {
      updateOrderStatus(order, 500);
      dispatch(removeOrder(order.record.id));  
    },
    [updateOrderStatus, dispatch]
  );

  const cancelOrder = useCallback(
    (order) => {
      updateOrderStatus(order, 400);
      dispatch(removeOrder(order.record.id)); 
    },
    [updateOrderStatus, dispatch]
  );

  return {
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
  };
};
