import { useState, useEffect } from "react"
import { bottleTypes } from "../data/bottleTypes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const options = ["なし", "ギフトボックス", "名入れ"]

interface OrderFormProps {
  order: { id: number; bottleType: string; option: string; quantity: number }
  updateOrder: (id: number, field: string, value: string | number) => void
  removeOrder: (id: number) => void
}

export default function OrderForm({ order, updateOrder, removeOrder }: OrderFormProps) {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const selectedBottle = bottleTypes.find((bottle) => bottle.name === order.bottleType)
    if (selectedBottle) {
      const priceInfo = selectedBottle.prices.find((p) => p.quantity <= order.quantity) || selectedBottle.prices[0]
      setTotal(priceInfo.price * order.quantity)
    }
  }, [order.bottleType, order.quantity])

  return (
    <div className="border p-4 mb-4 rounded">
      <div className="mb-4">
        <Label htmlFor={`bottleType-${order.id}`}>ボトルの種類:</Label>
        <Select value={order.bottleType} onValueChange={(value) => updateOrder(order.id, "bottleType", value)}>
          <SelectTrigger id={`bottleType-${order.id}`}>
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {bottleTypes.map((bottle) => (
              <SelectItem key={bottle.name} value={bottle.name}>
                {bottle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor={`option-${order.id}`}>オプション:</Label>
        <Select value={order.option} onValueChange={(value) => updateOrder(order.id, "option", value)}>
          <SelectTrigger id={`option-${order.id}`}>
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor={`quantity-${order.id}`}>本数:</Label>
        <Input
          id={`quantity-${order.id}`}
          type="number"
          value={order.quantity}
          onChange={(e) => updateOrder(order.id, "quantity", Number.parseInt(e.target.value))}
          min="1"
        />
      </div>
      <div className="mb-4">
        <strong>小計: ¥{total.toLocaleString()}</strong>
      </div>
      <Button onClick={() => removeOrder(order.id)} variant="destructive">
        削除
      </Button>
    </div>
  )
}

