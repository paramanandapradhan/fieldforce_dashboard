import { AppThemeEnum } from "./app-theme-service";

export let appState: { theme: AppThemeEnum } = $state({ theme: AppThemeEnum.LIGHT });