import { bottleTypes } from "../data/bottleTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummaryProps {
  orders: { id: number; bottleType: string; option: string; quantity: number }[]
}

export default function Summary({ orders }: SummaryProps) {
  const total = orders.reduce((sum, order) => {
    const bottleType = bottleTypes.find((bt) => bt.name === order.bottleType)
    if (bottleType) {
      const priceInfo = bottleType.prices.find((p) => p.quantity <= order.quantity) || bottleType.prices[0]
      return sum + priceInfo.price * order.quantity
    }
    return sum
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>注文サマリー</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.map((order) => (
          <div key={order.id} className="mb-2">
            {order.bottleType} x {order.quantity} ({order.option})
          </div>
        ))}
        <div className="text-xl font-bold mt-4">合計: ¥{total.toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}

