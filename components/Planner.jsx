"use client";
import { useEffect, useState } from "react";
import { SITE } from "../lib/config";
const TOTAL = 90; // 9 مواد × 10 سنوات (تقريبي)
export default function Planner() {
  const [n, setN] = useState(3),
    [wk, setWk] = useState(null);
  useEffect(
    () =>
      setWk(
        Math.max(
          0,
          Math.floor((new Date(SITE.examDate) - Date.now()) / 6048e5),
        ),
      ),
    [],
  );
  const need = Math.ceil(TOTAL / n),
    min = wk ? Math.ceil(TOTAL / wk) : null,
    ok = wk === null || wk === 0 || need <= wk;
  return (
    <div className="pl">
      <label htmlFor="pn">
        كم موضوعاً يحلّه ابنكم في الأسبوع؟ <b>{n}</b>
      </label>
      <input
        id="pn"
        type="range"
        min="1"
        max="15"
        value={n}
        onChange={(e) => setN(+e.target.value)}
      />
      <p className="res">
        بهذه الوتيرة ينهي حوالي {TOTAL} موضوعاً في <b>{need}</b> أسبوعاً.
      </p>
      {wk > 0 && (
        <p className={ok ? "good" : "warn"}>
          {ok
            ? `يتبقى حوالي ${wk} أسبوعاً على الامتحان، فالوتيرة كافية.`
            : `يتبقى حوالي ${wk} أسبوعاً فقط. الأفضل حلّ ${min} مواضيع أسبوعياً على الأقل.`}
        </p>
      )}
      <small>
        تقدير تقريبي: 9 مواد × 10 سنوات (2017–2026). ما يناسب ابنكم قد يختلف.
      </small>
    </div>
  );
}