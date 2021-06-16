import {Parser} from "json2csv";

export const convertToCsv = (request) => {
	const profile = request.toObject();
	const fields = Object.keys(profile);
	const parser = new Parser(fields);
	return parser.parse(profile);
};
