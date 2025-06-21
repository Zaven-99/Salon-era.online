import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuSideBtn from "../../menuSideBtn/MenuSideBtn";
import MenuSide from "../../menuSide/MenuSide";
import { HeaderAdminPanelState } from "../../hooks/headerAdminPanel/HeaderAdminPanelState";
import CustomButton from "../../customButton/CustomButton";
import { ToastContainer } from "react-toastify";

import styles from "./headerAdminPanel.module.scss";

const HeaderAdminPanel = () => {
  const {
    isMenuOpen,
    toggleMenu,
    showOtherModal,
    handleOtherModal,
    handleLogout,
  } = HeaderAdminPanelState();

  const orders = useSelector((state) => state.order.orders);
  const employeeData = localStorage.getItem("employee");
  const employee = employeeData ? JSON.parse(employeeData) : null;
  const menuItems = [
    { path: "/adminPanel/orders", label: "Заказы" },
    { path: "/adminPanel/history-orders", label: "История заказов" },
    { path: "/adminPanel/employee", label: "Сотрудники" },
    { path: "/adminPanel/services", label: "Услуги" },
    { path: "/adminPanel/our-works", label: "Работы" },
    { path: "/adminPanel/news", label: "Новости" },
    { path: "/adminPanel/slides", label: "Слайдер" },
    { path: "/adminPanel/schedule", label: "График" },
  ];

  return (
    <div className={styles["header-admin__panel"]}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
      <div className={styles["header-top"]}>
        <p className={styles.status}>Вы вошли как {employee.login}</p>

        <CustomButton
          label="Выйти"
          onClick={handleLogout}
          className={styles.logOut}
        />
      </div>
      <div className={styles.wrapper}>
        <MenuSideBtn
          className={styles["menu-btn"]}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
        />
        <MenuSide
          menuItems={menuItems}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
        />
        <ul className={styles.navigation}>
          <NavLink
            to="/adminPanel/orders"
            className={({ isActive }) =>
              isActive
                ? `${styles["navList-item"]} ${styles.active}`
                : styles["navList-item"]
            }
          >
            <li className={styles["orders"]}>
              Заказы
              <span className={styles["create-orders"]}>
                <p className={styles["order-length"]}>{orders.length || 0}</p>
              </span>
            </li>
          </NavLink>
          <NavLink
            to="/adminPanel/history-orders"
            className={({ isActive }) =>
              isActive
                ? `${styles["navList-item"]} ${styles.active}`
                : styles["navList-item"]
            }
          >
            <li>История заказов</li>
          </NavLink>
          <NavLink
            to="/adminPanel/schedule"
            className={({ isActive }) =>
              isActive
                ? `${styles["navList-item"]} ${styles.active}`
                : styles["navList-item"]
            }
          >
            <li>График</li>
          </NavLink>

          <div onClick={handleOtherModal} className={styles["other-btn"]}>
            Прочее
            {showOtherModal && (
              <div className={styles["other-modal"]}>
                <ul>
                  <NavLink
                    to="/adminPanel/employee"
                    className={({ isActive }) =>
                      isActive
                        ? `${styles["navList-item"]} ${styles.active}`
                        : styles["navList-item"]
                    }
                  >
                    <li>Сотрудники</li>
                  </NavLink>
                  <NavLink
                    to="/adminPanel/services"
                    className={({ isActive }) =>
                      isActive
                        ? `${styles["navList-item"]} ${styles.active}`
                        : styles["navList-item"]
                    }
                  >
                    <li>Услуги</li>
                  </NavLink>
                  <NavLink
                    to="/adminPanel/our-works"
                    className={({ isActive }) =>
                      isActive
                        ? `${styles["navList-item"]} ${styles.active}`
                        : styles["navList-item"]
                    }
                  >
                    <li>Работы</li>
                  </NavLink>
                  <NavLink
                    to="/adminPanel/news"
                    className={({ isActive }) =>
                      isActive
                        ? `${styles["navList-item"]} ${styles.active}`
                        : styles["navList-item"]
                    }
                  >
                    <li>Новости</li>
                  </NavLink>
                  <NavLink
                    to="/adminPanel/slides"
                    className={({ isActive }) =>
                      isActive
                        ? `${styles["navList-item"]} ${styles.active}`
                        : styles["navList-item"]
                    }
                  >
                    <li>Слайдер</li>
                  </NavLink>
                </ul>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default HeaderAdminPanel;
