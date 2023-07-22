import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../config/firebase";
import { useThemeContext, useUserContext } from "../../contexts";
import { api } from "../../services";
import { useToast, useLocalStorage } from "../index";

function useSignWithGoogle() {
	const navigate = useNavigate();
	const toast = useToast();
	const { setUser } = useUserContext();
	const { setLocalTheme } = useThemeContext();
	const { localData, addInLocalStorage } = useLocalStorage();

	const googleProvider = new GoogleAuthProvider();
	const auth = getAuth(firebaseApp);

	const defaultValues = {
		username: "user_",
		avatar:
			"https://cdn.pixabay.com/photo/2020/12/18/01/27/smile-5840910_640.png",
	};

	return async () => {
		try {
			const { user } = await signInWithPopup(auth, googleProvider);

			const data = {
				username: user.displayName ?? defaultValues.username,
				avatar: user.photoURL ?? defaultValues.avatar,
				email: user.email!,
				password: user.uid,
			};

			api
				.postSignWithGoogle(data)
				.then((user) => {
					toast({
						type: "success",
						text: "Login realizado com sucesso!",
					});

					addInLocalStorage({ ...user });
					setUser({ ...user! });
					setLocalTheme(localData.theme || "light");

					navigate("/");
				})
				.catch((error) => {
					toast({
						type: "error",
						text:
							error?.cause?.message ||
							"Não foi possível realizar login. Por favor, tente novamente.",
					});
				});
		} catch (err) {}
	};
}

export { useSignWithGoogle };
