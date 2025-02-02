<script lang="ts">
	import { onMount } from 'svelte';
	import { APP_THEME_KEY, AppThemeEnum } from '../services/app-theme-service';
	import { appState } from '../services/app-state.svelte';

	function isBrowserDarkTheme() {
		let res = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (res) {
			return AppThemeEnum.DARK;
		}
		return AppThemeEnum.LIGHT;
	}

	function readTheme() {
		return (localStorage.getItem(APP_THEME_KEY) as AppThemeEnum) || isBrowserDarkTheme();
	}

	onMount(() => {
		let selectedTheme = readTheme();
		appState.theme = selectedTheme;

		let classList = document.documentElement.classList;
		if (selectedTheme == AppThemeEnum.LIGHT) {
			classList.remove(AppThemeEnum.DARK);
		} else {
			classList.add(AppThemeEnum.DARK);
		}
	});
</script>
