export enum Tour {
  ST = "Steel Trap",
  OS = "Oil Spill",
  GG = "Gear Grinder",
  ME = "Mecha Engine",
  TC = "Two Cities"
}

export enum TourCode {
  "Steel Trap" = "ST",
  "Oil Spill" = "OS",
  "Gear Grinder" = "GG",
  "Mecha Engine" = "ME",
  "Two Cities" = "TC"
}

export const Missions = {
  [Tour.ST]: [
    "Disk Deletion",
    "Data Demolition",
    "Ctrl+Alt+Destruction",
    "CPU Slaughter",
    "Machine Massacre",
    "Mech Mutilation"
  ],
  [Tour.OS]: [
    "Doe's Doom",
    "Day of Wreckening",
    "Cave-in",
    "Quarry",
    "Mean Machines",
    "Mannhunt"
  ],
  [Tour.GG]: ["Desperation", "Cataclysm", "Mannslaughter"],
  [Tour.ME]: ["Disintegration", "Broken Parts", "Bone Shaker"],
  [Tour.TC]: [
    "Empire Escalation",
    "Metro Malice",
    "Hamlet Hostility",
    "Bavarian Botbash"
  ]
};
