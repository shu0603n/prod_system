import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BottleMakerDefault = dynamic(
  () => import("../components/bottle-maker/BottleMakerDefault"),
  { ssr: false },
);
const BottleMakerOriShan = dynamic(
  () => import("../components/bottle-maker/BottleMakerOriShan"),
  { ssr: false },
);

export default function BottleMaker() {
  const [type, setType] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setType(params.get("type"));
    setReady(true);
  }, []);

  if (!ready) return null;

  if (type === "オリシャンメーカー") return <BottleMakerOriShan />;
  return <BottleMakerDefault />;
}
