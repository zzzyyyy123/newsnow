export const colors = [
  "blue", // #0000FF
  "indigo", // #4B0082
  "violet", // #EE82EE
  "purple", // #800080
  "fuchsia", // #FF00FF
  "pink", // #FFC0CB
  "rose", // #FF007F
  "amber", // #FFBF00
  "yellow", // #FFFF00
  "lime", // #00FF00
  "green", // #008000
  "emerald", // #50C878
  "teal", // #008080
  "cyan", // #00FFFF
  "sky", // #87CEEB
  "slate", // #708090
  "gray", // #808080
  "zinc", // #A0A0A0
  "neutral", // #828282
  "stone", // #D2B48C
  "red", // #FF0000
  "orange", // #FFA500
] as const

export type Color = typeof colors[number]
