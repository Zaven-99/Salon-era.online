import React from "react";
import CustomButton from "../../../../customButton/CustomButton";
import CustomInput from "../../../../customInput/CustomInput";
import { SignUpBlockState } from "../../../../hooks/orders/SignUpBlockState";
import Spinner from "../../../../spinner/Spinner";

import styles from "./signUpBlock.module.scss";

const SignUpBlock = ({
  setSuccesSignUp,
  setClient,
  setOfferModal,
  activeInput,
  setActiveInput,
  handleKeyDown,
}) => {
  const {
    register,
    handleSubmit,
    control,
    errors,
    errorMessages,
    setErrorMessages,
    onSubmit,
    toggleCloseOfferModal,
    loading,
  } = SignUpBlockState({
    setSuccesSignUp,
    setClient,
    setOfferModal,
  });
  if (loading) {
    return <Spinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["modal-content"]}>
      <span className={styles["form-close"]} onClick={toggleCloseOfferModal}>
        &#10005;
      </span>
      <p className={styles.error}>Клиент не найден!</p>
      <h3>Зарегистрировать клиента</h3>

      <CustomInput
        label="Введите имя:"
        error={errors.first_name}
        type="text"
        name="first_name"
        isActive={activeInput === "first_name"}
        setActiveInput={setActiveInput}
        {...register("first_name", {
          required: "Это поле обязательно.",
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
        isActive={activeInput === "last_name"}
        setActiveInput={setActiveInput}
        {...register("last_name", {
          required: "Это поле обязательно.",
          minLength: {
            value: 3,
            message: "Фамилия должен содержать минимум 3 символа.",
          },
        })}
      />
      <p className={styles["error-message"]}>{errorMessages.phone}</p>
      <CustomInput
        label="Введите номер телефона:"
        onKeyDown={handleKeyDown}
        error={errors.phone}
        maxLength="12"
        name="phone"
        type="tel"
        isActive={activeInput === "phone"}
        setActiveInput={setActiveInput}
        {...register("phone", {
          required: "Это поле обязательно",
          pattern: {
            value: /^\+7\d{10}$/,
            message: "Номер телефона должен содержать 10 цифр",
          },
          onChange: () => setErrorMessages((prev) => ({ ...prev, phone: "" })),
        })}
      />
      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        control={control}
        error={errors.gender}
        {...register("gender", { required: "Выберите пол." })}
      />
      <CustomButton
        className={styles["sign-up__button"]}
        label="Зарегистрировать клиента"
        type="submit"
      />
    </form>
  );
};

export default SignUpBlock;
