import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { setEmployee } from "../../../store/slices/employeeSlice";

export const SignInFormState = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [activeInput, setActiveInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  // ---- reCAPTCHA v3 ----
  // const RECAPTCHA_SITE_KEY = "6Lc4ZFMrAAAAAD8VgxLc7E-1bhw5QArUSREEQE4U";

  // useEffect(() => {
  //   const scriptId = "recaptcha-v3-script";
  //   if (!document.getElementById(scriptId)) {
  //     const script = document.createElement("script");
  //     script.id = scriptId;
  //     script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
  //     script.async = true;
  //     document.body.appendChild(script);
  //   }
  // }, []);

  // const loadRecaptchaScript = () => {
  //   return new Promise((resolve) => {
  //     if (window.grecaptcha) {
  //       resolve();
  //     } else {
  //       const checkInterval = setInterval(() => {
  //         if (window.grecaptcha) {
  //           clearInterval(checkInterval);
  //           resolve();
  //         }
  //       }, 100);
  //     }
  //   });
  // };

  const onSubmit = async (formValues) => {
    setErrorMessages({});

    try {
      // await loadRecaptchaScript();

      // if (!window.grecaptcha || !window.grecaptcha.execute) {
      //   setErrorMessages({
      //     general: "Не удалось загрузить reCAPTCHA. Попробуйте позже.",
      //   });
      //   return;
      // }

      // const recaptchaToken = await window.grecaptcha.execute(
      //   RECAPTCHA_SITE_KEY,
      //   {
      //     action: "submit",
      //   }
      // );

      // if (!recaptchaToken) {
      //   setErrorMessages({
      //     general: "Пожалуйста, пройдите проверку reCAPTCHA.",
      //   });
      //   return;
      // }

      // const captchaResponse = await fetch(
      //   "https://api.salon-era.ru/captcha/submit-form",
      //   {
      //     method: "POST",
      //     body: new URLSearchParams({
      //       "g-recaptcha-response": recaptchaToken,
      //     }),
      //   }
      // );

      // if (!captchaResponse.ok) {
      //   const text = await captchaResponse.text();
      //   throw new Error(`Ошибка при проверке капчи: ${text}`);
      // }

      const url = "https://api.salon-era.ru/employees/auth";
      const requestBody = {
        login: formValues.login,
        password: formValues.password,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      const data = await response.json();

      const employee = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        login: data.login,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        imageLink: data.imageLink,
        token: true,
        role: "ADMIN",
      };

      localStorage.setItem("employee", JSON.stringify(employee));
      dispatch(setEmployee(employee));
      navigate("/adminPanel/orders");
    } catch (error) {
      try {
        const errorData = JSON.parse(error.message);
        const errorDetails = JSON.parse(errorData.message);
        const errorCode = errorDetails.errorCode;

        if (errorCode === "100") {
          setErrorMessages((prev) => ({
            ...prev,
            login: "Неверный логин или пароль",
          }));
        } else {
          setErrorMessages((prev) => ({
            ...prev,
            general: "Ошибка авторизации. Попробуйте позже.",
          }));
        }
      } catch {
        console.error("Ошибка авторизации:", error);
        setErrorMessages((prev) => ({
          ...prev,
          general: error.message || "Неизвестная ошибка при авторизации",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleHelpModal = () => setShowHelpModal((prev) => !prev);

  return {
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
  };
};
