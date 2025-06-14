import React from "react";
import CustomInput from "../../../../customInput/CustomInput";
import CustomSelect from "../../../../customSelect/CustomSelect";
import ImagePreview from "../../../../uploadImage/imagePreview/ImagePreview";
import BtnBlock from "../../../../btnBlock/BtnBlock";
import { Controller } from "react-hook-form";
import { EditModalState } from "../../../../hooks/employee/EditModalState";

import styles from "./editModal.module.scss";
import Spinner from "../../../../spinner/Spinner";
import UploadImage from "../../../../uploadImage/UploadImage";

const EditModal = ({
  setLoading,
  editedEmployee,
  setEmployee,
  setEmployeeId,
  setEditedEmployee,
  toggleHelpModal,
  showHelpModal,
  handleKeyDown,
  positions,
  employee,
  fetchEmployee,
}) => {
  const {
    register,
    control,
    errors,
    showPassword,
    setShowPassword,
    activeInput,
    setActiveInput,
    categories,
    handleChange,
    handleCategoryChange,
    uploadImage,
    deletImagePreview,
    handleSave,
    imagePreview,
    loading,
  } = EditModalState({
    setLoading,
    setEmployee,
    setEmployeeId,
    setEditedEmployee,
    editedEmployee,
    employee,
    fetchEmployee,
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["edit-modal"]}>
      <h2>Редактировать</h2>
      <CustomInput
        label="Введите имя:"
        error={errors.first_name}
        type="text"
        name="first_name"
        value={editedEmployee.first_name}
        handleChange={handleChange}
        isActive={activeInput === "first_name"}
        setActiveInput={setActiveInput}
        {...register("first_name", {
          minLength: {
            value: 3,
            message: "Имя должен содержать минимум 3 символа.",
          },
        })}
      />

      <CustomInput
        label="Введите фамилию:"
        error={errors.last_name}
        type="text"
        name="last_name"
        value={editedEmployee.last_name}
        handleChange={handleChange}
        isActive={activeInput === "last_name"}
        setActiveInput={setActiveInput}
        {...register("last_name", {
          minLength: {
            value: 3,
            message: "Фамилия должен содержать минимум 3 символа.",
          },
        })}
      />
      <CustomInput
        label="Введите логин:"
        error={errors.login}
        type="text"
        name="login"
        value={editedEmployee.login}
        handleChange={handleChange}
        isActive={activeInput === "login"}
        setActiveInput={setActiveInput}
        {...register("login", {
          minLength: {
            value: 3,
            message: "Логин должен содержать минимум 3 символа.",
          },
          maxLength: {
            value: 20,
            message: "Логин не должен превышать 20 символов.",
          },
        })}
      />
      <CustomInput
        label="Введите пароль:"
        show={() => setShowPassword((prev) => !prev)}
        showPassword={showPassword}
        autoComplete="new-password"
        error={errors.password}
        toggleHelpModal={toggleHelpModal}
        showHelpModal={showHelpModal}
        value={editedEmployee.password}
        handleChange={handleChange}
        isActive={activeInput === "password"}
        setActiveInput={setActiveInput}
        {...register("password", {
          minLength: {
            value: 8,
            message: "Пароль должен содержать минимум 8 символов.",
          },
          validate: {
            hasUpperCase: (value) =>
              /[A-Z]/.test(value) ||
              "Пароль должен содержать хотя бы одну заглавную букву.",
            hasLowerCase: (value) =>
              /[a-z]/.test(value) ||
              "Пароль должен содержать хотя бы одну строчную букву.",
            hasNumber: (value) =>
              /\d/.test(value) || "Пароль должен содержать хотя бы одну цифру.",
            hasSpecialChar: (value) =>
              /[!@#$%^&*._-]/.test(value) ||
              "Пароль должен содержать хотя бы один специальный символ: ! @ # $ % ^ & * . - _",
            hasCyrillic: (value) =>
              !/[а-яА-ЯЁё]/.test(value) ||
              "Пароль не должен содержать кириллические символы.",
          },
        })}
      />

      <CustomInput
        label="Введите почту:"
        name="email"
        type="email"
        error={errors.email}
        value={editedEmployee.email}
        handleChange={handleChange}
        isActive={activeInput === "email"}
        setActiveInput={setActiveInput}
        {...register("email", {
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Введите корректный адрес электронной почты",
          },
        })}
      />
      <CustomInput
        label="Введите номер телефона:"
        error={errors.phone}
        name="phone"
        type="tel"
        value={editedEmployee.phone}
        handleChange={handleChange}
        isActive={activeInput === "phone"}
        setActiveInput={setActiveInput}
        onKeyDown={handleKeyDown}
        {...register("phone", {
          pattern: {
            value: /^\+7\d{10}$/,
            message: "Номер телефона должен содержать 10 цифр",
          },
        })}
      />

      <Controller
        name="position"
        control={control}
        rules={{ required: "Это поле обязательно" }}
        render={({ field }) => (
          <CustomSelect
            {...field}
            name="position"
            edited={editedEmployee.position}
            handleChange={handleChange}
            control={control}
            map={positions}
            valueType="id"
          />
        )}
      />

      <ImagePreview
        deletImagePreview={deletImagePreview}
        imagePreview={imagePreview}
      />
      <UploadImage onChange={uploadImage} />
      <h5 className={styles["choose-category"]}>
        Выберите категорию услуг для мастера
      </h5>
      <div className={styles.array_type_work}>
        {categories.map((category) => (
          <label key={category.id}>
            <input
              type="checkbox"
              name="array_type_work"
              value={category.id}
              checked={editedEmployee.array_type_work.includes(category.id)}
              onChange={(e) => handleCategoryChange(e, category.id)}
            />
            {category.value}
          </label>
        ))}
      </div>

      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        value={editedEmployee.gender}
        handleChange={handleChange}
        control={control}
      />

      <BtnBlock
        className1={styles["g-btn"]}
        className2={styles["r-btn"]}
        className4={styles["btn-block"]}
        label1="Сохранить"
        label2="Отменить"
        fnc1={() => handleSave(employee.id)}
        fnc2={() => setEmployeeId(null)}
      />
    </div>
  );
};

export default EditModal;
