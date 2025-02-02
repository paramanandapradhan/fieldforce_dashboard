<script lang="ts">
	import {
		Button,
		EmailField,
		mdiPhone,
		PasswordField,
		PhoneField,
		ripple,
		showToast,
		TextField
	} from '@cloudparker/moldex.js';
	import {
		getAuth,
		RecaptchaVerifier,
		signInWithEmailAndPassword,
		signInWithPhoneNumber,
		type ConfirmationResult
	} from 'firebase/auth';
	import { getAuthErrorMessage } from '../services/auth-errors-service';
	import AuthPrivacyTermConsent from './auth-privacy-term-consent.svelte';
	import { refreshClaimDelay } from '../services/auth-service.svelte';

	type PropsType = {
		title?: string;
	};

	let { title = 'Sign in to your account' }: PropsType = $props();

	class LoginState {
		static LOGIN_TYPE_EMAIL = 'email';
		static LOGIN_TYPE_PHONE = 'phone';
		static LOGIN_TYPE_PHONE_OTP_VERIFY = 'phone-otp-verify';
	}

	let isPhoneLoginAllowed = true;

	let countdown: number = $state(60);
	let email: string = $state('');
	let form: HTMLFormElement | null = $state(null);
	let isSubmited: boolean = $state(false);
	let password: string = $state('');
	let phone: string = $state('');
	let phoneOtp: string = $state('');
	let redirect: string = $state('');
	let loginType: LoginState = $state(LoginState.LOGIN_TYPE_EMAIL);

	let recaptchaVerifier: RecaptchaVerifier;
	let otpConfirmationResult: ConfirmationResult;

	function startCountdown() {
		const intervalId = setInterval(() => {
			countdown--;
			// console.log(countdown); // You can replace this with updating the DOM or some other action
			if (countdown <= 0) {
				clearInterval(intervalId); // Stop the countdown when it reaches 0
			}
		}, 1000); // Execute every second
	}

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		console.log('handleLogin called');
		if (!isSubmited) {
			isSubmited = true;
			if (loginType == LoginState.LOGIN_TYPE_EMAIL) {
				console.log({ email, password });
				if (email && password) {
					const auth = getAuth();
					await signInWithEmailAndPassword(auth, email, password).catch((error) => {
						console.error('Login Error!', error.code);
						console.error(error);
						showToast({ msg: getAuthErrorMessage(error.code) });
					});
				}
			} else if (loginType == LoginState.LOGIN_TYPE_PHONE) {
				await handleGetOtp();
			} else if (loginType == LoginState.LOGIN_TYPE_PHONE_OTP_VERIFY) {
				await handleVerifyOtp();
			}

			// Adding some delay to avoid enable the login button
			setTimeout(() => {
				isSubmited = false;
			}, 1000);
		}
	}

	const handleEnablePhoneLogin = () => {
		const auth = getAuth();
		auth.languageCode = 'en';
		loginType = LoginState.LOGIN_TYPE_PHONE;
		console.log('loginType', loginType);
		setTimeout(() => {
			try {
				recaptchaVerifier = new RecaptchaVerifier(auth, 'phone-otp-button', {
					size: 'invisible',
					callback: (response: any) => {
						// reCAPTCHA solved, allow signInWithPhoneNumber.
						// handleGetOtp();
						console.log('RecaptchaVerifier response', response);
					}
				});
				(window as any).recaptchaVerifier = recaptchaVerifier;
			} catch (error) {}
		}, 500);
	};

	const handleGetOtp = async () => {
		phone = (phone || '').trim();
		console.log('Phone', phone);
		if (phone) {
			try {
				const auth = getAuth();
				otpConfirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
				loginType = LoginState.LOGIN_TYPE_PHONE_OTP_VERIFY;
				showToast({ msg: 'OTP sent successfully' });
				startCountdown();
				// Disabled OTP auto detect, bz, firebase does not allow to change the sms format
				// for OTP detection sms must be formatted correctly : https://web.dev/web-otp/
				// registerAutoFillOtp();
			} catch (error) {
				console.error(error);
				showToast({ msg: 'Error on sending OTP' });
			}
		}
	};

	// Disabled OTP auto detect, bz, firebase does not allow to change the sms format
	// for OTP detection sms must be formatted correctly : https://web.dev/web-otp/
	const registerAutoFillOtp = () => {
		if ('OTPCredential' in window && navigator.credentials) {
			const ac = new AbortController();
			navigator.credentials
				.get({
					otp: { transport: ['sms'] },
					signal: ac.signal
				} as any)
				.then((otp: any) => {
					phoneOtp = otp.code;
					console.log('auto detect OTP', phoneOtp);
					setTimeout(() => {
						console.log('Now submitting the OTP login form', phoneOtp);
						form?.submit();
						ac.abort();
					}, 100);
				})
				.catch((err) => {
					console.log('auto detect OTP failed', phoneOtp);
					console.log(err);
					ac.abort();
				});
		}
	};

	const handleVerifyOtp = async () => {
		console.log('handleVerifyOtp called');
		if (otpConfirmationResult) {
			try {
				console.log('now confirming otp, ' + phoneOtp);
				let result = await otpConfirmationResult.confirm(phoneOtp);
				showToast({ msg: 'Login success' });
				refreshClaimDelay();
			} catch (error) {
				console.error(error);
				showToast({ msg: 'Error on verify OTP' });
			}
		} else {
			console.log('otpConfirmationResult not found');
		}
	};
