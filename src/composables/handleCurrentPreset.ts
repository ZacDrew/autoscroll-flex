import { useSettings } from '@/composables/useSettings'
import { Context } from '@/types/settings';


export function handleCurrentPreset(context: Context) {

    const { state, update } = useSettings(context)
    
    const selectedPresetId = computed({
        get: () => {
            if (state.scrollMode === 'glide') return state.glidePresetSelected;
            if (state.scrollMode === 'step') return state.stepPresetSelected;
        },
        set: (id: string) => {
            if (state.scrollMode === 'glide') {
                state.glidePresetSelected = id;
                update('glidePresetSelected', id)
            }
            if (state.scrollMode === 'step') {
                state.stepPresetSelected = id;
                update('stepPresetSelected', id)
            };
        }
    })
    
    const presets = computed(() => {
        if (state.scrollMode === 'glide') return state.glidePresets;
        if (state.scrollMode === 'step') return state.stepPresets;
    })

    return { selectedPresetId, presets }
}