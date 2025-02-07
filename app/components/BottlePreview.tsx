"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { Vector2 } from "three"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const templates = [
  { id: "template1", name: "クラシック", url: "/placeholder.svg?height=200&width=200" },
  { id: "template2", name: "モダン", url: "/placeholder.svg?height=200&width=200" },
  { id: "template3", name: "エレガント", url: "/placeholder.svg?height=200&width=200" },
]

function createBottleGeometry() {
  const points = []
  const bodyHeight = 2
  const neckHeight = 1 // 首の長さを増加
  const totalHeight = bodyHeight + neckHeight

  // ボトルの底部
  points.push(new THREE.Vector2(0, 0))
  points.push(new THREE.Vector2(0.4, 0))
  points.push(new THREE.Vector2(0.4, 0))

  // ボトルの胴体
  points.push(new THREE.Vector2(0.4, bodyHeight * 0.1))
  points.push(new THREE.Vector2(0.38, bodyHeight * 0.3))
  points.push(new THREE.Vector2(0.36, bodyHeight * 0.7))
  points.push(new THREE.Vector2(0.34, bodyHeight))
  points.push(new THREE.Vector2(0.34, bodyHeight))

  // ボトルの肩
  points.push(new THREE.Vector2(0.3, bodyHeight + 0.1))
  points.push(new THREE.Vector2(0.2, bodyHeight + 0.2))
  points.push(new THREE.Vector2(0.2, bodyHeight + 0.2))

  // ボトルの首（長くなった）
  points.push(new THREE.Vector2(0.15, bodyHeight + 0.3))
  points.push(new THREE.Vector2(0.15, totalHeight - 0.2))
  points.push(new THREE.Vector2(0.13, totalHeight - 0.1))
  points.push(new THREE.Vector2(0.13, totalHeight - 0.1))

  return new THREE.LatheGeometry(points, 32)
}


function Bottle({ texture }: { texture: THREE.Texture }) {
  const mesh = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => createBottleGeometry(), [])

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, -1.5, 0]}>
      <meshPhongMaterial map={texture} />
    </mesh>
  )
}

interface BottlePreviewProps {
  selectedLabel: string
  setSelectedLabel: (url: string) => void
}

export default function BottlePreview({ selectedLabel, setSelectedLabel }: BottlePreviewProps) {
  const [zoom, setZoom] = useState(5)

  const texture = useLoader(THREE.TextureLoader, selectedLabel)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedLabel(URL.createObjectURL(file))
    }
  }

  const handleTemplateChange = (templateUrl: string) => {
    setSelectedLabel(templateUrl)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ボトルプレビュー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div style={{ height: "400px" }}>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, zoom]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <Bottle texture={texture} />
            <OrbitControls enableZoom={true} />
          </Canvas>
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={() => setZoom(Math.min(zoom + 1, 10))}>ズームイン</Button>
          <Button onClick={() => setZoom(Math.max(zoom - 1, 2))}>ズームアウト</Button>
        </div>
        <div>
          <Label>テンプレート選択</Label>
          <RadioGroup
            defaultValue={templates[0].id}
            onValueChange={(value: string) => {
              const template = templates.find((t) => t.id === value)
              if (template) {
                handleTemplateChange(template.url)
              }
            }}
          >
            {templates.map((template) => (
              <div key={template.id} className="flex items-center space-x-2">
                <RadioGroupItem value={template.id} id={template.id} />
                <Label htmlFor={template.id}>{template.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="custom-label">カスタムラベルをアップロード</Label>
          <input
            id="custom-label"
            type="file"
            onChange={handleFileUpload}
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </CardContent>
    </Card>
  )
}

