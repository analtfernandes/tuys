import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useThemeContext, useUserContext } from "../../contexts";
import api, { PostSignInParams } from "../../services/tuys";
import { useToast, useSignWithGoogle } from "../hooks";
import { Icons } from "../utils";
import { SignStyle } from "./SignStyle";

export default function SignIn() {
	const toast = useToast();
	const { setUser } = useUserContext();
	const { setLocalTheme } = useThemeContext();
	const signUpWithGoogle = useSignWithGoogle();
	const [form, setForm] = useState({} as PostSignInParams);

	const navigate = useNavigate();

	function handleForm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (form.password.length < 6) {
			toast({
				type: "warning",
				text: "A senha deve ter no mínimo 6 caracteres!",
			});
			return;
		}

		api
			.postSignIn(form)
			.then((response) => {
				toast({
					type: "success",
					text: "Login realizado com sucesso!",
				});

				const localData = JSON.parse(localStorage.getItem("tuys.com") || "{}");
				localStorage.setItem(
					"tuys.com",
					JSON.stringify({ ...localData, ...response })
				);
				if(response) setUser({ ...response });
				setLocalTheme(localData.theme || "light");

				navigate("/");
			})
			.catch((err) => {
				const error = JSON.parse(err.message);
				toast({
					type: "error",
					text:
						error?.message?.message ||
						"Não foi possível realizar login. Por favor, tente novamente.",
				});
			});
	}

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
	}

	return (
		<SignStyle>
			<h1>Login</h1>

			<form onSubmit={handleForm}>
				<div>
					<Icons type="email" />
					<input
						autoComplete="off"
						required
						name="email"
						type="email"
						placeholder="Email"
						onChange={handleChange}
					></input>
				</div>
				<div>
					<Icons type="password" />
					<input
						autoComplete="off"
						required
						name="password"
						type="password"
						placeholder="Senha"
						minLength={6}
						onChange={handleChange}
					></input>
				</div>

				<button>
					Entrar <Icons type="continue" />
				</button>
			</form>

			<SignStyle.OptionDiv />

			<SignStyle.GoogleButton onClick={signUpWithGoogle} />

			<Link to="/sign-up">
				<span>
					Não tem uma conta? <em>Cadastre-se! </em>
				</span>
			</Link>
		</SignStyle>
	);
}
