import { Response } from "express";
import httpStatus from "http-status";

type params<Type> = {
	res: Response;
	body?: Type;
};

function OK<Type>({ res, body }: params<Type>) {
	return res.status(httpStatus.OK).send(body);
}

function CREATED<Type>({ res, body }: params<Type>) {
	return res.status(httpStatus.CREATED).send(body);
}

function NO_CONTENT<Type>({ res }: params<Type>) {
	return res.sendStatus(httpStatus.NO_CONTENT);
}

function BAD_REQUEST<Type>({ res, body }: params<Type>) {
	return res.status(httpStatus.BAD_REQUEST).send(body);
}

function NOT_FOUND<Type>({ res, body }: params<Type>) {
	return res.status(httpStatus.NOT_FOUND).send(body);
}

function CONFLICT<Type>({ res, body }: params<Type>) {
	return res.status(httpStatus.CONFLICT).send(body);
}

function UNAUTHORIZED<Type>({ res, body }: params<Type>) {
	return res.status(httpStatus.UNAUTHORIZED).send(body);
}

function SERVER_ERROR<Type>({ res, body }: params<Type>) {
	const message = { message: "Ocorreu um erro inesperado." };
	return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(body || message);
}

export {
	OK,
	CREATED,
	NO_CONTENT,
	NOT_FOUND,
	BAD_REQUEST,
	UNAUTHORIZED,
	SERVER_ERROR,
	CONFLICT,
};
