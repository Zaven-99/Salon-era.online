import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, removeUser } from "./store/slices/userSlice";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "./components/admin/login/Login";
import OrdersAdminPanelPage from "./pages/ordersAdminPanelPage/OrdersAdminPanelPage";
import ServicesAdminPanelPage from "./pages/servicesAdminPanelPage/ServicesAdminPanelPage";
import EmployeeAdminPanelPage from "./pages/employeeAdminPanelPage/EmployeeAdminPanelPage";
import HistoryOrdersAdminPanelPage from "./pages/historyOrdersAdminPanelPage/HistoryOrdersAdminPanelPage";
import OurWorksAdminPanelPage from "./pages/ourWorksAdminPanelPage/OurWorksAdminPanelPage";
import NewsAdminPanelPage from "./pages/newsAdminPanelPage/NewsAdminPanelPage";
import ScheduleAdminPanelPage from "./pages/scheduleAdminPanelPage/ScheduleAdminPanelPage";
import SlidesAdminPanelPage from "./pages/slidesAdminPanelPage/SlidesAdminPanelPage";
import AdminPanelLayout from "./components/layouts/AdminPanelLayout";
import spinner from "./img/icons/Loading_icon.gif";
import CustomButton from "./components/customButton/CustomButton";
import { useOrdersState } from "./components/hooks/orders/OrdersState.js";

import "./App.css";

import "./components/styles/reset.css";
function App() {
  const dispatch = useDispatch();
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  const {
    filteredOrders,
    setOrders,
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
  } = useOrdersState();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, [dispatch]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    let timeoutId;
    let intervalId;

    const checkSession = async () => {
      try {
        const res = await fetch(
          "https://api.salon-era.ru/test/bearer/getdata",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.status === 401) {
          console.warn("❌ Сессия истекла, выполняется очистка");

          setSessionExpired(true);

          // Остановить дальнейшие проверки
          clearInterval(intervalId);
        }
      } catch (e) {
        console.error("Ошибка при проверке сессии:", e);
      }
    };

    // ⏱ Первая проверка через 5 минут
    timeoutId = setTimeout(() => {
      checkSession();

      // ⏱ Далее — каждые 8 минут
      intervalId = setInterval(() => {
        checkSession();
      }, 8 * 60 * 1000); // 8 минут
    }, 5 * 60 * 1000); // 5 минут

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  const handleSessionExpiredConfirm = () => {
    localStorage.removeItem("user");
    dispatch(removeUser());
    setSessionExpired(false);
    navigate("/");
  };

  return (
    <div className="App">
      {sessionExpired && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img className="spinner" src={spinner} alt="" />
            <p>Сессия истекла. Пожалуйста, войдите снова.</p>
            <CustomButton
              label="Ок"
              onClick={handleSessionExpiredConfirm}
              className="b-btn"
            />
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route
          path="/adminPanel/orders"
          element={
            <AdminPanelLayout>
              <OrdersAdminPanelPage
                filteredOrders={filteredOrders}
                setOrders={setOrders}
                error={error}
                loading={loading}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                addOrderModal={addOrderModal}
                setAddOrderModal={setAddOrderModal}
                toggleOpen={toggleOpen}
                filterOrdersByDate={filterOrdersByDate}
                formatDate={formatDate}
                setError={setError}
              />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/news"
          element={
            <AdminPanelLayout>
              <NewsAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/services"
          element={
            <AdminPanelLayout>
              <ServicesAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/employee"
          element={
            <AdminPanelLayout>
              <EmployeeAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/history-orders"
          element={
            <AdminPanelLayout>
              <HistoryOrdersAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/our-works"
          element={
            <AdminPanelLayout>
              <OurWorksAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/slides"
          element={
            <AdminPanelLayout>
              <SlidesAdminPanelPage />
            </AdminPanelLayout>
          }
        />
        <Route
          path="/adminPanel/schedule"
          element={
            <AdminPanelLayout>
              <ScheduleAdminPanelPage />
            </AdminPanelLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
