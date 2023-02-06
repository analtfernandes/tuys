import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts";
import api from "../../services/tuys";
import {
	useLocalStorage,
	useRequestMutation,
	useRequestQuery,
	useToast,
} from "../../hooks";
import { Icons } from "../utils";
import { Button, Form, Loading, Title } from "../shared";

export function Perfil() {
	const navigate = useNavigate();
	const toast = useToast();
	const { addInLocalStorage } = useLocalStorage();
	const { user, setUser } = useUserContext();

	const { data: userRegister, ...requestRegister } = useRequestQuery(
		["register", user.id, user.username],
		() => api.getRegister()
	);
	const updateRegister = useRequestMutation(
		["register", user.id, user.username],
		updateRegisterCallback
	);

	const [newData, setNewData] = useState(userRegister);
	const [emailIsVisible, setEmailIsVisible] = useState(false);

	if (updateRegister.isError) {
		toast({
			type: "error",
			text:
				updateRegister.error ||
				"Ocorreu um erro ao atualizar o perfil, tente novamente.",
		});
		updateRegister.reset();
		return null;
	}

	if (updateRegister.isSuccess) {
		toast({
			type: "success",
			text: "Perfil atualizado com sucesso!",
		});

		updateRegister.reset();

		if (newData) {
			const { username, avatar } = newData;
			addInLocalStorage({ username, avatar });
			setUser((prev) => ({ ...prev, username, avatar }));
		}
	}

	if (userRegister && !newData) {
		setNewData(userRegister);
	}

	function updateRegisterCallback() {
		if (newData) {
			const { id, email, ...body } = newData;
			return api.putRegister(body, id);
		}
	}

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		if (newData) {
			setNewData((prev) => {
				if (prev) {
					return { ...prev, [event.target.name]: event.target.value };
				}
			});
		}
	}

	function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (newData) {
			updateRegister.mutate(newData);
		}
	}

	return (
		<Wrapper>
			<>
				<Menu onClick={() => navigate("/settings")}>
					{window.innerWidth <= 500 && <Icons type="return" />}
					<Title>Perfil</Title>
				</Menu>

				{requestRegister.isLoading && <Loading />}

				{newData && (
					<Form onSubmit={handleUpdate}>
						<Form.Section margin="20px 0">
							<label>
								Nome de usuário <em>*</em>
							</label>
							<input
								required
								autoCapitalize="off"
								placeholder="Insira seu nome de usuário..."
								type="text"
								name="username"
								value={newData.username}
								onChange={handleChange}
							/>
						</Form.Section>

						<Form.Section margin="20px 0">
							<label>
								Avatar <em>*</em>
							</label>
							<input
								required
								autoCapitalize="off"
								placeholder="Insira a URL do seu avatar..."
								type="url"
								name="avatar"
								value={newData.avatar}
								onChange={handleChange}
							/>
						</Form.Section>

						<Form.Section margin="20px 0">
							<label>Email (campo não editável)</label>
							<InputSection>
								<input
									disabled={true}
									type={emailIsVisible ? "email" : "password"}
									value={newData.email}
								/>
								<Icons
									type={emailIsVisible ? "invisible" : "visible"}
									onClick={() => setEmailIsVisible((prev) => !prev)}
								/>
							</InputSection>
						</Form.Section>

						<Form.Section margin="20px 0">
							<label>Sobre</label>
							<textarea
								autoCapitalize="off"
								placeholder="Conte-nos sobre mais sobre você..."
								name="about"
								value={newData.about}
								onChange={handleChange}
							/>
						</Form.Section>

						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "end",
							}}
						>
							<Button config={{ margin: "0" }}>Atualizar</Button>
						</div>
					</Form>
				)}
			</>
		</Wrapper>
	);
}

const Wrapper = styled.section`
	svg {
		font-size: 1.3rem;
		margin-right: 5px;
		color: ${(props) => props.theme.colors.text};
	}
`;

const Menu = styled.div`
	width: fit-content;
	display: flex;
	align-items: center;
	cursor: pointer;
`;

const InputSection = styled.div`
	position: relative;
	cursor: inherit;

	> input {
		padding-right: 34px;
	}

	> svg {
		position: absolute;
		right: 3px;
		top: 9px;
	}
`;
