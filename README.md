# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), в которой презентер связан как с моделью, так и с отображением данных, но они ничего не знают друг о друге:

— слой представление, который отвечает за отображение данных на странице,

— слой данных, который отвечает за хранение и отправление данных на сервер,

— презентер, отвечающий за связь первых двух слоев (то есть слоев представления и данных).

## ЕR-модель:

![alt text](ERMPfinall.jpg)

1. Класс Api

Данный класс осуществляет работу с базовыми запросами к серверу (GET, POST, PUT, DELETE) и занимается обработкой ответов, полученных от сервера.
Класс имеет методы: 
`get` и `post` - для выполнения самх запросов к серверу, 
`handleRespons` - для обработки ответа сервера, его парсинга и обработки ошибок.

2. Класс EventEmitter
 
Реализует у класса механизм "Слушателя", который позволяет объекту этого класса получать оповещения об изменении состояния других объектов и тем самым наблюдать за ними.
Класс имеет методы `on` ,  `off` ,  `emit`  — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.

События, обрабатываемые классом EventEmitter

— items:changed - запускает callback, который формирует карточки товаров (Card); на каждую из карточек устанавливается обработчик события card:select;

— card:select - запускает callback, вызывающий метод setPreview, который, в свою очередь, запускает обработчик событие preview:changed;

— preview:changed - запускает callback, который берет id карточки, запрашивает по нему всю информацию о выбранном товаре, формирует превью и с помощью Modal.render() выводит на экран попап с выбранным товаром; на кнопку добавления товара в корзину вешается слушатель клика, который в свою очередь, запускает событие item:check;

— item:check - проверяет есть ли такой товар в корзине, если такого товара нет, то запускается событие item:add, который добавляет товар в объект заказа, в противном случае, если такой товар существует, запускается событие item:delete, удаляющее товар из корзины;

— order:open - запускает callback, который с помощью Modal.render() и данных класса OrdersDelivery формирует и отображает модальное окно с формой ввода адреса доставки и выбора способа оплаты; на кнопки выбора способа оплаты вешается слушатель, запускающий событие payment:changed, которое, в свою очередь, записывает выбранный способ оплаты в AppStatus.order.payment, на поле ввода вешается слушатель события ввода с клавиатуры, который запускает событие ordersDelivery:changed; на кнопку закрытия (крестик) вешается слушатель, который закрывает модальное окно и очищается форму ввода адреса доставки и выбранный способ оплаты;

— basket:open - запускает callback, который запрашивает у класса AppStatus актуальное состояние корзины, с помощью Modal.render() выводит на экран попап с содежимым корзины; на кнопку Оформить вешается слушатель клика, запускающий событие ordersDelivery:open, на кнопку закрытия попапа (крестик) вешается слушатель клика, по которому попап закрывается;

— basket:changed - запускает callback, который запрашивает у класса AppStatus список товаров в корзине; далее, если такого товара в корзине нет, то добавляет этот товар, увеличивает количество товара в корзине (count:changed) и общую стоимость корзины (total); далее, на кнопку удаления каждого из добавленных товаров устанавливается слушатель клика, который, в свою очередь запускает метод удаления товара из корзины и обновляет общую стоимость корзины;

— ordersDelivery:changed - запускает callback, который записывает данные в AppStatus.order.address, а так же валидирует поля ввода с помощью метода checkOredersDeliveryValidation(); на кнопку Далее вешается слушатель сабмита формы, запускающий событие order:submit в случае, если валидация поля прошла успешно;

— order:submit - запускает callback, который с помощью Modal.render() и данных класса OrdersContacts формирует и отображает модальное окно с формой ввода телефона и адреса электронной почты; на поля ввода вешается слушатель события ввода с клавиатуры, запускающий событие ordersContacts:changed; на кнопку закрытия попапа устанавливается слушатель события клика, который закрывает модальное окно, очищая при этом поля ввода формы контактов и формы доставки;

— ordersContacts:changed - запускает callback, который который записывает введенные данные в AppStatus.order.phone и AppStatus.order.email, а так же валидирует поля ввода данных с помощью метода checkOredersContactsValidation(); в случае успешной валидации кнопка Оплатить становится активной и на нее устанавливется слушатель события contacts:submit;

— contacts:submit - запускает callback, отправляющий сформированный объект заказа на сервер и, получив ответ об успешном оформлении заказа, очищает корзину и все формы заказа, сбрасывает состояние выбора способа оплаты и далее запускает событие success:open;

— modal:open - блокирует контент на странице под модальным окном;

— modal:close - разблокирует контент на странице под модальным окном.


3. Класс Model

Базовый класс, предназначенный для создания модельных данных, используемых для управления данными приложения. Напрямую "общается" с EventEmitter, принимая в конструктор данные модели и аргумент `events`.
Включает в себя только один метод:
`emitChanges` - для сообщения всем подписчикам о том, что модель изменилась. 

4. Класс Component

Базовый класс, который наследуется всеми компонентами - страница, корзина, карточки товаров, модальные окна. Назначение - создание HTML элементов и управление их свойствами.
В состав класса входят методы:

`toggleClass` - для переключения класса конкретного DOM-элемента,

`setImage` - для установки изображения (src) и альтернативного текста (alt) для конкретного DOM-элемента,

`setVisible` - для показа конкретного DOM-элемента,

