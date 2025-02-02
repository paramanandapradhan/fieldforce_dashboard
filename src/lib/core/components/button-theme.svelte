<script lang="ts">
	import { Icon, ripple } from '@cloudparker/moldex.js';
	import { mdiMoonWaningCrescent, mdiWhiteBalanceSunny } from '../services/app-icons-service';
	import { APP_THEME_KEY, AppThemeEnum } from '../services/app-theme-service';
	import { appState } from '../services/app-state.svelte';

	type PropsType = {
		className?: string;
		iconClassName?: string;
	};

	let { className, iconClassName }: PropsType = $props();

	function handleToggleTheme() {
		let newTheme = appState.theme == AppThemeEnum.LIGHT ? AppThemeEnum.DARK : AppThemeEnum.LIGHT;
		changeTheme(newTheme);
	}

	function changeTheme(selectedTheme: AppThemeEnum) {
		appState.theme = selectedTheme;

		localStorage.setItem(APP_THEME_KEY, selectedTheme);

		let classList = document.documentElement.classList;
		if (selectedTheme == AppThemeEnum.LIGHT) {
			classList.remove(AppThemeEnum.DARK);
		} else {
			classList.add(AppThemeEnum.DARK);
		}
	}
</script>

<button
	type="button"
	class="p-3 text-base-900 dark:text-base-50 {className}"
	use:ripple
	onclick={handleToggleTheme}
>
	<Icon
		path={appState.theme == AppThemeEnum.LIGHT ? mdiMoonWaningCrescent : mdiWhiteBalanceSunny}
		className={iconClassName}
	/>
</button>
