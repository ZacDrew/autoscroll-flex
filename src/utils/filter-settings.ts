import { Settings, Context } from "@/types/settings";


function assignSetting<K extends keyof Settings>(
    result: Partial<Settings>,
    settings: Settings,
    key: K
) {
    result[key] = settings[key];
}

export function filterSettings(settings: Settings, target: Context)
    : Partial<Settings> {
    const result: Partial<Settings> = {}

    for (const key in settings) {
        const k = key as keyof Settings

        // console.log('k:', k)
        // console.log('settingTargets[k]:', settingTargets[k])

        if (settingTargets[k].includes(target)) {
            assignSetting(result, settings, k);
        }
    }
    return result;
}