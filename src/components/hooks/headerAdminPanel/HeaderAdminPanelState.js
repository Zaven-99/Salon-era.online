import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeEmployee } from "../../../store/slices/employeeSlice";
import { removeUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

export const HeaderAdminPanelState = () => {
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleOtherModal = () => setShowOtherModal((prev) => !prev);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Отправка запроса на выход
      await fetch("https://api.salon-era.ru/employees/onExit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }

    // Очистка и редирект
    localStorage.removeItem("user");
    localStorage.removeItem("employee");
    localStorage.removeItem("token");
    dispatch(removeEmployee());
    dispatch(removeUser());

    navigate("/");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
  };

  return {
    loading,
    isMenuOpen,
    toggleMenu,
    showOtherModal,
    handleOtherModal,
    handleLogout,
  };
};
