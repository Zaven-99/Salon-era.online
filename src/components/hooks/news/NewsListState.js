import { useState, useEffect } from "react";

export const NewsListState = (setNews) => {
  const [newsId, setNewsId] = useState(null);
  const [editedNews, setEditedNews] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/news/all", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка при получении новостей");
      const data = await response.json();

      setNews(data);
    } catch (error) {
      console.error("Ошибка при загрузке новостей:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchNews();
    })();
  }, []);

  const handleEdit = (news) => {
    setNewsId(news.id);
    setEditedNews(news);
  };

  const formatDate = (date) => {
    const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const localDate = new Date(date);
    localDate.setHours(localDate.getHours() + 3); // прибавляем +3 часа

    const formattedDate = localDate.toLocaleDateString("ru-RU", dateOptions);
    const formattedTime = localDate.toLocaleTimeString("ru-RU", timeOptions);

    return `${formattedDate}, ${formattedTime}`;
  };

  return {
    newsId,
    setNewsId,
    editedNews,
    setEditedNews,
    loading,
    setLoading,
    fetchNews,
    handleEdit,
    formatDate,
  };
};