`setHidden` - для скрытия конкретного DOM-элемента,

`setText` - для установки текста в свойство textContent конкретного DOM-элемента,

`setDisabled` - для "отключения" переданного DOM-элемента,

`render` - для генерации компонента и "отрисовки" его в разметке.

## Компоненты модели данных

Класс AppStatus для хранения актуального состояния приложения: данные о товаре, корзине, превью, заказе и ошибках. Наследуется от Модели (Model<IAppStatus>).

Методы класса:

— clearBasket - для очистки данных корзины,

— addItemToBasket - для добавления конкретного товара в корзину,

— deleteItemFromBasket - для удаления конкретного товара из корзины,

— setCards - для отрисовки каталога товаров,

— setPreview - для открытия предпросмотра товара,

— setOrderDelivery - для установки данных по доставке заказа,

— setOrdersContacts - для установки данных о контактах,

— checkOrdersValidation - для валидации формы заказа.

## Компоненты представления
Возможные классы для реализации в будущем:

_класс Basket - корзина товара/товаров,

_класс Card - карточка товара,

_класс Form - форма оформления заказа (поля ввода, валидация формы, подтверждения),

_класс Modal - универсальное модальное окно,

_класс Success - отображает информационное сообщение об успешной покупке,

_класс Page - для отображения элементов страницы (карточек товара, корзины и т.д.).

## Ключевые типы данных

// Типы и интерфейсы базовых классов

```
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};
```

```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
  }
```
// Ответ от сервера

```
type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};
```

// Запросы на сервер

```
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

```


// Методы для Api

```
interface ILarekApi {
    getCardsList: () => Promise<ICard[]>;
    orderProducts: (order: IOrder) => Promise<IOrderSuccess>
  }
```
  
## Компоненты представления

1. Класс Page
Класс представления всей страницы. Позволяет задать:

_counter: HTMLElement- элемент отображения количества товаров в корзине
_catalog: HTMLElement- элемент отображения всех доступных карточек
_wrapper: HTMLElement - обёртка, позволяющая блокировать прокрутку страницы при открытии модального окна
_basket: HTMLButtonElement- кнопка для отображения корзины. Клик по кнопке вызывает событие basket:open
Методы:

set counter - Устанавливаем количество лотов в корзине
set catalog - Обновляем список карточек
set locked - Обрабатываем блокировку страницы

2. Класс Modal
Класс представления модального окна. Позволяет задать

_content: HTMLElement - для отображения внутреннего содержания модального окна
_closeButton: HTMLButtonElement - для отображения кнопки закрытия модального окна
Привязывает события закрытие модального окна (modal:close) к кликам по кнопке закрытия формы и по родительскому контейнеру модального окна

Методы:

set content
open(): void- Показываем модальное окно
close(): void- Закрываем модальное окно
render(data: IModalData): HTMLElement - Используется для сбора окна

3. Класс Basket
Класс представления корзины. Позволяет задать:

_list: HTMLElement - список отображаемых элементов в корзине
_total: HTMLElement - общую ценность корзины
_button: HTMLButtonElement - кнопку открытия формы оформления заказа.
Методы:

set items - используется для добавления карточки в корзине
set total - устанавливается значение общей суммы товаров корзины
set valid - если товаров нет, будет заблокирована кнопка оформления заказа.

4. Класс Card
_title: HTMLElement - элемент отображения названия 
_image: HTMLImageElement - элемент отображеня изображения
_description: HTMLElement - элемент отображения описания
_button: HTMLButtonElement - элемент отображения  кнопки
_price: HTMLElement - элемент отображения стоимости
_category: HTMLElement - элемент отображения категории
Методы:

set category - установка категории
set title - установка названия карточки
set image - утсановка картинка карточки
set description - установка описания карточки
set price - установка цены
set button - установка текста на кнопке


5. Класс Form<T>
Класс представления базовой формы. Позволяет задать:

_submit: HTMLButtonElement - кнопку отправки формы
_errors: HTMLElement - блок отображения ошибок в форме
Методы:

set valid - сеттер для блокировки кнопки, если в поле нет данных;
set errors - сеттер для установки текстового значения ошибки;

6. Класс OrdersDelivery
Класс представления, наследующийся от класса Form, для отображения формы оформления заказа с информацией об способе оплаты с адресом доставки. Задаются следующие свойства:

payment - способ оплаты
address - адрес доставки
_paymentContainer: HTMLDivElement
_paymentButtons: HTMLButtonElement[]
Методы:

set payment - имеет тип string, используется для добавления способа оплаты
set address - имеет тип string, используется для добавления адресса
setClassPaymentMethod(className: string): void -  управление стилем кнопки в зависимости от выбранного способа оплаты

7. Класс OrdersContacts
Класс представления, наследующийся от класса Form, для отображения формы оформления заказа с контактной информацией. Задаются следующие свойства:

email - почта для связи
phone - телефон для связи
Методы:

set phone - имеет тип string, используется для добавления телефона
set email - имеет тип string, используется для добавления емайла

8. Класс Success
Класс представления, определяющий отображение основной информации об оформленном заказе:

total - общая сумма заказа (забираем из ответа сервера)
_close: HTMLElement - Элемент для закрытия страницы
_total: HTMLElement - Элемент для отображения общей стоимости заказа
Метод:

set total - установка общей стоимости заказа