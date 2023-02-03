import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { PostSignUpParams } from "../../services/tuys";
import { useToast } from "../hooks";
import { Icons } from "../utils";
import { SignStyle } from "./SignStyle";

type SingUpForm = PostSignUpParams & {
	confirmPassword: string;
};

export default function SignUp() {
	const toast = useToast();
	const [form, setForm] = useState({} as SingUpForm);

	const navigate = useNavigate();

	function isValidateForm() {
		const avatarRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg)/g;
		let error = "";

		if (form.password !== form.confirmPassword) {
			error = "As senhas devem ser iguais!";
		}

		if (form.password.length < 6) {
			error = "A senha deve ter no mínimo 6 caracteres!";
		}

		if (!form.avatar.match(avatarRegex)) {
			error = "A URL da imagem deve ser válida!";
		}

		if (error) {
			toast({
				type: "warning",
				text: error,
			});
			return false;
		}

		return true;
	}

	function handleForm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!isValidateForm()) return;

		const { confirmPassword, ...body } = form;

		api
			.postSignUp(body)
			.then(() => {
				toast({
					type: "success",
					text: "Cadastro realizado com sucesso!",
				});
				navigate("/sign-in");
			})
			.catch((err) => {
				const error = JSON.parse(err.message);
				toast({
					type: "error",
					text:
						error?.message?.message ||
						"Não foi possível realizar o cadastro. Por favor, tente novamente.",
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
			<h1>Cadastro</h1>

			<form onSubmit={handleForm}>
				<div>
					<Icons type="me" />
					<input
						autoComplete="off"
						required
						name="username"
						type="text"
						placeholder="Nome de usuário"
						onChange={handleChange}
					></input>
				</div>
				<div>
					<Icons type="avatar" />
					<input
						autoComplete="off"
						required
						name="avatar"
						type="url"
						placeholder="Avatar"
						onChange={handleChange}
					></input>
				</div>
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
				<div>
					<Icons type="password" />
					<input
						autoComplete="off"
						required
						name="confirmPassword"
						type="password"
						placeholder="Confirme a senha"
						minLength={6}
						onChange={handleChange}
					></input>
				</div>

				<button>
					Cadastrar-se <Icons type="continue" />
				</button>
			</form>

			<Link to="/sign-in">
				<span>
					Já tem uma conta? <em>Entre! </em>
				</span>
			</Link>
		</SignStyle>
	);
}
