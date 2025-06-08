import { useSelector } from "react-redux";

export function useAuth() {
  const {
    firstName,
    lastName,
    login,
    token,
    email,
    phone,
    gender,
    role,
    imageLink,
    id,
  } = useSelector((state) => state.employee);
  return {
    isAuth: !!login,
    id,
    firstName,
    lastName,
    login,
    email,
    phone,
    gender,
    role,
    token,
    imageLink,
  };
}