</script>

<div class="sm:mx-auto sm:w-full sm:max-w-md">
	<img class="mx-auto h-10 w-auto" src="/icons/web/icon-192.png" alt="App Logo" />
	<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-base-900">
		{title}
	</h2>
</div>
<div class="my-10 mx-auto w-full max-w-[480px]">
	<div class="bg-white p-4 py-10 md:p-10 shadow rounded-lg">
		<form class="" onsubmit={handleSubmit} bind:this={form}>
			{#if loginType && loginType == LoginState.LOGIN_TYPE_EMAIL}
				<div>
					<div class="py-3">
						<EmailField
							name="email"
							bind:value={email as string}
							label="Email"
							required
							autofocus
							floatingLabel={false}
						/>
					</div>
					<div class="py-3">
						<PasswordField
							name="password"
							bind:value={password as string}
							label="Password"
							required={true}
							floatingLabel={false}
						/>
					</div>
					<div class="">
						<div class="text-sm text-end py-4">
							<a
								class="py-2 px-4 font-semibold text-primary-600 hover:text-primary-500"
								href="/forgot-password?email={email}&redirect={redirect}"
								use:ripple>Forgot Password?</a
							>
						</div>
						<div class="py-4 text-center">
							<Button
								id="btn-login"
								type="submit"
								disabled={isSubmited}
								appearance="primary"
								className="w-full"
							>
								<span>Login</span>
							</Button>
						</div>
					</div>
				</div>
			{/if}

			{#if loginType == LoginState.LOGIN_TYPE_PHONE}
				<div>
					<div class="py-3">
						<PhoneField
							name="phone"
							bind:value={phone as string}
							label="Phone number"
							required={true}
							autofocus={true}
							dialCode="+91"
							floatingLabel={false}
							className=""
						/>
					</div>
					<div class="py-4 text-center">
						<Button
							id="phone-otp-button"
							type="submit"
							disabled={isSubmited}
							spinner={isSubmited}
							appearance="primary"
							className="w-full"
						>
							Get OTP
						</Button>
					</div>
				</div>
			{/if}

			{#if loginType == LoginState.LOGIN_TYPE_PHONE_OTP_VERIFY}
				<div>
					<div class="py-3">
						<div class="grey">We sent an OTP to your phone number</div>
						<div class="bold grey pt-2 fs-6">
							{phone}
						</div>
					</div>
					<div class="py-3">
						<TextField
							name="otp"
							bind:value={phoneOtp as string}
							label="Enter OTP (6-digit)"
							maxlength={6}
							required={true}
							autofocus={true}
						/>
					</div>
					<div class="my-6 text-center">
						<Button
							id="sign-in-button"
							type="submit"
							appearance="primary"
							className="w-full"
							disabled={isSubmited}
							spinner={isSubmited}
							label="Login"
						></Button>
					</div>
				</div>
			{/if}

			<div class="text-sm text-base-500 mt-4">
				<div>
					<AuthPrivacyTermConsent></AuthPrivacyTermConsent>
				</div>
				{#if loginType == LoginState.LOGIN_TYPE_PHONE_OTP_VERIFY || loginType == LoginState.LOGIN_TYPE_PHONE}
					<p class=" text-center">A SMS may sent to you. Message & data rates may apply.</p>
				{/if}
			</div>

			<div class="relative mt-10">
				<div class="absolute inset-0 flex items-center" aria-hidden="true">
					<div class="w-full border-t border-base-200"></div>
				</div>
				<div class="relative flex justify-center text-sm font-medium leading-6">
					<span class="bg-white px-6 text-base-900">Or continue with</span>
				</div>
			</div>

			<div class="text-center">
				{#if loginType == LoginState.LOGIN_TYPE_EMAIL && isPhoneLoginAllowed}
					<div class="mt-12">
						<Button
							id="btn-phone-login"
							className="lex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-base-900 shadow-sm ring-1 ring-inset ring-base-300 hover:bg-base-50 focus-visible:ring-transparent"
							type="button"
							onClick={handleEnablePhoneLogin}
							iconPath={mdiPhone}
							iconClassName="!h-5 !w-5"
							label="Phone login"
						></Button>
					</div>
				{/if}
				{#if loginType == LoginState.LOGIN_TYPE_PHONE}
					<div class="text text-sm text-base-500 pt-6">I want to continue with Email login.</div>
					<div class="pt-6">
						<Button
							id="btn-try-email-login"
							type="button"
							className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-base-900 shadow-sm ring-1 ring-inset ring-base-300 hover:bg-base-50 focus-visible:ring-transparent"
							onClick={() => (loginType = LoginState.LOGIN_TYPE_EMAIL)}
						>
							Email Login
						</Button>
					</div>
				{/if}
				{#if loginType == LoginState.LOGIN_TYPE_PHONE_OTP_VERIFY}
					<Button
						id="btn-verify-phone-otp"
						type="button"
						disabled={countdown ? true : false}
						onClick={handleEnablePhoneLogin}
						className="w-full mt-6"
					>
						{#if countdown}
							Resend OTP in {countdown} sec
						{:else}
							Resend OTP
						{/if}
					</Button>
				{/if}
			</div>
		</form>
	</div>

	<p class="mt-10 text-center text-sm text-base-500">
		Not a member?
		<a
			href="/signup?redirect={redirect}"
			class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
		>
			Sign Up Now
		</a>
	</p>
</div>
