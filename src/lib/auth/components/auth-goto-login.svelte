<script lang="ts">
	import { APP_LOGIN_PAGE_PATH } from '$lib/core/services/app-environment-service';

	type PropsType = {
		message?: string;
		loginText?: string;
	};

	let { message = 'Already have an account?', loginText = 'Login here' }: PropsType = $props();

	let redirect: string = $state('');

	$effect(() => {
		redirect = new URLSearchParams(window.location.search).get('redirect') || '';
	});
</script>

<div class="flex items-center justify-center text-sm text-base-500">
	<div class="text-secondary">{message}</div>
	<div class="text-primary-600 px-3 font-semibold">
		<a href="{APP_LOGIN_PAGE_PATH}?redirect={redirect}">{loginText}</a>
	</div>
</div>
