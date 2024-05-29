import { useEffect, useState, useMemo } from 'react'
import { db } from '../data/db'

export const useCart = () => {
    const initialCart = () => {
        const actualCart = localStorage.getItem('cart');
        return actualCart ? JSON.parse(actualCart) : []
    }
    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);
    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;


    const handleAddToCart = (item) => {
        const indexItemExist = cart.findIndex(element => {
            return item.id === element.id
        })

        if (indexItemExist === -1) {
            item.quantity = 1
            setCart([...cart, item])
        } else {
            if (item.quantity >= MAX_ITEMS) return
            const newCart = [...cart]
            newCart[indexItemExist].quantity++
            setCart([...newCart])
        }
    }

    function deleteFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id) {
        const newCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }

            return item
        })
        setCart([...newCart])
    }

    function decreaseQuantity(id) {
        const newCart = cart.map(guitar => {
            if (guitar.id === id && guitar.quantity > MIN_ITEMS) {
                return {
                    ...guitar,
                    quantity: guitar.quantity - 1
                }
            }

            return guitar
        })

        setCart([...newCart])
    }

    function clearCart() {
        setCart([])
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    useEffect(() => {
        const carts = JSON.parse(localStorage.getItem('cart'))
        if (carts) {
            setCart(carts)
        }
    }, [])

    // State derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, guitar) => {
        return total + guitar.price * guitar.quantity
    }, 0), [cart])

    return {
        cart,
        data,
        handleAddToCart,
        deleteFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}
