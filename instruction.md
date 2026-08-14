# Публикация локального репозитория на GitHub через Git в Windows

Ниже приведена инструкция для PowerShell. Все команды нужно выполнять из папки проекта.

## 1. Установите и проверьте Git

Скачайте Git for Windows с [официального сайта](https://git-scm.com/download/win) и установите его. Затем откройте PowerShell и проверьте установку:

```powershell
git --version
```

## 2. Укажите имя и почту автора коммитов

Эти параметры настраиваются один раз для текущего пользователя Windows:

```powershell
git config --global user.name "Ваше имя"
git config --global user.email "ваша-почта@example.com"
```

Проверить настройки можно командой:

```powershell
git config --global --list
```

## 3. Перейдите в папку проекта

```powershell
cd "D:\Projects\RuneWorld\rune-world-main.github.io-main"
```

## 4. Инициализируйте репозиторий

Этот шаг нужен только в том случае, если в проекте еще нет локального Git-репозитория:

```powershell
git init
git branch -M main
```

## 5. Создайте первый коммит

Перед добавлением файлов проверьте, какие изменения будут включены:

```powershell
git status
git add .
git status
git commit -m "Initial commit"
```

## 6. Создайте репозиторий на GitHub

1. Войдите в GitHub и нажмите **New repository**.
2. Укажите имя репозитория.
3. Не добавляйте README, `.gitignore` и лицензию при создании: эти файлы уже могут находиться в локальном проекте.
4. Нажмите **Create repository**.
5. Скопируйте HTTPS-адрес созданного репозитория, например `https://github.com/USERNAME/REPOSITORY.git`.

## 7. Подключите GitHub и отправьте код

Замените адрес в примере на адрес своего репозитория:

```powershell
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

При первой отправке Git может открыть окно авторизации GitHub. Войдите в аккаунт и подтвердите доступ. Пароль от аккаунта напрямую в командную строку вводить не нужно.

Проверить подключенный адрес можно командой:

```powershell
git remote -v
```

Если удаленный адрес `origin` уже существует, замените его:

```powershell
git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
```

## Последующие обновления

После внесения изменений используйте следующий порядок команд:

```powershell
git status
git add .
git commit -m "Краткое описание изменений"
git push
```

Перед каждой отправкой проверяйте `git status`, чтобы случайно не опубликовать ненужные или конфиденциальные файлы.
