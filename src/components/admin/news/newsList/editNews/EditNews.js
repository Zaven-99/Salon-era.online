import React from "react";
import CustomInput from "../../../../customInput/CustomInput";
import BtnBlock from "../../../../btnBlock/BtnBlock";
import ImagePreview from "../../../../uploadImage/imagePreview/ImagePreview";
import { useForm } from "react-hook-form";
import Modal from "../../../../modal/Modal";
import { EditNewsState } from "../../../../hooks/news/EditNewsState";
import Spinner from "../../../../spinner/Spinner";

import styles from "./editNews.module.scss";
import UploadImage from "../../../../uploadImage/UploadImage";

const EditNews = ({
  editedNews,
  setNews,
  setNewsId,
  setEditedNews,
  news,
  toggleOpen,
  toggleClose,
}) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      main_text: "",
      image_link: "",
    },
  });
  const {
    activeInput,
    setActiveInput,
    imagePreview,
    deletImagePreview,
    uploadImage,
    handleChange,
    handleSave,
    handleDelete,
    confirmDeleteNews,
    showMessageDeleteNews,
    closeMessageDeleteNews,
    newsToDelete,
    loading,
  } = EditNewsState({
    editedNews,
    setEditedNews,
    setNews,
    setNewsId,
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <CustomInput
        label="Введите Название новости:"
        type="text"
        name="name"
        error={errors.name}
        value={editedNews.name}
        handleChange={handleChange}
        isActive={activeInput === "name"}
        setActiveInput={setActiveInput}
        {...register("name", {
          required: "Это поле обязательно.",
          minLength: {
            value: 3,
            message: "Название должен содержать минимум 3 символа.",
          },
        })}
      />
      <textarea
        value={editedNews.main_text}
        onChange={handleChange}
        placeholder="Описание"
        className={styles["description"]}
        name="main_text"
      />
      <ImagePreview
        deletImagePreview={deletImagePreview}
        imagePreview={imagePreview}
      />
      <UploadImage onChange={uploadImage} />

      <BtnBlock
        className1={styles["g-btn"]}
        className2={styles["r-btn"]}
        className3={styles["r-btn"]}
        className4={styles["btn-block"]}
        label1="Сохранить"
        label2="Удалить новость"
        label3="Отменить"
        fnc1={() => handleSave(news.id)}
        fnc2={() => showMessageDeleteNews(news.id)}
        fnc3={() => setNewsId(null)}
        showThirdButton={true}
      />
      {confirmDeleteNews && newsToDelete === news.id && (
        <Modal
          toggleOpen={toggleOpen}
          toggleClose={toggleClose}
          setNewsId={closeMessageDeleteNews}
        >
          <h2 className={styles["choose-question"]}>
            Вы действительно хотите удалить новость?
          </h2>
          <BtnBlock
            className1={styles["g-btn"]}
            className2={styles["r-btn"]}
            className4={styles["btn-block"]}
            label1="Удалить новость"
            label2="Отменить"
            fnc1={() => handleDelete(news.id)}
            fnc2={closeMessageDeleteNews}
          />
        </Modal>
      )}
    </div>
  );
};

export default EditNews;
