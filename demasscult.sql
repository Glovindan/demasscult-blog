-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Ноя 06 2020 г., 19:51
-- Версия сервера: 10.3.13-MariaDB-log
-- Версия PHP: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `demasscult`
--

-- --------------------------------------------------------

--
-- Структура таблицы `blog_post`
--

CREATE TABLE `blog_post` (
  `post_id` int(11) NOT NULL,
  `post_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `post_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `blog_post`
--

INSERT INTO `blog_post` (`post_id`, `post_text`, `user_id`, `post_title`) VALUES
(1, 'Зато создан в редакторе', 1, 'Снова первый пост'),
(2, 'И снова в редакторе ёпта', 1, 'А это опять второй пост'),
(3, 'И я не намерен останавливаться', 1, 'Это уже третий пост'),
(6, 'What', 1, 'What'),
(8, 'DETKA', 1, 'PostPPunk'),
(9, 'Test', 1, 'Test'),
(10, 'asdasda', 1, 'asdasd'),
(13, 'test', 1, 'Test'),
(14, '<div><div>', 1, 'Test <div>'),
(16, 'aaa', 1, 'aa'),
(17, 'b', 1, 'a'),
(18, 'http://vk.com', 1, 'a'),
(21, '&^*@!@#!@$>!@$>!@<$>!@%>!@%><<!', 1, 'asdasd'),
(22, '\'asd\na\ndas\nd\nasd\nas\nd', 1, 'Да какого хуя'),
(23, 'Conteeeeeeeeeeeeeeeeeeeeeent', 1, 'Conteeeeeeeeeeeeeeeeeeeent'),
(24, 'So i need to remake it', 1, 'Какой же мерзкий шрифт я сделал'),
(25, 'Возможно и да\nНо это\nНе факт', 1, 'Создается ли пост?'),
(27, 'Типа епта', 1, 'Пока что последний пост'),
(28, 'ПРОЕБАЛСЯ FUUUUUUUUUUUCK', 1, 'на айти курсах');

-- --------------------------------------------------------

--
-- Структура таблицы `blog_user`
--

CREATE TABLE `blog_user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `blog_post`
--
ALTER TABLE `blog_post`
  ADD PRIMARY KEY (`post_id`);

--
-- Индексы таблицы `blog_user`
--
ALTER TABLE `blog_user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `blog_post`
--
ALTER TABLE `blog_post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT для таблицы `blog_user`
--
ALTER TABLE `blog_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
