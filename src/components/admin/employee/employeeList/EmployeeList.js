import React from "react";
import Modal from "../../../modal/Modal";
import BtnBlock from "../../../btnBlock/BtnBlock";
import EditModal from "./editModal/EditModal";
import EmployeeBlock from "./employeeBlock/EmployeeBlock";
import { EmployeeListState } from "../../../hooks/employee/EmployeeListState";
import GenericSkeleton from "../../../../utils/Skeleton";

import avatarImg from "../../../../img/icons/avatar.png";
import styles from "./employeeList.module.scss";

const EmployeeList = ({
  employee,
  setEmployee,
  toggleHelpModal,
  showHelpModal,
  toggleOpen,
  toggleClose,
  handleKeyDown,
  positions,
  getPositionTextById,
}) => {
  const {
    loading,
    setLoading,
    employeeId,
    editedEmployee,
    confirmDeleteEmployee,
    employeeToDelete,
    imagePreview,
    setEmployeeId,
    setEditedEmployee,
    setImagePreview,
    handleDelete,
    handleEdit,
    showMessageDeleteEmployee,
    closeMessageDeleteEmployee,
    getGenderText,
    formatDate,
    groupEmployeesByPosition,
  } = EmployeeListState(setEmployee);

  const groupedEmployee = groupEmployeesByPosition(employee);

  if (loading) {
    return (
      <GenericSkeleton
        headerCount={1}
        headerWidths={["50%", "30%"]}
        itemCount={10}
        itemWidth="100%"
        itemHeight={50}
      />
    );
  }

  if (!Object.keys(groupedEmployee).length) {
    return <p className={styles.message}>Список сотрудников пуст.</p>;
  }

  return (
    <div className={styles["employee-list"]}>
      <h1 className={styles.employee}>Сотрудники</h1>

      {Object.keys(groupedEmployee).map((position) => (
        <div key={position}>
          <h4 className={styles.category}>{getPositionTextById(position)}</h4>

          <ul className={styles["employee-list__inner"]}>
            {groupedEmployee[position].map((employee, index) => (
              <li className={styles["employee-item"]} key={index}>
                {employeeId === employee.id ? (
                  <Modal
                    toggleOpen={toggleOpen}
                    toggleClose={toggleClose}
                    setEmployeeId={setEmployeeId}
                  >
                    <EditModal
                      imagePreview={imagePreview}
                      setLoading={setLoading}
                      editedEmployee={editedEmployee}
                      setEmployee={setEmployee}
                      setEmployeeId={setEmployeeId}
                      setEditedEmployee={setEditedEmployee}
                      setImagePreview={setImagePreview}
                      toggleHelpModal={toggleHelpModal}
                      showHelpModal={showHelpModal}
                      handleKeyDown={handleKeyDown}
                      positions={positions}
                      employee={employee}
                    />
                  </Modal>
                ) : (
                  <>
                    <div className={styles["employee-item__inner"]}>
                      {employee.image_link ? (
                        <img
                          className={styles["image-employee"]}
                          src={employee.image_link}
                          alt=""
                        />
                      ) : (
                        <div>
                          <img
                            className={styles["image-employee"]}
                            src={avatarImg}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                    <EmployeeBlock
                      employee={employee}
                      formatDate={formatDate}
                      getGenderText={getGenderText}
                    />

                    <div>
                      <BtnBlock
                        className1={styles["y-btn"]}
                        className2={styles["r-btn"]}
                        className4={styles["button-block"]}
                        label1="Редактировать"
                        label2="Удалить Сотрудника"
                        fnc1={() => handleEdit(employee)}
                        fnc2={() => showMessageDeleteEmployee(employee.id)}
                      />
                      {confirmDeleteEmployee &&
                        employeeToDelete === employee.id && (
                          <Modal
                            toggleOpen={toggleOpen}
                            toggleClose={closeMessageDeleteEmployee}
                            setEmployeeId={setEmployeeId}
                          >
                            <h2 className={styles["choose"]}>
                              Вы действительно хотите удалить сотрудника ?
                            </h2>

                            <BtnBlock
                              className1={styles["g-btn"]}
                              className2={styles["r-btn"]}
                              className4={styles["btn-block"]}
                              label1="Удалить Сотрудника"
                              label2="Отменить удаления"
                              fnc1={() => handleDelete(employee.id)}
                              fnc2={closeMessageDeleteEmployee}
                            />
                          </Modal>
                        )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
