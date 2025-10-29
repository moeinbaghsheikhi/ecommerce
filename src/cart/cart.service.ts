import { Injectable } from '@nestjs/common';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable()
export class CartService {
  private cart: CartItem[] = [];

  addItem(item: CartItem): void {
    if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number')
      throw new Error('Invalid item');

    const existing = this.cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cart.push(item);
    }
  }

  removeItem(id: number): void {
    this.cart = this.cart.filter(item => item.id !== id);
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  clear(): void {
    this.cart = [];
  }

  getItems(): CartItem[] {
    return this.cart;
  }
}
