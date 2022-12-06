import { CoordinatePoint } from "./CoordinatePoint"

type Tank = {
    PlayerName: string,
    Position: CoordinatePoint,
    Health: number,
    Points: number
}

export type { Tank }