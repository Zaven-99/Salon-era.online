import React from "react";
import { useSelector } from "react-redux";
import styles from "./clientInfo.module.scss";

const ClientInfo = ({ client }) => {
  const user = useSelector((state) => state.user);
  return (
    <div className={styles["client-info__inner"]}>
      <p>
        <strong>Имя:</strong> {client.firstName || user.firstName}
      </p>
      <p>
        <strong>Фамилия:</strong> {client.lastName || user.lastName}
      </p>
      <p>
        <strong>Телефон:</strong> {client.phone || user.phone}
      </p>
      <p>
        <strong>Email:</strong> {client.email || user.email}
      </p>
      <p>
        <strong>Пол:</strong> {user.gender === 0 ? "Женский" : "Мужской"}
      </p>
    </div>
  );
};

export default ClientInfo;
