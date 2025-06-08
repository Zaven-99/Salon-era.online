import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Spinner from "../../../../spinner/Spinner";

import styles from "./calendarBlock.module.scss";

const CalendarBlock = ({
  setSelectedTime,
  selectedBarber,
  selectedTime,
  selectedServices,
}) => {
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [allSlots, setAllSlots] = useState([]);

  const fetchAllSlotsOnce = async () => {
    setLoading(true);
    if (!selectedBarber) return;

    const sumDuration = selectedServices.reduce(
      (total, service) => total + service.duration,
      0
    );

    try {
      const response = await fetch(
        `https://api.salon-era.ru/employees/timeslot/${selectedBarber.id}/${sumDuration}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении свободных слотов");
      }

      const data = await response.json();

      // Оставляем только будущие слоты
      const currentDate = new Date();
      const upcomingSlots = data.filter(
        (slot) => new Date(slot) >= currentDate
      );

      setAllSlots(upcomingSlots);
    } catch (error) {
      alert(`Произошла ошибка при получении данных. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const filterSlotsByDate = (selectedDate) => {
    // Преобразуем в объект Date, если это строка или другой тип
    const dateObj =
      selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

    const sumDuration = selectedServices.reduce(
      (total, service) => total + service.duration,
      0
    );

    const filteredSlots = allSlots.filter((slot) => {
      const slotDate = new Date(slot);
      return (
        slotDate.getFullYear() === dateObj.getFullYear() &&
        slotDate.getMonth() === dateObj.getMonth() &&
        slotDate.getDate() === dateObj.getDate()
      );
    });

    if (sumDuration > filteredSlots.length) {
      setErrorMessage("Сегодня записаться на эту услугу невозможно");
      setAvailableSlots([]);
    } else {
      setErrorMessage("");
      setAvailableSlots(filteredSlots);
    }
  };

  // Загружаем все слоты один раз при изменении selectedBarber или услуг
  useEffect(() => {
    fetchAllSlotsOnce();
  }, [selectedBarber, selectedServices]);

  // Фильтруем при изменении даты или списка всех слотов
  useEffect(() => {
    if (allSlots.length > 0) {
      filterSlotsByDate(date);
    }
  }, [date, allSlots]);

  const handleDateChange = (newDate) => {
    const resetTime = new Date(newDate);
    resetTime.setHours(0, 0, 0, 0);
    setDate(resetTime);
    setSelectedTime(null);
    setErrorMessage("");
    filterSlotsByDate(allSlots, resetTime);
  };

  const handleTimeSelect = (slot) => {
    const selectedDate = new Date(slot);
    const fullDate = new Date(date);
    selectedDate.setFullYear(fullDate.getFullYear());
    selectedDate.setMonth(fullDate.getMonth());
    selectedDate.setDate(fullDate.getDate());
    setSelectedTime(selectedDate);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
        className={styles.calendar}
      />

      {errorMessage ? (
        <p className={styles["error-message"]}>{errorMessage}</p>
      ) : (
        <>
          <h2>Доступные слоты:</h2>
          <ul className={styles["slots-block"]}>
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <li
                  key={index}
                  onClick={() => handleTimeSelect(slot)}
                  className={
                    selectedTime &&
                    selectedTime.toISOString() === new Date(slot).toISOString()
                      ? styles.selected
                      : styles.select
                  }
                >
                  {new Date(slot).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </li>
              ))
            ) : (
              <li className={styles["empty-slots"]}>
                Нет доступных слотов на эту дату
              </li>
            )}
          </ul>
        </>
      )}

      {selectedTime && (
        <p className={styles.dataSelected}>
          Выбранное время:
          {selectedTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
};

export default CalendarBlock;
