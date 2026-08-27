import { createContext, useEffect, useState } from "react"
import { getCart } from "../services/cartService"

export const CartContext = createContext()

export function CartProvider({ children }) {

    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await getCart()
                console.log("inside fetchcart")
                
                const items = res?.data?.data?.items
                console.log(items?.length)
                
                if (items) {
                    setCartCount(items.length)
                }
                
            } catch (error) {
                console.log(error)
            }
        }

        fetchCart()

    }, [])

    return (
        <CartContext.Provider value={{ cartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    )
}