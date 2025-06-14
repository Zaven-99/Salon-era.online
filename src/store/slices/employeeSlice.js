import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

// Ключ для дешифровки
const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
const key = CryptoJS.enc.Base64.parse(base64Key);

// Функция дешифровки
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

// Начальное состояние пользователя
const initialState = {
  id: null,
  first_name: null,
  last_name: null,
  login: null,
  email: null,
  phone: null,
  gender: null,
  role: null,
  image_link: null,
  token: false,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployee(state, action) {
      const employee = action.payload;

      if (!employee) return;
      const fieldsToDecrypt = [
        "first_name",
        "last_name",
        "password",
        "email",
        "phone",
        "role",
      ];
      const decryptedEmployee = {};

      // Дешифруем только необходимые поля
      fieldsToDecrypt?.forEach((field) => {
        if (employee[field]) {
          decryptedEmployee[field] = decryptField(employee[field]);
        }
      });

      // Копируем остальные поля без расшифровки
      Object.keys(employee).forEach((key) => {
        if (!fieldsToDecrypt.includes(key)) {
          decryptedEmployee[key] = employee[key];
        }
      });

      // Если image_link не зашифрован, просто передаем его
      decryptedEmployee.image_link = employee.image_link;

      // Обновляем поля в состоянии
      Object.entries(decryptedEmployee).forEach(([key, value]) => {
        if (value !== undefined) {
          state[key] = value;
        }
      });
    },

    removeEmployee(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setEmployee, removeEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
