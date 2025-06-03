import React from "react";

import { SignInFormState } from "../../hooks/signInForm/SignInFormState";
import CustomInput from "../../customInput/CustomInput";
import CustomButton from "../../customButton/CustomButton";
import Spinner from "../../spinner/Spinner";
import logo from "../../../img/logo.png";
import styles from "./login.module.scss";

const SignInForm = () => {
  const {
    showFormSignUp,
    showRecoverPasswordForm,
    showPassword,
    setShowPassword,
    loading,
    showHelpModal,
    toggleHelpModal,
    errorMessages,
    setErrorMessages,
    activeInput,
    setActiveInput,
    handleSubmit,
    register,
    errors,
    onSubmit,
  } = SignInFormState();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.signInForm}>
      <div className={styles.wrapper}>
        {!showFormSignUp && !showRecoverPasswordForm && (
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.logo}>
              <img src={logo} alt="" />
            </div>
            <h2 className={styles.logIn}>Войти в аккаунт</h2>
            <p className={styles["error-message"]}>{errorMessages.login}</p>
            <CustomInput
              label="Введите логин"
              type="login"
              name="login"
              error={errors.login}
              isActive={activeInput === "login"}
              setActiveInput={setActiveInput}
              {...register("login", {
                required: "Это поле обязательно.",
                onChange: () =>
                  setErrorMessages((prev) => ({ ...prev, login: "" })),
              })}
            />

            <CustomInput
              label="Введите пароль"
              type={showPassword ? "text" : "password"}
              name="password"
              showPassword={showPassword}
              show={() => setShowPassword((prev) => !prev)}
              toggleHelpModal={toggleHelpModal}
              showHelpModal={showHelpModal}
              error={errors.password}
              isActive={activeInput === "password"}
              setActiveInput={setActiveInput}
              {...register("password", { required: "Это поле обязательно." })}
            />

            <CustomButton
              className={styles["signIn-btn"]}
              type="submit"
              label="Войти"
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default SignInForm;
