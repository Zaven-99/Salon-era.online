import React from "react";

import styles from "./newsCard.module.scss";

const NewsCard = ({ news, formatDate }) => {
  return (
    <div className={styles["news-card"]}>
      {news.image_link === null ? (
        ""
      ) : (
        <img className={styles["news-img"]} src={news.image_link} alt="" />
      )}

      <h2 className={styles.name}>{news.name}</h2>
      <p className={styles["main-text"]}>{news.main_text}</p>
      <p>{formatDate(news.createdAt)}</p>
    </div>
  );
};

export default NewsCard;
