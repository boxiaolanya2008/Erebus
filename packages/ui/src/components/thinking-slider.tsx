import { Component, Show, For, createSignal, onCleanup } from "solid-js"

type ThinkingLevel = 0 | 1 | 2 | 3

const LEVEL_LABELS: Record<ThinkingLevel, string> = {
  0: "Off",
  1: "Minimal",
  2: "Normal",
  3: "Maximum",
}

const LEVEL_COLORS: Record<ThinkingLevel, string> = {
  0: "var(--v2-text-text-muted)",
  1: "#3b82f6",
  2: "#8b5cf6",
  3: "#f59e0b",
}

interface ThinkingSliderProps {
  value: ThinkingLevel
  onChange: (level: ThinkingLevel) => void
}

function ParticleEffect() {
  const [particles] = createSignal(
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 2 + Math.random() * 4,
      duration: 1 + Math.random() * 2,
      delay: Math.random() * 0.8,
      color: ["#f59e0b", "#f97316", "#ef4444", "#eab308", "#fbbf24"][i % 5],
    })),
  )

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        "pointer-events": "none",
        "z-index": "10",
      }}
    >
      <For each={particles()}>
        {(p) => (
          <div
            style={{
              position: "absolute",
              left: p.x + "%",
              top: p.y + "%",
              width: p.size + "px",
              height: p.size + "px",
              "border-radius": "50%",
              background: p.color,
              "box-shadow": "0 0 " + p.size * 2 + "px " + p.color,
              animation: "particle-float " + p.duration + "s " + p.delay + "s ease-out infinite",
            }}
          />
        )}
      </For>
      <style>{`
        @keyframes particle-float {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          20% { opacity: 1; transform: scale(1.5) translateY(-10px); }
          80% { opacity: 1; transform: scale(1) translateY(-40px); }
          100% { opacity: 0; transform: scale(0) translateY(-60px); }
        }
      `}</style>
    </div>
  )
}

export const ThinkingSlider: Component<ThinkingSliderProps> = (props) => {
  const levels: ThinkingLevel[] = [0, 1, 2, 3]

  const handleLevelClick = (level: ThinkingLevel) => {
    props.onChange(level)
  }

  const handleKeyDown = (e: KeyboardEvent, level: ThinkingLevel) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      props.onChange(level)
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      props.onChange(Math.min(3, level + 1) as ThinkingLevel)
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      props.onChange(Math.max(0, level - 1) as ThinkingLevel)
    }
  }

  return (
    <div style={{ position: "relative", padding: "8px 0" }}>
      <Show when={props.value === 3}>
        <ParticleEffect />
      </Show>

      <div
        style={{
          display: "flex",
          "align-items": "center",
          height: "32px",
          "border-radius": "16px",
          background: "var(--v2-background-bg-layer-02)",
          padding: "0 4px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background fill */}
        <div
          style={{
            position: "absolute",
            left: "4px",
            top: "4px",
            bottom: "4px",
            "border-radius": "12px",
            background: LEVEL_COLORS[props.value],
            opacity: "0.15",
            width: ((props.value + 1) / 4) * 100 + "%",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        <For each={levels}>
          {(level) => (
            <button
              onClick={() => handleLevelClick(level)}
              onKeyDown={(e) => handleKeyDown(e, level)}
              style={{
                flex: "1",
                height: "24px",
                "border-radius": "12px",
                border: "none",
                background: "transparent",
                color: props.value === level ? LEVEL_COLORS[level] : "var(--v2-text-text-muted)",
                "font-size": "11px",
                "font-weight": props.value === level ? "600" : "400",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "z-index": "1",
                position: "relative",
                "text-transform": "uppercase",
                "letter-spacing": "0.5px",
              }}
              aria-label={"Thinking level: " + LEVEL_LABELS[level]}
              aria-checked={props.value === level}
              role="radio"
            >
              {LEVEL_LABELS[level]}
            </button>
          )}
        </For>
      </div>

      {/* Glow effect at max level */}
      <Show when={props.value === 3}>
        <div
          style={{
            position: "absolute",
            inset: "-2px",
            "border-radius": "18px",
            border: "2px solid #f59e0b",
            "pointer-events": "none",
            animation: "thinking-glow 2s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes thinking-glow {
            0%, 100% { opacity: 0.3; box-shadow: 0 0 8px rgba(245, 158, 11, 0.3); }
            50% { opacity: 0.7; box-shadow: 0 0 16px rgba(245, 158, 11, 0.5); }
          }
        `}</style>
      </Show>
    </div>
  )
}

export type { ThinkingLevel }
