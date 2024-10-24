 interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number; 
  }
  
interface ICardsData {
    get cards(): ICard[];
    set cards(cards: ICard[]);
    getCard(id: string): ICard | undefined;
  }
  
interface IBasketModel {
    add(item: ICard): void;
    remove(id: string): void;
    clear(): void;
    getTotal(): number;
    getTotalPrice(): number;
    getIds(): string[];
    isEmpty(): boolean;
    contains(id: string): boolean;
    items: ICard[];
  }

interface IOrderModel {
    set payment(payment: TPaymentMethod); 
    set email(email: string);
    set phone(phone: string);
    set address(address: string);
  }
  
type TPaymentMethod = '' | 'card' | 'cash';
  
interface IOrderDetails {
    payment: TPaymentMethod;
    email: string;
    phone: string;
    address: string;
  }
  
interface IPage {
    set counter(value: number);
    set catalog(items: HTMLElement[]);
    set locked(value: boolean);
    get basket(): HTMLElement;
  }
  
interface IModal {
    set content(value: HTMLElement);
      open(): void;
      close(): void;
  }
  
interface ICardView {
    render(data: ICard, index?: number, basketIds?: string[]): HTMLElement;
  }
  
interface IBasketView {
    render(data: { items: HTMLElement[]; price: number; isEmpty: boolean }): HTMLElement;
  }
  
interface IFormView {
    render(...args: any[]): HTMLElement;
  }
  
interface ISuccess {
    render(total: number): HTMLElement;
  }
  
type TApiSuccessResp = {id: string, total: number}