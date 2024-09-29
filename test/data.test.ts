import { metadata } from "@shared/data"
import { describe, expect, it } from "vitest"

// 通过两次 diff 来找出数组的差异
describe("data", () => {
  it.for(Object.entries(metadata))(` "%s" source list shoule be unique`, ([, { sourceList }]) => {
    if (sourceList) {
      expect(new Set(sourceList).size).toBe(sourceList.length)
    }
  })
})
