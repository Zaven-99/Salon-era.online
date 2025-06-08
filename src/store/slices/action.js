import { setEmployee, removeEmployee } from "./employeeSlice";
import {setUser, removeUser} from './userSlice'
import { addService, removeService, clearServices } from "./serviceSlice";
import { selectBarber, clearBarber, setSlotsForBarber } from "./barberSlice";
import { saveOrder, clearOrders } from "./orderSlice";

export const loginEmployee = (userData) => (dispatch) => {
  dispatch(setEmployee(userData));
};

export const logoutEmployee = () => (dispatch) => {
  dispatch(removeEmployee());
};

export const loginUser = (userData) => (dispatch) => {
  dispatch(setUser(userData));
};

export const logoutUser = () => (dispatch) => {
  dispatch(removeUser());
};

export const addSelectedService = (serviceName) => (dispatch) => {
  dispatch(addService(serviceName));
};

export const removeSelectedService = (serviceName) => (dispatch) => {
  dispatch(removeService(serviceName));
};

export const clearSelectedServices = () => (dispatch) => {
  dispatch(clearServices());
};

export const selectChosenBarber = (barber) => (dispatch) => {
  dispatch(selectBarber(barber));
};

export const clearChosenBarber = () => (dispatch) => {
  dispatch(clearBarber());
};
export const savedOrders = (orderData) => (dispatch) => {
  dispatch(saveOrder(orderData));
};
export const clearedOrders = (dispatch) => {
  dispatch(clearOrders());
};

export const setBarberSlots = (barberId, slots) => (dispatch) => {
  dispatch(setSlotsForBarber({ barberId, slots }));
};
