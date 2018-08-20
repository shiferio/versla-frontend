# Versla

Проект создан с помощью [Angular CLI](https://github.com/angular/angular-cli) v6.0.5.

Требования к ПО:

- Node.js >= `8.11.3`

- NPM >= `5.6.0`

## Установка зависимостей

```
$ npm install
```

## Сервер для разработки

Запуск:

```
$ ng serve
```

Приложение доступно по адресу `http://localhost:4200/`. Приложение автоматически перезагружается, если обнаружены изменения в файлах.

## Сборка

С окружением по умолчанию:

```
$ ng build
```

С production-окружением:

```
ng build --prod
```

Файлы скомпилированного приложения будут расположены в папке `dist/Versla`.

## Патчи

`chat.patch`:

```
patch -i patches/chat.patch node_modules/ng-chat/ng-chat.es5.js
```
