import { useEffect, useState } from "react";
import Head from "next/head";

export default function BottleMakerDefault() {
  const [previewTitle, setPreviewTitle] = useState("完成イメージ");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const color = params.get("color");
    const bgcolor = params.get("bgcolor");
    const title = params.get("title");

    if (color || bgcolor) {
      const style = document.createElement("style");
      style.id = "bm-color-override";
      let css = "";
      if (color) {
        const hex = color.startsWith("#") ? color : `#${color}`;
        css += `
          .preview__ttl,
          .control__ttl,
          .main__txt { color: ${hex} !important; }
          .control__btn-box { background-color: ${hex} !important; }
          .control__radio-item.is-active { border: 2px solid ${hex} !important; }
          .actionBtn { background-color: ${hex} !important; }
        `;
      }
      if (bgcolor) {
        const bghex = bgcolor.startsWith("#") ? bgcolor : `#${bgcolor}`;
        css += `
          .main { background-image: none !important; background-color: ${bghex} !important; }
        `;
      }
      style.textContent = css;
      document.head.appendChild(style);
    }

    if (title) setPreviewTitle(title);

    return () => {
      document.getElementById("bm-color-override")?.remove();
    };
  }, []);

  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];

    const loadScript = (src: string, onload?: () => void) => {
      const s = document.createElement("script");
      s.src = src;
      if (onload) s.onload = onload;
      document.body.appendChild(s);
      scripts.push(s);
    };

    loadScript("https://unpkg.com/three@0.128.0/build/three.min.js", () => {
      loadScript(
        "https://unpkg.com/three@0.128.0/examples/js/loaders/GLTFLoader.js",
        () => {
          loadScript(
            "https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js",
            () => {
              loadScript(
                "https://unpkg.com/three@0.128.0/examples/js/loaders/RGBELoader.js",
                () => {
                  loadScript("/bottle-maker/main.js");
                },
              );
            },
          );
        },
      );
    });

    return () => {
      scripts.forEach((s) => s.parentNode?.removeChild(s));
    };
  }, []);

  return (
    <>
      <Head>
        <title>オリジナルシャンパンラベルデザイナー</title>
        <link rel="stylesheet" href="/bottle-maker/style.css" />
        <style>{`
          #bottleContainer { height: 70rem; }
          @media (max-width: 1232px) { #bottleContainer { height: 55rem; } }
          @media (max-width: 768px) { #bottleContainer { height: 35rem; } }
        `}</style>
      </Head>

      <main className="main">
        <p className="main__txt">
          デザインの多少のずれ等は修正できます。
          <br />
          まずは完成したデザインをLINEよりお送りください。
        </p>

        <div className="preview">
          <h3 className="preview__ttl">{previewTitle}</h3>
          <div
            id="bottleContainer"
            className="bottle-container preview__bottle-container"
          >
            <canvas id="bottleCanvas"></canvas>
            <div className="loading" id="loadingIndicator">
              読み込み中...
            </div>
          </div>
        </div>

        <div className="control">
          {/* Step 1: ラベル画像アップロード */}
          <div className="control__wrap">
            <div className="control__inner">
              <div className="control__ttl-box">
                <img
                  src="/bottle-maker/assets/main-image/number_1.png"
                  alt="number-1"
                  className="control__number--1"
                />
                <h4 className="control__ttl">
                  ラベル画像を
                  <br />
                  アップロード
                </h4>
              </div>
              <span className="control__line"></span>
              <div className="control__box">
                <div className="control__box-inner">
                  <ul className="control__list">
                    <li className="control__txt">
                      ・テンプレートから画像を作成
                    </li>
                    <li className="control__txt">・ガイドラインから作成</li>
                  </ul>
                  <label htmlFor="labelUpload" className="control__btn-box">
                    <span className="control__btn-txt">ファイルを選択</span>
                    <span className="control__btn-icon-wrap">
                      <img
                        src="/bottle-maker/assets/main-image/right-arw.png"
                        alt="arrow-right"
                        className="control__btn-icon"
                      />
                    </span>
                    <input
                      type="file"
                      id="labelUpload"
                      accept="image/*"
                      className="control__input"
                    />
                  </label>
                </div>
                <p className="control__box-txt">
                  ※ .jpg / .jpeg / .png / .webp 形式が対応しています
                </p>
              </div>
            </div>
            <p className="control__txt--small">
              こちらの画像はイメージ画像となります。実際の仕上がりとは異なる場合もあるので詳しくはLINE公式よりお問い合わせください。
            </p>
          </div>

          {/* Step 2: キャップシールの色を選択 */}
          <div className="control__wrap">
            <div className="control__inner">
              <div className="control__ttl-box">
                <img
                  src="/bottle-maker/assets/main-image/number_2.png"
                  alt="number-2"
                  className="control__number--2"
                />
                <h4 className="control__ttl">
                  キャップシールの
                  <br />
                  色を選択
                </h4>
              </div>
              <span className="control__line"></span>
              <div className="control__box">
                <div className="control__box-inner">
                  <div className="control__radio-list">
                    {[
                      "gold",
                      "silver",
                      "pink",
                      "white",
                      "black",
                      "red",
                      "purple",
                      "pastelPink",
                      "pastelBlue",
                      "yellow",
                      "blue",
                      "orange",
                      "green",
                      "pastelPurple",
                      "bronze",
                    ].map((color) => (
                      <label key={color} className="control__radio-item">
                        <img
                          src={`/bottle-maker/assets/main-image/cap-${color}.png`}
                          alt={`cap-${color}`}
                          className="control__radio-img"
                        />
                        <input
                          type="radio"
                          id={`cap-${color}`}
                          name="cap-color"
                          className="control__radio"
                          value={`cap-${color}`}
                          defaultChecked={color === "silver"}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: ラベルシールの色を選択 */}
          <div className="control__wrap">
            <div className="control__inner">
              <div className="control__ttl-box">
                <img
                  src="/bottle-maker/assets/main-image/number_3.png"
                  alt="number-3"
                  className="control__number--3"
                />
                <h4 className="control__ttl">
                  ラベルシールの
                  <br />
                  色を選択
                </h4>
              </div>
              <span className="control__line"></span>
              <div className="control__box">
                <div className="control__box-inner">
                  <div className="control__radio-list">
                    {[
                      {
                        value: "label-gold",
                        src: "label-gold",
                        alt: "label-gold",
                        defaultChecked: true,
                      },
                      {
                        value: "label-black",
                        src: "label-black",
                        alt: "label-black",
                        defaultChecked: false,
                      },
                      {
                        value: "label-silver",
                        src: "label-white",
                        alt: "label-white",
                        defaultChecked: false,
                      },
                      {
                        value: "label-pink",
                        src: "label-pink",
                        alt: "label-pink",
                        defaultChecked: false,
                      },
                    ].map(({ value, src, alt, defaultChecked }) => (
                      <label key={value} className="control__radio-item">
                        <img
                          src={`/bottle-maker/assets/main-image/${src}.png`}
                          alt={alt}
                          className="control__radio-img"
                        />
                        <input
                          type="radio"
                          id={value}
                          name="label-color"
                          className="control__radio"
                          value={value}
                          defaultChecked={defaultChecked}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <p className="control__box-txt">
                  ※ラベル画像の制作・ご注文の方法は、マニュアルをご覧ください。
                  <br />
                  ※公式LINEからご注文ください。担当者より詳細の確認等をご連絡させていただきます。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="actionBtnList">
          <button id="saveBtn" className="btn btn-primary actionBtn">
            画像を保存
          </button>
          <button id="resetBtn" className="btn btn-secondary actionBtn">
            リセット
          </button>
        </div>
      </main>
    </>
  );
}
