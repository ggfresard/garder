import * as LucideIcons from 'lucide-react'
import { LucideIcon } from 'lucide-react'

type LucideIconName = keyof typeof LucideIcons
const LucideIconMap = LucideIcons as unknown as Record<
    LucideIconName,
    LucideIcon
>

const Icons = {} as Record<LucideIconName, LucideIconName>

for (const key in LucideIconMap) {
    if (!key.endsWith('Icon') && !key.includes('Lucide')) {
        Icons[key as LucideIconName] = key as LucideIconName
    }
}

export { Icons, LucideIconMap, type LucideIconName }
