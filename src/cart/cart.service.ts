import { Injectable } from '@nestjs/common';
import { CartItem } from './products.interface';

@Injectable()
export class CartService {
  private cart: CartItem[] = [];

  addItem(item: CartItem): void {
    if (!item || typeof item.price !== 'number')
      throw new Error('Invalid item');
    if(item?.quantity) if(typeof item.quantity !== 'number') throw new Error('Invalid item')
  

    const existing = this.cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      if(!item.quantity) item.quantity = 1;
      this.cart.push(item);
    }
  }

  removeItem(id: number): void {
    this.cart = this.cart.filter(item => item.id !== id);
  }

  getTotal(): number {
    let total = 0;

    this.cart.forEach((item, key) => {
      total += (item.price * item.quantity);
    })

    return total;
  }

  clear(): void {
    this.cart = [];
  }

  getItems(): CartItem[] {
    return this.cart;
  }
}
