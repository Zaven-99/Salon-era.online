import React from "react";

import styles from "./employeeBlock.module.scss";

const EmployeeBlock = ({ employee, formatDate, getGenderText }) => {
  return (
    <div className={styles["employee-item"]}>
      <div className={styles["employee-item__inner"]}>
        <strong>Имя:</strong>
        <div>{employee?.first_name}</div>
      </div>
      <div className={styles["employee-item__inner"]}>
        <strong>Фамилия:</strong>
        <div>{employee?.last_name}</div>
      </div>
      <div className={styles["employee-item__inner"]}>
        <strong>Email:</strong> <div>{employee?.email}</div>
      </div>
      <div className={styles["employee-item__inner"]}>
        <strong>Телефон:</strong> <div>{employee?.phone}</div>
      </div>
      <div className={styles["employee-item__inner"]}>
        <strong className={styles.date}>Дата:</strong>
        <div>{formatDate(employee?.date_work_in)}</div>
      </div>

      <div className={styles["employee-item__inner"]}>
        <strong>Пол:</strong> <div>{getGenderText(employee?.gender)}</div>
      </div>
    </div>
  );
};

export default EmployeeBlock;
