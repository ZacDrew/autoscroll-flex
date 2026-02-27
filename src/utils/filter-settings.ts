import { Settings, SettingTarget } from "@/types/settings";


function assignSetting<K extends keyof Settings>(
    result: Partial<Settings>,
    settings: Settings,
    key: K
) {
    result[key] = settings[key];
}

export function filterSettings(settings: Settings, target: SettingTarget)
    : Partial<Settings> {
    const result: Partial<Settings> = {}

    for (const key in settings) {
        const k = key as keyof Settings

        if (settingTargets[k].includes(target)) {
            assignSetting(result, settings, k);
        }
    }
    return result;
}


// working alternative

// function getSettingsForContext<
//   T extends SettingTarget
// >(target: T) {
//   const result = {} as {
//     [K in keyof Settings as T extends typeof settingTargets[K][number]
//       ? K
//       : never]: Settings[K]
//   }

//   for (const key in settings) {
//     const typedKey = key as keyof Settings

//     if (settingTargets[typedKey].includes(target)) {
//       ;(result as any)[typedKey] = settings[typedKey]
//     }
//   }

//   return result
// }