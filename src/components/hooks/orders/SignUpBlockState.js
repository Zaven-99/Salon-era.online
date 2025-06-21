import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";

export const SignUpBlockState = ({
  setSuccesSignUp,
  setClient,
  setOfferModal,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
    },
  });

  const [errorMessages, setErrorMessages] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const generateRandomEmail = () => {
    const domains = ["gmail.com", "yahoo.com", "mail.ru", "outlook.com"];
    const username = generateRandomString(8);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  };

  const onSubmit = async (formValues) => {
    const { gender, patronymic, policy, ...dataToSend } = formValues;

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify([
        {
          ...dataToSend,
          login: generateRandomString(5),
          password: "Password123..",
          email: generateRandomEmail(),
          gender: parseInt(formValues.gender),
          patronymic: "0",
        },
      ])
    );

    try {
      // setLoading(true);

      const response = await fetch("https://api.salon-era.ru/clients", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error("Ошибка при регистрации");
        error.responseData = data; // <-- сохраняем в отдельное поле
        error.status = response.status;
        throw error;
      }

      setClient(data);

      const userPayload = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        login: data.login,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        token: true,
        role: "USER",
      };

      localStorage.setItem("user", JSON.stringify(userPayload));
      dispatch(setUser(userPayload));

      setSuccesSignUp(true);
      reset();
      toggleCloseOfferModal();
    } catch (error) {
      try {
        const errorDetails = error.responseData;

        const errorCode = errorDetails?.errorCode;
        console.log(errorCode)
        if (errorCode === "206") {
          setErrorMessages((prev) => ({
            ...prev,
            phone: `Пользователь с номером ${formValues.phone} уже существует`,
          }));
        } else {
          setErrorMessages((prev) => ({
            ...prev,
            general:
              "Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.",
          }));
        }
      } catch (parseError) {
        console.error("Ошибка при парсинге ошибки:", parseError);
        setErrorMessages((prev) => ({
          ...prev,
          general: error.message || "Неизвестная ошибка при регистрации",
        }));
      }
    } finally {
      setLoading(false);
      setSuccesSignUp(false);
    }
  };

  const toggleCloseOfferModal = () => {
    setOfferModal(false);
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    errorMessages,
    setErrorMessages,
    onSubmit,
    toggleCloseOfferModal,
    loading,
  };
};
