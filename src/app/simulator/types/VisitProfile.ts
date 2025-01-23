import { ProfileNames } from "../../simulation-setup/services/settings.service"
import { Time } from "../models/Time"
import { SimulatorOptions } from "./SimulatorOptions"

export type VisitProfile = {
    name: ProfileNames,
    profile: (time: Time, options: SimulatorOptions) => number
}