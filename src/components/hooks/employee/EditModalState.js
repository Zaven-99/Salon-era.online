import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { compressAndPreviewImage } from "../../../utils/uploadImage";
export const EditModalState = ({
  setEmployee,
  setEmployeeId,
  setEditedEmployee,
  editedEmployee,
  employee,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      login: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      position: "",
      date_work_in: "",
      gender: "",
      role: "USER",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchCategory = async () => {
    try {
      const response = await fetch(
        "https://api.salon-era.ru/catalogs/all/filter?field=category&state=eq&value=Категория услуг",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Ошибка при загрузке категорий");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e, categoryId) => {
    const { checked } = e.target;
    setEditedEmployee((prev) => ({
      ...prev,
      array_type_work: checked
        ? [...prev.array_type_work, categoryId]
        : prev.array_type_work.filter((id) => id !== categoryId),
    }));
  };

  const uploadImage = async (event) => {
    const result = await compressAndPreviewImage(event, {}, setLoading);
    if (result) {
      setSelectedFile(result.compressedFile);
      setImagePreview(result.dataUrl);
    }
  };

  const deletImagePreview = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleSave = async (id) => {
    setLoading(true);

    const serviceToUpdate = { ...editedEmployee, id };

    if (employee?.login === editedEmployee.login) {
      delete serviceToUpdate.login;
    }
    if (employee?.email === editedEmployee.email) {
      delete serviceToUpdate.email;
    }

    const formData = new FormData();

    formData.append("clientData", JSON.stringify(serviceToUpdate));

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch(
        `https://api.salon-era.ru/employees/update`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(
          `Ошибка при сохранении: ${
            errorMessage.message ||
            errorMessage.errorDescription ||
            JSON.stringify(errorMessage)
          }`
        );
      }

      setEmployee((prevEmployee) =>
        prevEmployee.map((emp) => (emp.id === id ? editedEmployee : emp))
      );

      setEmployeeId(null);
      setEditedEmployee({});
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    control,
    errors,
    showPassword,
    setShowPassword,
    activeInput,
    setActiveInput,
    selectedFile,
    categories,
    handleChange,
    handleCategoryChange,
    uploadImage,
    deletImagePreview,
    handleSave,
    imagePreview,
    loading,
  };
};
