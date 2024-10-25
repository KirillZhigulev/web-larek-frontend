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

Архитектура

ЕR-модель:

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

//Типы и интерфейсы базовых классов

```
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};
```


`interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
  }`

//Ответ от сервера

`type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};`

//Запросы на сервер

`type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';`


//Методы для Api

`interface ILarekApi {
    getCardsList: () => Promise<ICard[]>;
    // getCard: (id: string) => Promise<ICard>;
    orderProducts: (order: IOrder) => Promise<IOrderSuccess>
  }`
  
//Интерфейсы моделей данных

`interface IAppStatus {
    catalog: ICard[];
    basket: ICard[];
    preview: string | null;
    delivery: IOrdersDelivery | null;
    contact: IOrdersContacts | null;
    order: IOrder | null;
  }`

//Интерфейсы компонентов представления

`interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}`

`interface ICard {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number | null,
    count?: string,
    buttonText? : string;
}`

`interface IOrdersDelivery {
    payment: string,
    address: string,
}`

`interface IOrdersContacts {
    email: string,
    phone: string,
}`

`interface IOrder extends IOrdersDelivery, IOrdersContacts {
    total: number | null,
    items: string[],
}`

`interface IOrderSuccess {
    id: string,
    total: number | null,
}`

`interface ISuccess {
    image: string,
    title: string,
    description: string,
    total: number | null,
}`

`interface IBasket {
    items: HTMLElement[];
    total: number;
}`

`type FormErrors = Partial<Record<keyof IOrder, string>>;`

`interface IActions {
    onClick: (event: MouseEvent) => void;
}`

`interface ISuccessActions {
    onClick: () => void;
}`