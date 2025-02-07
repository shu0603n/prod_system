"use client"

import { useState } from "react"
import OrderForm from "./components/OrderForm"
import Summary from "./components/Summary"
import BottlePreview from "./components/BottlePreview"

export default function ChampagneCustomizer() {
  const [orders, setOrders] = useState([{ id: 1, bottleType: "", option: "", quantity: 1 }])
  const [selectedLabel, setSelectedLabel] = useState("/placeholder.svg?height=200&width=200")

  const addOrder = () => {
    setOrders([...orders, { id: orders.length + 1, bottleType: "", option: "", quantity: 1 }])
  }

  const updateOrder = (id: number, field: string, value: string | number) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, [field]: value } : order)))
  }

  const removeOrder = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">オリジナルシャンパンカスタマイザー</h1>
      <div className="space-y-8">
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderForm key={order.id} order={order} updateOrder={updateOrder} removeOrder={removeOrder} />
          ))}
          <button onClick={addOrder} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            注文を追加
          </button>
        </div>
        <Summary orders={orders} />
        <BottlePreview selectedLabel={selectedLabel} setSelectedLabel={setSelectedLabel} />
      </div>
    </div>
  )
}

