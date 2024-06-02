<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получение данных из формы
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];

    // Настройки для отправки письма
    $to = "admruneworld@gmail.com";
    $subject = "Новая заявка на сайте RuneWorld";
    $message = "Имя: $name\nEmail: $email\nДискорд: $phone";
    $headers = "From: $email";

    // Отправка письма
    if (mail($to, $subject, $message, $headers)) {
        echo "Заявка успешно отправлена!";
    } else {
        echo "Произошла ошибка при отправке заявки.";
    }
}
?>
