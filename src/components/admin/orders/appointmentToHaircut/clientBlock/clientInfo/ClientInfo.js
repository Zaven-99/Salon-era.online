import React from "react";
import { useSelector } from "react-redux";
import styles from "./clientInfo.module.scss";

const ClientInfo = ({ client }) => {
  const user = useSelector((state) => state.user);
  return (
    <div className={styles["client-info__inner"]}>
      <p>
        <strong>Имя:</strong> {user.first_name || client.first_name}
      </p>
      <p>
        <strong>Фамилия:</strong> {user.last_name || client.last_name}
      </p>
      <p>
        <strong>Телефон:</strong> {user.phone || client.phone}
      </p>
      <p>
        <strong>Email:</strong> {user.email || client.email }
      </p>
      <p>
        <strong>Пол:</strong> {user.gender === 0 ? "Женский" : "Мужской"}
      </p>
    </div>
  );
};

export default ClientInfo;
