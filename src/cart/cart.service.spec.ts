import { CartService } from "./cart.service"
import { CartItem } from "./products.interface";

describe('CartService', () => {
    let cartService : CartService;
    let products : CartItem[] = [
        {
            id: 1, 
            name: 'iphone 17',
            price: 17000
        },
        {
            id: 2, 
            name: 'iphone 15 ProMax',
            price: 14000
        },
        {
            id: 3, 
            name: 'sumsung s25 ultra',
            price: 20000
        }
    ]

    beforeEach(() => {
        cartService = new CartService();
    })

    describe('addItem()', () => {
        it('add item to basket', () => {
            cartService.addItem(products[0])
            expect(cartService.getItems().length).toBe(1)
        })

        it('sum quantity on add 2 duplicate item in basket', ()=> {
            cartService.addItem(products[0])
            cartService.addItem(products[0])

            const item = cartService.getItems()[0]
            
            expect(cartService.getItems().length).toBe(1)
            expect(item.quantity).toBe(2)
        })

        it('check input type', () => {
            expect(() => {cartService.addItem({} as any)}).toThrow('Invalid item')
        })
    })

    describe('removeItem()', () => {
        it('check removed item', () => {
            cartService.addItem(products[0])
            cartService.addItem(products[2])
            cartService.addItem(products[2])

            cartService.removeItem(1)
            const items = cartService.getItems()
            
            expect(items.length).toBe(1)
            expect(items[0].quantity).toBe(2)
            expect(items[0].id).toBe(3)
        })
    })

    describe('getTotal()', () => {
        it('ckeck total price with multi product item', () =>{
            products[0].quantity = 1
            products[2].quantity = 3
            cartService.addItem(products[0])
            cartService.addItem(products[2])
            cartService.addItem(products[0])

            expect(cartService.getTotal()).toBe(94000)
        })

        it('check empty basket', () => {
            expect(cartService.getTotal()).toBe(0)
        })
    })
})