import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../config/firebase";
import { useThemeContext, useUserContext } from "../contexts";
import api from "../services/tuys";
import { useToast } from "./useToast";

function useSignWithGoogle() {
	const toast = useToast();
	const { setUser } = useUserContext();
	const { setLocalTheme } = useThemeContext();
	const navigate = useNavigate();

	const googleProvider = new GoogleAuthProvider();
	const auth = getAuth(firebaseApp);

	const defaultValues = {
		username: "user_",
		email: "user@gmail.com",
		avatar:
			"https://cdn.pixabay.com/photo/2020/12/18/01/27/smile-5840910_640.png",
	};

	return async () => {
		try {
			const { user } = await signInWithPopup(auth, googleProvider);

			const data = {
				username: user.displayName || defaultValues.username,
				avatar: user.photoURL || defaultValues.avatar,
				email: user.email || defaultValues.email,
				password: user.uid,
			};

			api
				.postSignWithGoogle(data)
				.then((response) => {
					toast({
						type: "success",
						text: "Login realizado com sucesso!",
					});

					const localData = JSON.parse(
						localStorage.getItem("tuys.com") || "{}"
					);
					localStorage.setItem(
						"tuys.com",
						JSON.stringify({ ...localData, ...response })
					);
					if (response) setUser({ ...response });
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
		} catch (err) {}
	};
}

export { useSignWithGoogle };
